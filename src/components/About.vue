<template>
  <div class="page-container glass-container">
    <div class="text-center mb-8">
      <div class="badge mb-4">The Team</div>
      <h2>About Us</h2>
      <p>Driving sustainable change at IIT Guwahati and beyond.</p>
    </div>

    <div class="content-grid">
      <div class="card glass-card">
        <h3><span class="icon">👋</span> Who We Are</h3>
        <p class="mt-4">
          We are Codex Gigas, a team of passionate developers, designers, and sustainability advocates.
        </p>
        <div class="team-members mt-4">
          <div class="member">
            <div class="avatar">👨‍💻</div>
            <div class="details">
              <strong>Abhinaba Mandal & Srija Ray</strong>
              <small>Lead Developers</small>
            </div>
          </div>
          <div class="member">
            <div class="avatar">👩‍💻</div>
            <div class="details">
              <strong>Fouzia Shakil & Arpita Banerjee</strong>
              <small>Product Strategy & UI/UX</small>
            </div>
          </div>
        </div>
      </div>

      <div class="card glass-card">
        <h3><span class="icon">🌍</span> Why We Built EcoCampus</h3>
        <p class="mt-4">
          Universities are micro-cities. To achieve Net-Zero, we cannot just change the infrastructure; we must change the behavior of the thousands of people living within it.
        </p>
        <p class="mt-4">
          Standard carbon calculators fail on college campuses because they rely on utility bills and gas receipts—data students in dorms simply don't have. 
        </p>
        <p class="mt-4 font-semibold text-primary">
          EcoCampus bridges this "Visibility Gap" by translating daily campus habits into actionable, relatable insights.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 900px;
  width: 100%;
  margin: 0 auto;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.2);
  color: var(--accent-color);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
}

.icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.team-members {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.member {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.avatar {
  font-size: 2rem;
  background: rgba(16, 185, 129, 0.1);
  width: 50px; height: 50px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
}

.details {
  display: flex;
  flex-direction: column;
}

.details strong {
  font-size: 1.1rem;
  color: var(--text-primary);
}

.details small {
  color: var(--text-secondary);
  font-weight: 500;
}

.mt-4 { margin-top: 1rem; }
.font-semibold { font-weight: 600; }
.text-primary { color: var(--accent-color); }

@media (max-width: 768px) {
  .content-grid { grid-template-columns: 1fr; }
}
</style>
