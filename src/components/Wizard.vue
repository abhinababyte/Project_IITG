<script setup>
import { ref } from 'vue'

const props = defineProps({
  userData: Object
})
const emit = defineEmits(['finish'])

const step = ref(1)
const totalSteps = 2 // Reduced to 2 steps for frictionless audit!

const nextStep = () => {
  if (step.value < totalSteps) step.value++
  else emit('finish')
}

const prevStep = () => {
  if (step.value > 1) step.value--
}

// Convert modes to readable text
const formatMode = (mode) => {
  const modes = { walk: 'Walk', bike: 'Bicycle', bus: 'Campus Shuttle', car: 'Personal Car' }
  return modes[mode] || mode
}

const formatDiet = (diet) => {
  const diets = { vegan: 'Vegan', vegetarian: 'Vegetarian', meat: 'Meat-Heavy' }
  return diets[diet] || diet
}
</script>

<template>
  <div class="wizard-container">
    <div class="text-center mb-8">
      <div class="badge pulse mb-4">Daily Micro-Audit</div>
      <h2>Welcome Back!</h2>
      <p>Log your daily habits in under 30 seconds.</p>
    </div>

    <div class="progress-bar mb-8">
      <div class="progress" :style="{ width: `${(step / totalSteps) * 100}%` }"></div>
    </div>
    
    <div class="card wizard-card">
      <transition name="slide-fade" mode="out-in">
        
        <!-- STEP 1: Commute & Diet Deviations -->
        <div v-if="step === 1" class="step-content" key="step1">
          <h3 class="mb-4">Did you stick to your baseline today?</h3>
          
          <div class="deviation-box card mb-4">
            <div class="flex justify-between items-center mb-2">
              <strong>Commute:</strong>
              <span class="default-badge">{{ formatMode(userData.defaultCommute) }}</span>
            </div>
            <p class="text-secondary text-sm">Did you use your default commute method today?</p>
            <div class="toggle-row">
              <button class="toggle-btn" :class="{ active: userData.commuteMode === userData.defaultCommute }" @click="userData.commuteMode = userData.defaultCommute">✅ Yes, same as usual</button>
              <button class="toggle-btn" :class="{ active: userData.commuteMode !== userData.defaultCommute }" @click="userData.commuteMode = (userData.defaultCommute === 'walk' ? 'bus' : 'walk')">❌ No, I changed it</button>
            </div>
            
            <transition name="slide-fade">
              <div v-if="userData.commuteMode !== userData.defaultCommute" class="mt-4 p-4 deviation-subform">
                <label class="d-block mb-2 text-sm font-semibold">What did you use instead?</label>
                <select v-model="userData.commuteMode" class="form-input">
                  <option value="walk">Walk</option>
                  <option value="bike">Bicycle</option>
                  <option value="bus">Campus Shuttle</option>
                  <option value="car">Personal Car</option>
                </select>
                <div class="mt-2" v-if="['bus', 'car'].includes(userData.commuteMode)">
                  <label class="d-block text-sm">Distance (km)</label>
                  <input type="number" v-model.number="userData.commuteDistance" class="form-input mt-1" />
                </div>
              </div>
            </transition>
          </div>

          <div class="deviation-box card">
            <div class="flex justify-between items-center mb-2">
              <strong>Dining Diet:</strong>
              <span class="default-badge">{{ formatDiet(userData.defaultDiet) }}</span>
            </div>
            <p class="text-secondary text-sm">Did you eat your default diet today?</p>
            <div class="toggle-row">
              <button class="toggle-btn" :class="{ active: userData.dietType === userData.defaultDiet }" @click="userData.dietType = userData.defaultDiet">✅ Yes</button>
              <button class="toggle-btn" :class="{ active: userData.dietType !== userData.defaultDiet }" @click="userData.dietType = (userData.defaultDiet === 'vegan' ? 'meat' : 'vegan')">❌ No, I changed it</button>
            </div>
            
            <transition name="slide-fade">
              <div v-if="userData.dietType !== userData.defaultDiet" class="mt-4 p-4 deviation-subform">
                <label class="d-block mb-2 text-sm font-semibold">What did you eat primarily?</label>
                <select v-model="userData.dietType" class="form-input">
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="meat">Meat-Heavy</option>
                </select>
              </div>
            </transition>
          </div>
        </div>

        <!-- STEP 2: Energy specific to today -->
        <div v-else-if="step === 2" class="step-content" key="step2">
          <h3 class="mb-4">Today's Energy Usage</h3>
          
          <div class="input-group mb-8 mt-8">
            <label>Hours of Air Conditioning / Heating used today (Dorm/Lab)</label>
            <div class="slider-container">
              <input type="range" v-model.number="userData.acHours" min="0" max="24" class="slider" />
              <span class="slider-value">{{ userData.acHours }} hrs</span>
            </div>
          </div>
          
          <div class="input-group mb-8">
            <label>Hours of active Laptop / Computer usage</label>
            <div class="slider-container">
              <input type="range" v-model.number="userData.laptopHours" min="0" max="24" class="slider" />
              <span class="slider-value">{{ userData.laptopHours }} hrs</span>
            </div>
          </div>
          
          <div class="toggle-group mt-4">
            <div>
              <label class="d-block font-semibold">Recycling</label>
              <span class="text-sm text-secondary">Did you separate your waste today?</span>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="userData.recycling">
              <span class="slider-toggle round"></span>
            </label>
          </div>
        </div>
        
      </transition>
      
      <div class="actions flex" :class="step > 1 ? 'justify-between' : 'justify-end'">
        <button v-if="step > 1" class="btn btn-outline mt-4" @click="prevStep">
          ← Back
        </button>
        <button class="btn btn-primary mt-4" :class="{ 'w-100': step === 1 }" @click="nextStep">
          {{ step === totalSteps ? 'Calculate Today\'s Impact' : 'Continue' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wizard-container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}

.badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pulse {
  animation: pulse-badge 2s infinite;
}
@keyframes pulse-badge {
  0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}

.progress-bar {
  height: 8px;
  background: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: var(--primary-color);
  transition: width 0.3s ease;
}

.wizard-card {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.step-content {
  flex: 1;
}

/* Micro Audit Styles */
.deviation-box {
  background: var(--surface-color);
  padding: 1.5rem;
  box-shadow: none;
  border-color: var(--border-color);
}

.default-badge {
  background: rgba(16, 185, 129, 0.1);
  color: var(--primary-color);
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.toggle-row {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.toggle-btn {
  flex: 1;
  padding: 0.75rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  color: var(--text-primary);
}

.toggle-btn.active {
  background: rgba(16, 185, 129, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.deviation-subform {
  background: var(--bg-color);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--warning-color);
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-family: inherit;
  font-size: 1rem;
}

.text-sm { font-size: 0.9rem; }
.font-semibold { font-weight: 600; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.p-4 { padding: 1rem; }

/* Existing slider/toggle styles */
.slider-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.slider {
  flex: 1;
  accent-color: var(--primary-color);
}
.slider-value {
  font-weight: 600;
  width: 60px;
  text-align: right;
}

.actions {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
}

/* Toggle Switch */
.toggle-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-color);
  border-radius: var(--radius-md);
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 28px;
}
.switch input { opacity: 0; width: 0; height: 0; }
.slider-toggle {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #cbd5e1;
  transition: .4s;
}
.slider-toggle:before {
  position: absolute;
  content: "";
  height: 20px; width: 20px;
  left: 4px; bottom: 4px;
  background-color: white;
  transition: .4s;
}
input:checked + .slider-toggle { background-color: var(--primary-color); }
input:checked + .slider-toggle:before { transform: translateX(22px); }
.slider-toggle.round { border-radius: 34px; }
.slider-toggle.round:before { border-radius: 50%; }

.w-100 { width: 100%; }
</style>
