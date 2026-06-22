<template>
  <main>
    <!-- ── Full-viewport hero ─────────────────────────────────────────────── -->
    <section class="hero">
      <!-- centered content -->
      <div class="hero-content">
        <img
          src="../assets/logo.png"
          alt="H3 Hockey Development"
          class="hero-logo"
        />

        <div class="hero-badge">Est. 2010 · Head · Heart · Hustle</div>

        <h1 class="hero-headline">
          Take Your Game<br />
          <span class="text-lime">To The Next Level</span>
        </h1>

        <p class="hero-sub">
          Elite hockey development for players and goalies of all ages. Private
          lessons and clinics designed to build the complete hockey player.
        </p>

        <div class="hero-ctas">
          <RouterLink to="/lessons" class="btn btn-primary btn-lg"
            >Book Private Lessons</RouterLink
          >
          <RouterLink to="/clinics" class="btn btn-outline btn-lg"
            >View Clinics</RouterLink
          >
        </div>

        <div class="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </div>

      <!-- gradient bleed into next section -->
      <div class="hero-gradient-bottom"></div>
    </section>

    <!-- ── Stats bar ──────────────────────────────────────────────────────── -->
    <div class="stats-bar glass-panel">
      <div class="stat"><strong>15+</strong><span>Years Coaching</span></div>
      <div class="stat-divider"></div>
      <div class="stat">
        <strong>All Ages</strong><span>Mites to Adults</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <strong>Players &amp; Goalies</strong
        ><span>Position-Specific Training</span>
      </div>
      <div class="stat-divider"></div>
      <div class="stat">
        <strong>1-on-1</strong><span>Private &amp; Group Sessions</span>
      </div>
    </div>

    <!-- ── Services ───────────────────────────────────────────────────────── -->
    <section class="section">
      <div class="container">
        <p class="section-label">What We Offer</p>
        <h2 class="section-heading">Two Ways to Train</h2>
        <div class="grid-2">
          <div class="service-card glass-panel">
            <h3>Private Lessons</h3>
            <p>
              One-on-one instruction tailored specifically to your player's
              needs. We identify weaknesses, build strengths, and accelerate
              development at every skill level.
            </p>
            <ul class="service-list">
              <li>Personalized skill assessment</li>
              <li>Skating, stickhandling &amp; shooting</li>
              <li>Goalie-specific training available</li>
              <li>Flexible scheduling</li>
            </ul>
            <RouterLink
              to="/lessons"
              class="btn btn-primary"
              style="margin-top: auto"
              >Sign Up for Lessons</RouterLink
            >
          </div>

          <div class="service-card glass-panel">
            <h3>Skill Development Clinics</h3>
            <p>
              Small-group clinics offered throughout the year at various dates
              and times. Structured for different age levels and abilities.
            </p>
            <ul class="service-list">
              <li>Age &amp; skill-grouped sessions</li>
              <li>Competitive, fun environment</li>
              <li>Multiple dates throughout the season</li>
              <li>Players &amp; goalies welcome</li>
            </ul>
            <RouterLink
              to="/clinics"
              class="btn btn-outline"
              style="margin-top: auto"
              >View Upcoming Clinics</RouterLink
            >
          </div>
        </div>
      </div>
    </section>

    <!-- ── Philosophy ─────────────────────────────────────────────────────── -->
    <section class="section philosophy-section">
      <div class="container">
        <div class="philosophy">
          <div class="philosophy-text">
            <p class="section-label">Our Philosophy</p>
            <h2
              class="section-heading"
              style="font-size: clamp(1.75rem, 4vw, 2.75rem)"
            >
              Developing the Complete Hockey Player
            </h2>
            <p class="philosophy-intro">
              H3 Hockey Development was founded on a simple mission: to develop
              complete hockey players — not just skilled ones. True development
              happens when head, heart, and hustle come together.
            </p>
            <div class="pillars">
              <div class="pillar glass-panel">
                <div class="pillar-letter">H</div>
                <div>
                  <strong>Head</strong>
                  <p>
                    Hockey IQ, game awareness, and smart decision-making under
                    pressure.
                  </p>
                </div>
              </div>
              <div class="pillar glass-panel">
                <div class="pillar-letter">H</div>
                <div>
                  <strong>Heart</strong>
                  <p>
                    Passion for the game, coachability, and the mental strength
                    to compete.
                  </p>
                </div>
              </div>
              <div class="pillar glass-panel">
                <div class="pillar-letter">H</div>
                <div>
                  <strong>Hustle</strong>
                  <p>
                    Work ethic, compete level, and the drive to improve every
                    session.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="cta-panel glass-panel">
            <h3>Ready to Get Started?</h3>
            <p>
              Contact us to discuss your player's goals and find the right
              program.
            </p>
            <a
              href="mailto:h3hockeydevelopment@gmail.com"
              class="btn btn-primary"
              style="margin-top: 1.25rem; width: 100%; justify-content: center"
            >
              Email Us
            </a>
            <RouterLink
              to="/lessons"
              class="btn btn-ghost"
              style="margin-top: 0.75rem; width: 100%; justify-content: center"
            >
              Sign Up Online
            </RouterLink>
            <p class="cta-email">h3hockeydevelopment@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
/* ── Hero ── */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 1.5rem 8rem;
  text-align: center;
}

.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  max-width: 780px;
}

.hero-logo {
  height: 100px;
  width: auto;
  background: #fff;
  border-radius: 10px;
  padding: 6px 14px;
  display: block;
  margin-bottom: 0.5rem;
}

.hero-badge {
  border: 1px solid rgba(156, 255, 0, 0.45);
  color: var(--lime);
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  padding: 0.3rem 1rem;
  border-radius: 100px;
}

.hero-headline {
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  line-height: 1;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.hero-sub {
  color: rgba(255, 255, 255, 0.65);
  font-size: 1.15rem;
  max-width: 540px;
  line-height: 1.65;
}

.hero-ctas {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 0.5rem;
}

.hero-scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
  color: rgba(255, 255, 255, 0.35);
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, rgba(156, 255, 0, 0.6), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}
@keyframes scrollPulse {
  0%,
  100% {
    opacity: 0.4;
    transform: scaleY(1);
  }
  50% {
    opacity: 1;
    transform: scaleY(1.15);
  }
}

/* gradient that bleeds hero → sections */
.hero-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 260px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(13, 18, 31, 0.85) 60%,
    rgba(13, 18, 31, 0.97) 100%
  );
  pointer-events: none;
}

/* ── Glass-panel (particles show through) ── */
.glass-panel {
  background: rgba(19, 26, 43, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(156, 255, 0, 0.12);
}

/* ── Stats bar ── */
.stats-bar {
  position: relative;
  z-index: 1;
  padding: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}
.stat {
  text-align: center;
}
.stat strong {
  display: block;
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--lime);
}
.stat span {
  font-size: 0.75rem;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
}

/* ── Sections ── */
.section {
  position: relative;
  z-index: 1;
  padding: 5rem 0;
  background: rgba(13, 18, 31, 0.88);
}
.philosophy-section {
  background: rgba(19, 26, 43, 0.9);
}

.section-heading {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 2.5rem;
}

/* ── Service cards ── */
.service-card {
  border-radius: 10px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition:
    border-color 0.2s,
    transform 0.2s;
}
.service-card:hover {
  border-color: rgba(156, 255, 0, 0.4);
  transform: translateY(-3px);
}
.service-icon {
  font-size: 2.5rem;
}
.service-card h3 {
  font-size: 1.75rem;
}
.service-card p {
  color: var(--gray-300);
  font-size: 0.95rem;
}
.service-list {
  color: var(--gray-300);
  font-size: 0.9rem;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}
.service-list li::marker {
  color: var(--lime);
}

/* ── Philosophy ── */
.philosophy {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 4rem;
  align-items: start;
}
@media (max-width: 900px) {
  .philosophy {
    grid-template-columns: 1fr;
  }
}

.philosophy-intro {
  color: var(--gray-300);
  font-size: 0.95rem;
  line-height: 1.7;
  margin: 0.75rem 0 1.5rem;
}

.pillars {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
.pillar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
}
.pillar-letter {
  width: 40px;
  height: 40px;
  background: var(--lime);
  color: var(--navy-dark);
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1.4rem;
  font-weight: 700;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.pillar strong {
  display: block;
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1.15rem;
  font-weight: 700;
}
.pillar p {
  color: var(--gray-300);
  font-size: 0.875rem;
  margin-top: 0.2rem;
}

.cta-panel {
  border-radius: 10px;
  padding: 2rem;
  position: sticky;
  top: 90px;
}
.cta-panel h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.cta-panel > p {
  color: var(--gray-300);
  font-size: 0.9rem;
}
.cta-email {
  text-align: center;
  color: var(--gray-500);
  font-size: 0.78rem;
  margin-top: 1rem;
}
</style>
