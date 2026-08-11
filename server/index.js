import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import prismaClientPackage from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const { PrismaClient } = prismaClientPackage;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_URL =
  process.env.DATABASE_URL ??
  `file:${path.resolve(__dirname, "../prisma/dev.db")}`;
const adapter = new PrismaLibSql({ url: DB_URL });

const app = express();
const prisma = new PrismaClient({ adapter });
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
    const subscriber = await prisma.mailingSubscriber.create({
      data: {
        playerName,
        playerPosition,
        playerBirthYear: parseInt(playerBirthYear),
        mostRecentTeam,
        parentGuardianEmail,
      },
    });
    res.status(201).json(subscriber);
  } catch (err) {
    if (err.code === "P2002") {
      return res
        .status(409)
        .json({ error: "This email is already on the mailing list" });
    }
    res.status(500).json({ error: "Failed to join mailing list" });
  }
});

app.get("/api/mailing-list", requireAdmin, async (_req, res) => {
  const subscribers = await prisma.mailingSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  res.json(subscribers);
});

app.delete("/api/mailing-list/:id", requireAdmin, async (req, res) => {
  await prisma.mailingSubscriber.delete({
    where: { id: parseInt(req.params.id) },
  });
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
  const admin = await prisma.admin.findUnique({ where: { username } });
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
    const player = await prisma.player.create({
      data: {
        playerName,
        age: parseInt(age),
        position,
        parentName,
        email,
        phone,
        notes,
        lessonSignup: { create: { status: "pending" } },
      },
      include: { lessonSignup: true },
    });
    res.status(201).json(player);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create signup", detail: err.message });
  }
});

app.get("/api/signups/lessons", requireAdmin, async (_req, res) => {
  const signups = await prisma.lessonSignup.findMany({
    include: { player: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(signups);
});

app.patch("/api/signups/lessons/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const signup = await prisma.lessonSignup.update({
    where: { id: parseInt(req.params.id) },
    data: { status },
  });
  res.json(signup);
});

app.delete("/api/signups/lessons/:id", requireAdmin, async (req, res) => {
  await prisma.lessonSignup.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// ── Clinics ──────────────────────────────────────────────────────────────────
app.get("/api/clinics", async (_req, res) => {
  const clinics = await prisma.clinic.findMany({
    include: { _count: { select: { signups: true } } },
    orderBy: { date: "asc" },
  });
  res.json(clinics);
});

app.post("/api/clinics", requireAdmin, async (req, res) => {
  const { name, date, time, location, ageGroup, maxPlayers, description } =
    req.body;
  const clinic = await prisma.clinic.create({
    data: {
      name,
      date: new Date(date),
      time,
      location,
      ageGroup,
      maxPlayers: parseInt(maxPlayers) || 20,
      description,
    },
  });
  res.status(201).json(clinic);
});

app.delete("/api/clinics/:id", requireAdmin, async (req, res) => {
  await prisma.clinic.delete({ where: { id: parseInt(req.params.id) } });
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
    const clinic = await prisma.clinic.findUnique({
      where: { id: parseInt(clinicId) },
      include: { _count: { select: { signups: true } } },
    });
    if (!clinic) return res.status(404).json({ error: "Clinic not found" });
    if (clinic._count.signups >= clinic.maxPlayers) {
      return res.status(400).json({ error: "This clinic is full" });
    }
    const player = await prisma.player.create({
      data: {
        playerName,
        age: parseInt(age),
        position,
        parentName,
        email,
        phone,
        notes,
        clinicSignups: {
          create: { clinicId: parseInt(clinicId), status: "pending" },
        },
      },
      include: { clinicSignups: true },
    });
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
    res.status(201).json({ ...player, emailSent });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create signup", detail: err.message });
  }
});

app.get("/api/signups/clinics", requireAdmin, async (_req, res) => {
  const signups = await prisma.clinicSignup.findMany({
    include: { player: true, clinic: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(signups);
});

app.patch("/api/signups/clinics/:id/status", requireAdmin, async (req, res) => {
  const { status } = req.body;
  const signup = await prisma.clinicSignup.update({
    where: { id: parseInt(req.params.id) },
    data: { status },
  });
  res.json(signup);
});

app.delete("/api/signups/clinics/:id", requireAdmin, async (req, res) => {
  await prisma.clinicSignup.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

// ── Seed admin on startup ────────────────────────────────────────────────────
async function seedAdmin() {
  const existing = await prisma.admin.findFirst();
  if (!existing) {
    const hash = await bcrypt.hash("h3hockey2024", 10);
    await prisma.admin.create({ data: { username: "admin", password: hash } });
    console.log("Admin seeded — username: admin, password: h3hockey2024");
  }
}

app.listen(PORT, async () => {
  await seedAdmin();
  console.log(`H3 Hockey API running on http://localhost:${PORT}`);
});
