<script setup>
defineEmits(['start'])
</script>

<template>
  <div class="landing-container text-center">
    <div class="hero-content">
      <div class="badge mb-4">University Edition</div>
      <h1>Track Your Impact.<br>Change the Campus.</h1>
      <p class="subtitle mb-8">
        Discover your personal carbon footprint based on your daily campus habits. 
        Get actionable insights and automated strategies to reduce your emissions.
      </p>
      
      <div class="action-area">
        <button class="btn btn-primary btn-large" @click="$emit('start')">
          Login via Campus SSO
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-right"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>
      
      <div class="features-grid">
        <div class="feature-card">
          <div class="icon">⏱️</div>
          <h3>Frictionless</h3>
          <p>30-second daily micro-audits</p>
        </div>
        <div class="feature-card">
          <div class="icon">🏆</div>
          <h3>Gamified</h3>
          <p>Compete in hostel leaderboards</p>
        </div>
        <div class="feature-card">
          <div class="icon">💡</div>
          <h3>Actionable</h3>
          <p>Automated reduction strategies</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 0;
}

.hero-content {
  max-width: 800px;
  width: 100%;
}

.badge {
  display: inline-block;
  background: rgba(16, 185, 129, 0.1);
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
  gap: 0.5rem;
}

.icon-right {
  transition: transform 0.2s;
}
.btn-primary:hover .icon-right {
  transform: translateX(4px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.feature-card {
  padding: 2rem;
  background: white;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.feature-card .icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.9rem;
  margin-bottom: 0;
}
</style>
