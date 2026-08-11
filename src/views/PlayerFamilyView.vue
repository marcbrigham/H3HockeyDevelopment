<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="section-label">Player &amp; Family Consulting</p>
        <h1>Don't Guess Your Next Move.</h1>
        <p>
          Experienced hockey guidance for players and families navigating the
          decisions that shape development and opportunity.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container consulting-content">
        <div class="consulting-intro card">
          <p>
            Hockey can get complicated fast. Team decisions, tryouts,
            development, coaching, confidence, and figuring out what comes next
            can be overwhelming.
          </p>
          <p>
            H3 offers player and family consulting, giving you an experienced
            hockey perspective when you need it most.
          </p>
        </div>

        <div class="card guidance-card">
          <h2>We help players and families:</h2>
          <ul class="guidance-list">
            <li>Make smarter team and program decisions</li>
            <li>Build a clear development plan</li>
            <li>Navigate tryouts and player placement</li>
            <li>Identify the right next step</li>
            <li>Work through coaching or team concerns</li>
            <li>Set realistic goals for long-term development</li>
          </ul>
        </div>

        <div class="consulting-principle">
          <p>
            No politics. No agenda. Just honest, experienced guidance focused on
            what's best for the player.
          </p>
          <strong>Know the path. Make the move. Develop with purpose.</strong>
        </div>

        <div class="consulting-cta card">
          <h2>Ready to Make the Next Move?</h2>
          <p>
            Book a Player &amp; Family Consultation with H3 Hockey Development.
          </p>
          <a
            class="btn btn-primary"
            href="mailto:h3hockeydevelopment@gmail.com?subject=Player%20%26%20Family%20Consultation"
          >
            Book a Consultation
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.consulting-content {
  display: grid;
  gap: 1.5rem;
  max-width: 850px;
}

.consulting-intro {
  display: grid;
  gap: 1rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--gray-300);
}

.guidance-card h2,
.consulting-cta h2 {
  font-size: clamp(1.35rem, 3vw, 1.8rem);
  margin-bottom: 1.25rem;
}

.guidance-list {
  display: grid;
  gap: 0.85rem;
  list-style: none;
}

.guidance-list li {
  position: relative;
  padding-left: 1.75rem;
  color: var(--gray-300);
}

.guidance-list li::before {
  position: absolute;
  left: 0;
  content: "✓";
  color: var(--lime);
  font-weight: 700;
}

.consulting-principle {
  padding: 1.5rem 1.75rem;
  border-left: 3px solid var(--lime);
  color: var(--gray-300);
  font-size: 1.05rem;
}

.consulting-principle strong {
  display: block;
  margin-top: 0.75rem;
  color: var(--lime);
  font-family: "Tomorrow", system-ui, sans-serif;
  font-size: 1.1rem;
}

.consulting-cta {
  text-align: center;
  padding: 2.5rem 1.75rem;
  border-color: rgba(156, 255, 0, 0.25);
}

.consulting-cta p {
  margin-bottom: 1.5rem;
  color: var(--gray-300);
}
</style>
