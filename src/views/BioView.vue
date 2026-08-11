<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="section-label">The Coaches</p>
        <h1>Meet the Team</h1>
        <p>
          Player development built on experience, character, and a passion for
          the game.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- ── James Muscatello ── -->
        <div class="coach-block">
          <div class="coach-header card">
            <div class="coach-identity">
              <div class="coach-avatar">JM</div>
              <div>
                <h2>James Muscatello</h2>
                <p class="coach-title">
                  Head Player Development Coach &amp; Founder
                </p>
                <p class="coach-location">📍 Baldwinsville, NY</p>
              </div>
            </div>
            <div class="coach-quick-stats">
              <div class="qstat">
                <strong>15+</strong>
                <span>Years in Development</span>
              </div>
              <div class="qstat">
                <strong>6,000+</strong>
                <span>Coaching Hours</span>
              </div>
              <div class="qstat">
                <strong>Youth → NCAA</strong>
                <span>Athletes Coached</span>
              </div>
            </div>
          </div>

          <!-- Philosophy -->
          <div class="card philosophy-quote">
            <div class="quote-icon">"</div>
            <blockquote>
              The mission is simple — develop the complete hockey player. That
              means building
              <span class="text-lime">Head</span>,
              <span class="text-lime">Heart</span>, and
              <span class="text-lime">Hustle</span> in every athlete we work
              with. Discipline, resilience, and teamwork aren't just values —
              they're the foundation of everything we do at H3.
            </blockquote>
            <cite>— James Muscatello</cite>
          </div>
        </div>

        <!-- ── Ryan Muscatello ── -->
        <div class="coach-block" style="margin-top: 3.5rem">
          <div class="coach-header card">
            <div class="coach-identity">
              <div class="coach-avatar coach-avatar--secondary">RM</div>
              <div>
                <h2>Ryan Muscatello</h2>
                <p class="coach-title">Instructor</p>
              </div>
            </div>
          </div>

          <div class="card" style="margin-top: 1.25rem">
            <h3 class="detail-heading">
              <span class="detail-icon">⛸️</span> Background
            </h3>
            <ul class="timeline">
              <li>
                <div class="tl-dot"></div>
                <div>
                  <strong>Siena College — ACHA Hockey</strong>
                  <p>
                    Four-year member of the Siena College ACHA hockey program,
                    contributing as a key piece of the defensive group.
                  </p>
                </div>
              </li>
              <li>
                <div class="tl-dot"></div>
                <div>
                  <strong>Winchendon School — Postgraduate</strong>
                  <p>
                    Completed a postgraduate year at The Winchendon School to
                    further develop his game at the prep level.
                  </p>
                </div>
              </li>
              <li>
                <div class="tl-dot"></div>
                <div>
                  <strong>Baldwinsville High School</strong>
                  <p>Four-year varsity player at Baldwinsville High School.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- ── CTA ── -->
        <div class="bio-cta card">
          <h3>Ready to Train with Us?</h3>
          <p>
            Whether you're looking for private lessons or a group clinic, we're
            here to help your player reach the next level.
          </p>
          <div class="bio-cta-btns">
            <RouterLink to="/lessons" class="btn btn-primary"
              >Book Private Lessons</RouterLink
            >
            <RouterLink to="/clinics" class="btn btn-outline"
              >View Clinics</RouterLink
            >
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
.coach-block {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.coach-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.coach-identity {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.coach-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--lime);
  color: #000;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.coach-avatar--secondary {
  background: rgba(156, 255, 0, 0.15);
  color: var(--lime);
  border: 2px solid rgba(156, 255, 0, 0.3);
}

.coach-identity h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: 0.2rem;
}
.coach-title {
  color: var(--lime);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.coach-location {
  color: var(--gray-500);
  font-size: 0.82rem;
  margin-top: 0.3rem;
}

.coach-quick-stats {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.qstat {
  text-align: center;
  min-width: 80px;
}
.qstat strong {
  display: block;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--lime);
  white-space: nowrap;
}
.qstat span {
  font-size: 0.7rem;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.detail-heading {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(156, 255, 0, 0.15);
}
.detail-icon {
  font-size: 1.1rem;
}

.timeline {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.timeline li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}
.tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--lime);
  flex-shrink: 0;
  margin-top: 6px;
}
.timeline strong {
  display: block;
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}
.timeline p {
  color: var(--gray-300);
  font-size: 0.875rem;
  line-height: 1.6;
}

.philosophy-quote {
  position: relative;
  padding: 2rem 2rem 2rem 3.5rem;
  border-left: 3px solid var(--lime);
}
.quote-icon {
  position: absolute;
  top: 0.5rem;
  left: 1rem;
  font-family: Georgia, serif;
  font-size: 4rem;
  line-height: 1;
  color: var(--lime);
  opacity: 0.5;
}
blockquote {
  font-size: 1.05rem;
  line-height: 1.75;
  color: var(--gray-300);
  font-style: italic;
}
cite {
  display: block;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--gray-500);
  font-style: normal;
}

.bio-cta {
  margin-top: 3.5rem;
  text-align: center;
  padding: 2.5rem;
  border-color: rgba(156, 255, 0, 0.25);
}
.bio-cta h3 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}
.bio-cta > p {
  color: var(--gray-300);
  max-width: 480px;
  margin-inline: auto;
}
.bio-cta-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}
</style>
