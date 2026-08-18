<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  userData: Object
})
const emit = defineEmits(['back', 'update-coins'])

const showConfetti = ref(false)

onMounted(async () => {
  setTimeout(() => {
    showConfetti.value = true
  }, 300)

  // Submit pledge to backend
  if (props.userData && props.userData.token) {
    try {
      const actionText = props.userData.defaultCommute !== 'walk' ? 'walking more often' : 'making eco-friendly choices';
      const res = await fetch('http://localhost:3000/api/pledges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${props.userData.token}`
        },
        body: JSON.stringify({
          category: 'General',
          action: actionText
        })
      });
      if (res.ok) {
        const data = await res.json();
        // Update local coins
        emit('update-coins', data.newCoinTotal);
        setTimeout(() => alert(`🎉 You earned ${data.coinsEarned} Eco-Coins for taking the Campus Pledge!`), 1000);
      }
    } catch (err) {
      console.error("Failed to save pledge:", err);
    }
  }
})
</script>

<template>
  <div class="pledge-container">
    <button class="btn btn-outline back-btn" @click="$emit('back')">← Back to Dashboard</button>
    
    <div class="certificate-wrapper" :class="{ 'celebrate': showConfetti }">
      <div class="certificate glass-card text-center">
        <div class="ribbon">🥇</div>
        <h1 class="cert-title">Certificate of Commitment</h1>
        <p class="cert-subtitle">EcoCampus Initiative</p>
        
        <div class="cert-body mt-8">
          <p>This digital pledge certifies that</p>
          <h2 class="student-name">{{ userData.name || 'Eco-Warrior' }}</h2>
          <p class="pledge-text">
            from the <strong>{{ userData.hostel || 'Campus' }}</strong> has officially committed to reducing their carbon footprint on campus. 
            By actively tracking daily habits and opting for sustainable alternatives like 
            <strong v-if="userData.defaultCommute !== 'walk'">walking</strong>
            <strong v-else>eco-friendly choices</strong>, 
            they are leading the movement towards a Net-Zero future.
          </p>
        </div>
        
        <div class="cert-footer flex justify-between mt-8">
          <div class="signature">
            <div class="sign-line">Codex Gigas</div>
            <small>EcoCampus Founders</small>
          </div>
          <div class="seal">
            <div class="seal-inner">IITG<br>2026</div>
          </div>
          <div class="signature">
            <div class="sign-line">{{ new Date().toLocaleDateString() }}</div>
            <small>Date of Pledge</small>
          </div>
        </div>
        
        <div class="share-actions mt-8">
          <button class="btn btn-primary w-100 mb-4" @click="$emit('back')">Accept Pledge & Return</button>
          <p class="text-sm text-secondary">A copy of this certificate will be emailed to you upon official launch.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pledge-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 2rem 0;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.back-btn {
  align-self: flex-start;
  margin-bottom: 2rem;
}

.certificate-wrapper {
  width: 100%;
  max-width: 800px;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.certificate-wrapper.celebrate {
  transform: scale(1.02);
}

.glass-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 253, 244, 0.9) 100%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 4px solid rgba(16, 185, 129, 0.3);
  border-radius: 20px;
  padding: 4rem 3rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

/* Confetti Decoration */
.glass-card::before {
  content: "✨";
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 2rem;
  opacity: 0.5;
}
.glass-card::after {
  content: "🌿";
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 2rem;
  opacity: 0.5;
}

.ribbon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}

.cert-title {
  font-size: 3rem;
  color: var(--primary-color);
  font-family: 'Georgia', serif;
  margin-bottom: 0.5rem;
}

.cert-subtitle {
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 0.9rem;
}

.cert-body {
  max-width: 600px;
  margin: 2rem auto;
}

.student-name {
  font-size: 2.5rem;
  margin: 1rem 0;
  color: var(--text-primary);
  border-bottom: 2px dashed rgba(16, 185, 129, 0.5);
  display: inline-block;
  padding-bottom: 0.5rem;
}

.pledge-text {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--text-secondary);
}

.cert-footer {
  margin-top: 4rem;
  align-items: flex-end;
}

.signature {
  text-align: center;
  width: 200px;
}

.sign-line {
  font-family: 'Brush Script MT', cursive;
  font-size: 1.8rem;
  color: var(--primary-color);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

.seal {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  border: 2px dashed white;
}

.seal-inner {
  border: 1px solid white;
  border-radius: 50%;
  width: 68px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-8 { margin-top: 2rem; }
.mb-4 { margin-bottom: 1rem; }
.w-100 { width: 100%; }

@media (max-width: 768px) {
  .cert-title { font-size: 2rem; }
  .student-name { font-size: 1.8rem; }
  .cert-footer { flex-direction: column; align-items: center; gap: 2rem; }
  .glass-card { padding: 2rem 1.5rem; }
}
</style>
