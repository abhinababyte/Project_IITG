<script setup>
import { ref } from 'vue'

const isSent = ref(false)

const sendMessage = () => {
  // Simulate sending a message
  isSent.value = true
  setTimeout(() => {
    isSent.value = false
  }, 3000)
}
</script>

<template>
  <div class="page-container glass-container">
    <div class="text-center mb-8">
      <div class="badge mb-4">Contact Us</div>
      <h2>Get in Touch</h2>
      <p>Have a suggestion or a few features? We would love to hear from you!</p>
    </div>

    <div class="contact-grid">
      <!-- Contact Info Section -->
      <div class="card glass-card info-card">
        <h3>Contact Information</h3>
        <p class="mt-4 mb-8 text-secondary">
          Whether you want to deploy EcoCampus at your university, have feature requests, or just want to say hi, reach out to us!
        </p>
        
        <div class="info-items">
          <div class="info-item">
            <span class="icon">📍</span>
            <div class="text">
              <strong>Location</strong>
              <p>IIT Guwahati, Assam, India</p>
            </div>
          </div>
          
          <div class="info-item">
            <span class="icon">✉️</span>
            <div class="text">
              <strong>Email</strong>
              <p>team@ecocampus.in</p>
            </div>
          </div>
          
          <div class="info-item">
            <span class="icon">📞</span>
            <div class="text">
              <strong>Phone</strong>
              <p>+91 12345 67890</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form Section -->
      <div class="card glass-card form-card">
        <h3 class="mb-4">Send a Message</h3>
        
        <form @submit.prevent="sendMessage" class="contact-form">
          <div class="form-group">
            <label>Your Name</label>
            <input type="text" class="form-input" placeholder="John Doe" required>
          </div>
          
          <div class="form-group">
            <label>Your Email</label>
            <input type="email" class="form-input" placeholder="john@university.edu" required>
          </div>
          
          <div class="form-group">
            <label>Message</label>
            <textarea class="form-input" rows="4" placeholder="I have an idea for a new feature..." required></textarea>
          </div>
          
          <button type="submit" class="btn btn-primary w-100 mt-4" :disabled="isSent">
            {{ isSent ? 'Message Sent! ✅' : 'Send Message' }}
          </button>
        </form>
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

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 2rem;
}

.glass-card {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  box-shadow: var(--shadow-md);
}

.info-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 253, 244, 0.6) 100%);
}

.info-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-item .icon {
  font-size: 1.5rem;
  background: rgba(255,255,255,0.8);
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  box-shadow: var(--shadow-sm);
}

.info-item p { margin-bottom: 0; font-size: 0.95rem; }

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  background: white;
}

.text-secondary { color: var(--text-secondary); }
.w-100 { width: 100%; }
.mt-4 { margin-top: 1rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-8 { margin-bottom: 2rem; }

@media (max-width: 768px) {
  .contact-grid { grid-template-columns: 1fr; }
}
</style>
