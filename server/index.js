import "dotenv/config";
import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured",
  );
}

const app = express();
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "h3hockey-secret";
const EMAIL_FROM = process.env.EMAIL_FROM || process.env.SMTP_USER;
const mailer =
  process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      })
    : null;

async function sendClinicConfirmation({
  email,
  parentName,
  playerName,
  clinic,
}) {
  if (!mailer || !EMAIL_FROM) {
    console.warn("Clinic confirmation email not sent: SMTP is not configured.");
    return false;
  }

  await mailer.sendMail({
    from: EMAIL_FROM,
    to: email,
    subject: `Clinic registration received — ${clinic.name}`,
    text: [
      `Hi ${parentName},`,
      "",
      `We've received ${playerName}'s registration for ${clinic.name}.`,
      `Date: ${new Date(clinic.date).toLocaleDateString("en-US", { dateStyle: "long" })}`,
      `Time: ${clinic.time}`,
      `Location: ${clinic.location}`,
      "",
      "Your registration is pending confirmation. We'll be in touch with any additional details.",
      "",
      "H3 Hockey Development",
      "h3hockeydevelopment@gmail.com",
    ].join("\n"),
  });
  return true;
}

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ── Mailing list ────────────────────────────────────────────────────────────
app.post("/api/mailing-list", async (req, res) => {
  const {
    playerName,
    playerPosition,
    playerBirthYear,
    mostRecentTeam,
    parentGuardianEmail,
  } = req.body;
  if (
    !playerName ||
    !playerPosition ||
    !playerBirthYear ||
    !mostRecentTeam ||
    !parentGuardianEmail
  ) {
    return res.status(400).json({ error: "All fields must be filled" });
  }
  try {
    const { data: subscriber, error } = await supabase
      .from("MailingSubscriber")
      .insert({
        playerName,
        playerPosition,
        playerBirthYear: parseInt(playerBirthYear),
        mostRecentTeam,
        parentGuardianEmail,
      })
      .select()
      .single();
    if (error) throw error;
    res.status(201).json(subscriber);
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "This email is already on the mailing list" });
    }
    res.status(500).json({ error: "Failed to join mailing list" });
  }
});

app.get("/api/mailing-list", requireAdmin, async (_req, res) => {
  const { data: subscribers, error } = await supabase
    .from("MailingSubscriber")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error)
    return res.status(500).json({ error: "Failed to load mailing list" });
  res.json(subscribers);
});

app.delete("/api/mailing-list/:id", requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from("MailingSubscriber")
    .delete()
    .eq("id", parseInt(req.params.id));
  if (error)
    return res.status(500).json({ error: "Failed to remove subscriber" });
  res.json({ success: true });
});

// ── Auth middleware ──────────────────────────────────────────────────────────
function requireAdmin(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ error: "Unauthorized" });
  try {
    req.admin = jwt.verify(auth.slice(7), JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Admin auth ───────────────────────────────────────────────────────────────
app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const { data: admin } = await supabase
    .from("Admin")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    JWT_SECRET,
    { expiresIn: "24h" },
  );
  res.json({ token });
});

// ── Lesson signups ───────────────────────────────────────────────────────────
app.post("/api/signups/lessons", async (req, res) => {
  const { playerName, age, position, parentName, email, phone, notes } =
    req.body;
  if (!playerName || !age || !position || !parentName || !email || !phone) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }
  try {
    const { data: player, error: playerError } = await supabase
      .from("Player")
      .insert({
        playerName,
        age: parseInt(age),
        position,
        parentName,
        email,
        phone,
        notes,
      })
      .select()
      .single();
    if (playerError) throw playerError;
    const { data: lessonSignup, error: signupError } = await supabase
      .from("LessonSignup")
      .insert({ playerId: player.id, status: "pending" })
      .select()
      .single();
    if (signupError) throw signupError;
    const result = { ...player, lessonSignup };
    res.status(201).json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create signup", detail: err.message });
  }
});

app.get("/api/signups/lessons", requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from("LessonSignup")
    .select("*, player:Player(*)")
    .order("createdAt", { ascending: false });
  if (error)
    return res.status(500).json({ error: "Failed to load lesson signups" });
  res.json(data);
});

app.patch("/api/signups/lessons/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { data: signup, error } = await supabase
    .from("LessonSignup")
    .update({ status })
    .eq("id", parseInt(req.params.id))
    .select()
    .single();
  if (error) return res.status(500).json({ error: "Failed to update signup" });
  res.json(signup);
});

app.delete("/api/signups/lessons/:id", requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from("LessonSignup")
    .delete()
    .eq("id", parseInt(req.params.id));
  if (error) return res.status(500).json({ error: "Failed to delete signup" });
  res.json({ success: true });
});

// ── Clinics ──────────────────────────────────────────────────────────────────
async function getClinicsWithCounts() {
  const [
    { data: clinics, error: clinicError },
    { data: signups, error: signupError },
  ] = await Promise.all([
    supabase.from("Clinic").select("*").order("date", { ascending: true }),
    supabase.from("ClinicSignup").select("clinicId"),
  ]);
  if (clinicError) throw clinicError;
  if (signupError) throw signupError;
  return clinics.map((clinic) => ({
    ...clinic,
    _count: {
      signups: signups.filter((signup) => signup.clinicId === clinic.id).length,
    },
  }));
}

app.get("/api/clinics", async (_req, res) => {
  try {
    res.json(await getClinicsWithCounts());
  } catch (error) {
    res.status(500).json({ error: "Failed to load clinics" });
  }
});

app.post("/api/clinics", requireAdmin, async (req, res) => {
  const { name, date, time, location, ageGroup, maxPlayers, description } =
    req.body;
  const { data: clinic, error } = await supabase
    .from("Clinic")
    .insert({
      name,
      date: new Date(date).toISOString(),
      time,
      location,
      ageGroup,
      maxPlayers: parseInt(maxPlayers) || 20,
      description,
    })
    .select()
    .single();
  if (error) return res.status(500).json({ error: "Failed to create clinic" });
  res.status(201).json(clinic);
});

app.delete("/api/clinics/:id", requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from("Clinic")
    .delete()
    .eq("id", parseInt(req.params.id));
  if (error) return res.status(500).json({ error: "Failed to delete clinic" });
  res.json({ success: true });
});

// ── Clinic signups ───────────────────────────────────────────────────────────
app.post("/api/signups/clinics", async (req, res) => {
  const {
    playerName,
    age,
    position,
    parentName,
    email,
    phone,
    notes,
    clinicId,
  } = req.body;
  if (
    !playerName ||
    !age ||
    !position ||
    !parentName ||
    !email ||
    !phone ||
    !clinicId
  ) {
    return res
      .status(400)
      .json({ error: "All required fields must be filled" });
  }
  try {
    const [{ data: clinic }, { data: existingSignups, error: countError }] =
      await Promise.all([
        supabase
          .from("Clinic")
          .select("*")
          .eq("id", parseInt(clinicId))
          .maybeSingle(),
        supabase
          .from("ClinicSignup")
          .select("id")
          .eq("clinicId", parseInt(clinicId)),
      ]);
    if (countError) throw countError;
    if (!clinic) return res.status(404).json({ error: "Clinic not found" });
    if (existingSignups.length >= clinic.maxPlayers) {
      return res.status(400).json({ error: "This clinic is full" });
    }
    const { data: player, error: playerError } = await supabase
      .from("Player")
      .insert({
        playerName,
        age: parseInt(age),
        position,
        parentName,
        email,
        phone,
        notes,
      })
      .select()
      .single();
    if (playerError) throw playerError;
    const { data: clinicSignup, error: signupError } = await supabase
      .from("ClinicSignup")
      .insert({
        playerId: player.id,
        clinicId: parseInt(clinicId),
        status: "pending",
      })
      .select()
      .single();
    if (signupError) throw signupError;
    let emailSent = false;
    try {
      emailSent = await sendClinicConfirmation({
        email,
        parentName,
        playerName,
        clinic,
      });
    } catch (emailError) {
      console.error("Clinic confirmation email failed:", emailError.message);
    }
    res
      .status(201)
      .json({ ...player, clinicSignups: [clinicSignup], emailSent });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create signup", detail: err.message });
  }
});

app.get("/api/signups/clinics", requireAdmin, async (_req, res) => {
  const { data, error } = await supabase
    .from("ClinicSignup")
    .select("*, player:Player(*), clinic:Clinic(*)")
    .order("createdAt", { ascending: false });
  if (error)
    return res.status(500).json({ error: "Failed to load clinic signups" });
  res.json(data);
});

app.patch("/api/signups/clinics/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const { data: signup, error } = await supabase
    .from("ClinicSignup")
    .update({ status })
    .eq("id", parseInt(req.params.id))
    .select()
    .single();
  if (error) return res.status(500).json({ error: "Failed to update signup" });
  res.json(signup);
});

app.delete("/api/signups/clinics/:id", requireAdmin, async (req, res) => {
  const { error } = await supabase
    .from("ClinicSignup")
    .delete()
    .eq("id", parseInt(req.params.id));
  if (error) return res.status(500).json({ error: "Failed to delete signup" });
  res.json({ success: true });
});

// ── Seed admin on startup ────────────────────────────────────────────────────
async function seedAdmin() {
  const { data: existing } = await supabase
    .from("Admin")
    .select("id")
    .limit(1)
    .maybeSingle();
  if (!existing) {
    const hash = await bcrypt.hash("h3hockey2024", 10);
    const { error } = await supabase
      .from("Admin")
      .insert({ username: "admin", password: hash });
    if (error) throw error;
    console.log("Admin seeded — username: admin, password: h3hockey2024");
  }
}

if (process.env.VERCEL !== "1") {
  app.listen(PORT, async () => {
    await seedAdmin();
    console.log(`H3 Hockey API running on http://localhost:${PORT}`);
  });
}

export default app;
