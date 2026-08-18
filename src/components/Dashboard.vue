<script setup>
import { ref, computed, onMounted } from 'vue'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  userData: Object
})
const emit = defineEmits(['restart', 'take-pledge', 'update-coins'])

const showShareCard = ref(false)
const isSubmitting = ref(false)

// Calculate emissions (Simplified logic for prototype)
// All values in kg CO2e per day
const commuteEmissions = computed(() => {
  if (props.userData.commuteMode === 'walk' || props.userData.commuteMode === 'bike') return 0
  if (props.userData.commuteMode === 'bus') return props.userData.commuteDistance * 0.1 // 100g per km
  if (props.userData.commuteMode === 'car') return props.userData.commuteDistance * 0.2 // 200g per km
  return 0
})

const energyEmissions = computed(() => {
  const ac = props.userData.acHours * 0.8 // 800g per hr
  const laptop = props.userData.laptopHours * 0.05 // 50g per hr
  return ac + laptop
})

const dietEmissions = computed(() => {
  let diet = 0
  if (props.userData.dietType === 'vegan') diet = 2.5
  else if (props.userData.dietType === 'vegetarian') diet = 3.5
  else if (props.userData.dietType === 'meat') diet = 7.0
  
  if (props.userData.recycling) diet -= 0.5 // small reduction for recycling habit
  return diet
})

const totalEmissions = computed(() => {
  return (commuteEmissions.value + energyEmissions.value + dietEmissions.value).toFixed(2)
})

// Automatically submit this audit to the backend when the dashboard loads
onMounted(async () => {
  if (!props.userData.token) return; // Prevent if not logged in
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  try {
    const res = await fetch('http://localhost:3000/api/audits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${props.userData.token}`
      },
      body: JSON.stringify({
        commuteMode: props.userData.commuteMode,
        commuteDistance: props.userData.commuteDistance,
        acHours: props.userData.acHours,
        laptopHours: props.userData.laptopHours,
        dietType: props.userData.dietType,
        recycling: props.userData.recycling,
        co2Saved: parseFloat((15 - totalEmissions.value).toFixed(2)) // Assume 15 is campus average
      })
    });
    
    if (res.ok) {
      const data = await res.json();
      if (data.coinsEarned > 0) {
        // Show a little alert that they earned coins!
        setTimeout(() => alert(`🎉 You earned ${data.coinsEarned} Eco-Coins for your footprint today!`), 1000);
      }
      emit('update-coins', data.newCoinTotal);
    }
  } catch (err) {
    console.error("Failed to submit audit:", err);
  }
})

// Relatable Impact Math
const smartphoneCharges = computed(() => {
  return Math.round(totalEmissions.value * 121).toLocaleString()
})

const treesNeeded = computed(() => {
  const yearlyEmissions = totalEmissions.value * 365
  return Math.max(1, Math.round(yearlyEmissions / 22))
})

// Doughnut Chart Data (Today's Breakdown)
const chartData = computed(() => ({
  labels: ['Commute', 'Energy (AC/Tech)', 'Diet & Waste'],
  datasets: [
    {
      backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
      data: [
        commuteEmissions.value.toFixed(2),
        energyEmissions.value.toFixed(2), 
        dietEmissions.value.toFixed(2)
      ],
      borderWidth: 0,
      hoverOffset: 4
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom', labels: { color: '#1e293b', font: { family: 'Outfit', weight: '500' } } }
  },
  cutout: '75%'
}

// New Bar Chart Data (Weekly Trend vs Average)
const barChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'],
  datasets: [
    {
      label: 'Your Emissions (kg CO₂e)',
      backgroundColor: '#10b981', // Bright Eco Green
      borderRadius: 6,
      data: [12, 10, 8, 9, 7, 5, parseFloat(totalEmissions.value)]
    },
    {
      label: 'Campus Average',
      backgroundColor: 'rgba(15, 23, 42, 0.2)', // Darker Faded Glass style for contrast
      borderRadius: 6,
      data: [15, 14, 15, 13, 14, 16, 15]
    }
  ]
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { color: '#1e293b', font: { family: 'Outfit', weight: '600' } } }
  },
  scales: {
    y: { 
      ticks: { color: '#475569' }, 
      grid: { color: 'rgba(0,0,0,0.05)' } 
    },
    x: { 
      ticks: { color: '#475569' }, 
      grid: { display: false } 
    }
  }
}

// Generate Actionable Strategies based on highest categories
const strategies = computed(() => {
  const tips = []
  
  if (props.userData.commuteMode === 'car' && props.userData.commuteDistance < 5) {
    tips.push({ icon: '🚲', text: 'You live close to campus! Switching from a car to a bicycle could cut your commute emissions by 100%.'})
  } else if (props.userData.commuteMode === 'car') {
    tips.push({ icon: '🚌', text: 'Taking the campus shuttle instead of your car reduces traffic and significantly cuts personal emissions.'})
  }
  
  if (props.userData.acHours > 8) {
    tips.push({ icon: '❄️', text: 'You are using a lot of AC. Try setting the thermostat 2 degrees higher or using a fan to halve this emission footprint.'})
  }
  
  if (props.userData.dietType === 'meat') {
    tips.push({ icon: '🥗', text: 'Replacing just one meat-heavy meal a day with a plant-based option in the dining hall saves ~1.5kg CO2e daily.'})
  }
  
  if (!props.userData.recycling) {
    tips.push({ icon: '♻️', text: 'Start using the segregated bins on campus! Recycling paper and plastics reduces landfill methane emissions.'})
  }
  
  if (tips.length === 0) {
    tips.push({ icon: '🌟', text: 'Great job! You have very eco-friendly habits. Encourage your peers to take this footprint calculator!'})
  }
  
  return tips
})

const toggleShareCard = () => {
  showShareCard.value = !showShareCard.value
}
</script>

<template>
  <div class="dashboard-container">
    <div class="header-actions flex justify-between items-center mb-4">
      <button class="btn btn-outline" @click="$emit('restart')">← Recalculate</button>
      
      <!-- Gamification Streak Badge -->
      <div class="streak-badge">
        🔥 4 Day Streak!
      </div>
    </div>
    
    <div class="dashboard-grid">
      <!-- Left Column: Chart & Total -->
      <div class="card summary-card">
        <h3>Your Daily Footprint</h3>
        <div class="total-number">
          <span class="value">{{ totalEmissions }}</span>
          <span class="unit">kg CO₂e</span>
        </div>
        
        <div class="relatable-impact">
          <div class="impact-item">
            <span class="icon">📱</span>
            <div class="text">
              <strong>{{ smartphoneCharges }}</strong>
              <small>Phone Charges</small>
            </div>
          </div>
          <div class="impact-item">
            <span class="icon">🌳</span>
            <div class="text">
              <strong>{{ treesNeeded }} trees</strong>
              <small>Needed/Yr to offset</small>
            </div>
          </div>
        </div>
        
        <div class="chart-wrapper">
          <Doughnut :data="chartData" :options="chartOptions" />
        </div>
        
        <!-- Breakthrough Feature 2: Eco-Wrapped Virality Button -->
        <button class="btn btn-primary w-100 mt-8" @click="toggleShareCard">
          ✨ Generate My Eco-Wrapped
        </button>
      </div>
      
      <!-- Right Column: Actionable Insights -->
      <div class="insights-column">
        <div class="card insights-card mb-4">
          <h3><span class="icon">💡</span> Automated Reduction Strategies</h3>
          <p>Personalized tips to lower your footprint on campus:</p>
          
          <ul class="tips-list">
            <li v-for="(tip, index) in strategies" :key="index" class="tip-item">
              <span class="tip-icon">{{ tip.icon }}</span>
              <span class="tip-text">{{ tip.text }}</span>
            </li>
          </ul>
        </div>
        
        <div class="card pledge-card">
          <h3>Commit to Change</h3>
          <p>Join 1,240 other students who pledged to reduce their emissions this semester.</p>
          <button class="btn btn-outline pledge-btn w-100" @click="$emit('take-pledge')">Take the Campus Pledge</button>
        </div>
      </div>
    </div>
    
    <!-- NEW: Weekly Impact Trend Graph -->
    <div class="card trend-card mt-8">
      <h3>Your Weekly Impact Trend 📈</h3>
      <p style="color: #94a3b8; margin-bottom: 1.5rem;">
        Watch your green bars stay below the campus average! Every day you stay lower, you actively help the environment.
      </p>
      <div class="bar-chart-wrapper">
        <Bar :data="barChartData" :options="barChartOptions" />
      </div>
    </div>
    
    <!-- Shareable Story Card Modal Overlay -->
    <transition name="slide-fade">
      <div v-if="showShareCard" class="share-modal-overlay" @click.self="toggleShareCard">
        <div class="share-story-card">
          <button class="close-btn" @click="toggleShareCard">✕</button>
          <div class="story-content text-center">
            <h4 class="story-subtitle">My EcoCampus Impact</h4>
            <h1 class="story-title">Top 15%</h1>
            <p class="story-text">I generated only <strong>{{ totalEmissions }} kg CO₂e</strong> today!</p>
            
            <div class="story-stats flex justify-center gap-4 mt-8">
              <div class="stat">
                <span class="icon">🔥</span>
                <strong>4 Day</strong>
                <small>Streak</small>
              </div>
              <div class="stat">
                <span class="icon">🌳</span>
                <strong>{{ treesNeeded }}</strong>
                <small>Trees Saved</small>
              </div>
            </div>
            
            <div class="story-footer mt-8">
              <div class="logo-small">🌿 EcoCampus</div>
              <p>Scan to calculate yours!</p>
              <div class="fake-qr">📱</div>
            </div>
          </div>
          <button class="btn btn-primary w-100 mt-4">Download to Instagram Story</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dashboard-container {
  width: 100%;
  position: relative;
}

.streak-badge {
  background: rgba(255, 237, 213, 0.7);
  backdrop-filter: blur(8px);
  color: #ea580c;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 700;
  border: 1px solid rgba(253, 186, 116, 0.8);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.insights-col, .share-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 3D Hover Tilt Effects for Dashboard Cards */
.card {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
}
.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(16, 185, 129, 0.15);
}
.trend-card:hover, .pledge-card:hover {
  transform: translateY(-4px) scale(1.01);
}

.summary-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.total-number {
  margin: 1.5rem 0 1rem;
  color: var(--accent-color);
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.total-number .value {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1;
  text-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.total-number .unit {
  font-size: 1.5rem;
  font-weight: 600;
}

/* Relatable Impact UI */
.relatable-impact {
  display: flex;
  gap: 1rem;
  width: 100%;
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.4);
  padding: 1rem;
  border-radius: var(--radius-md);
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.6);
}

.impact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.impact-item:first-child {
  border-right: 1px solid rgba(0,0,0,0.1);
  padding-right: 1rem;
}

.impact-item .icon { font-size: 2rem; }
.impact-item .text { display: flex; flex-direction: column; text-align: left; }
.impact-item strong { font-size: 1.1rem; line-height: 1.2; color: var(--text-primary); }
.impact-item small { font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }

.chart-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  margin-top: 1rem;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  border-left: 4px solid var(--primary-color);
  transition: transform 0.2s, background 0.2s;
}
.tip-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.8);
}

.tip-icon { font-size: 1.5rem; }
.tip-text { font-weight: 500; color: var(--text-primary); }

.trend-card {
  width: 100%;
}
.bar-chart-wrapper {
  height: 320px;
  width: 100%;
}

.pledge-card {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(4, 120, 87, 0.9) 100%);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.pledge-card h3, .pledge-card p { color: white; }
.pledge-btn { border-color: white; color: white; }
.pledge-btn:hover { background: white; color: var(--primary-color); }

.w-100 { width: 100%; }
.mt-4 { margin-top: 1rem; }
.mt-8 { margin-top: 2rem; }

/* Shareable Story Modal Overlay */
.share-modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.share-story-card {
  width: 320px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 24px;
  padding: 2rem;
  color: white;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  border: 1px solid rgba(255,255,255,0.3);
}

.close-btn {
  position: absolute;
  top: 15px; right: 15px;
  background: rgba(0,0,0,0.2);
  border: none;
  color: white;
  width: 30px; height: 30px;
  border-radius: 50%;
  cursor: pointer;
}

.story-subtitle { font-size: 1rem; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.story-title { font-size: 3.5rem; line-height: 1; color: white; margin-bottom: 1rem; text-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.story-text { font-size: 1.2rem; opacity: 0.9; }

.stat {
  display: flex; flex-direction: column; align-items: center;
  background: rgba(255,255,255,0.15);
  padding: 1rem;
  border-radius: 16px;
  width: 100px;
}
.stat .icon { font-size: 2rem; margin-bottom: 0.5rem; }
.stat strong { font-size: 1.2rem; }
.stat small { font-size: 0.75rem; text-transform: uppercase; opacity: 0.8; }

.story-footer {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.2);
}
.logo-small { font-weight: 700; font-size: 1.2rem; margin-bottom: 0.5rem; }
.fake-qr { font-size: 3rem; margin-top: 0.5rem; opacity: 0.8; }

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
</style>
