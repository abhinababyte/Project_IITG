<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  userData: Object
})

const emit = defineEmits(['profile-complete', 'back'])

// Step logic
const step = ref(1)
const totalSteps = 3

// Local state for the setup form
const profileData = reactive({
  hostel: props.userData.hostel || '',
  defaultCommute: props.userData.defaultCommute || '',
  defaultDiet: props.userData.defaultDiet || ''
})

const hostels = ['Brahmaputra Hostel', 'Kameng Hostel', 'Barak Hostel', 'Umiam Hostel', 'Manas Hostel']

const nextStep = () => {
  if (step.value < totalSteps) step.value++
  else completeProfile()
}

const prevStep = () => {
  if (step.value > 1) step.value--
  else emit('back') // Go back to Auth if on step 1
}

const canGoNext = () => {
  if (step.value === 1) return profileData.hostel !== ''
  if (step.value === 2) return profileData.defaultCommute !== ''
  if (step.value === 3) return profileData.defaultDiet !== ''
  return false
}

const completeProfile = () => {
  // Save defaults to global state
  props.userData.hostel = profileData.hostel
  props.userData.defaultCommute = profileData.defaultCommute
  props.userData.defaultDiet = profileData.defaultDiet
  
  // Set the current daily habits to the defaults to start
  props.userData.commuteMode = profileData.defaultCommute
  props.userData.dietType = profileData.defaultDiet
  
  emit('profile-complete')
}
</script>

<template>
  <div class="baseline-container">
    <div class="text-center mb-8">
      <div class="badge mb-4">One-Time Setup</div>
      <h2>Set Your Baseline Profile</h2>
      <p>We'll use this to make your daily tracking effortless.</p>
    </div>

    <!-- Progress Bar -->
    <div class="progress-bar mb-8">
      <div class="progress" :style="{ width: `${(step / totalSteps) * 100}%` }"></div>
    </div>

    <div class="card baseline-card">
      <transition name="slide-fade" mode="out-in">
        
        <!-- STEP 1: Hostel -->
        <div v-if="step === 1" class="step-content" key="step1">
          <div class="form-group">
            <label>Which Hostel do you live in?</label>
            <div class="select-wrapper">
              <select v-model="profileData.hostel" class="form-input">
                <option disabled value="">Select your hostel...</option>
                <option v-for="hostel in hostels" :key="hostel" :value="hostel">{{ hostel }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- STEP 2: Commute -->
        <div v-else-if="step === 2" class="step-content" key="step2">
          <div class="form-group">
            <label>What is your default way of getting to class?</label>
            <div class="options-grid">
              <button class="option-card" :class="{ active: profileData.defaultCommute === 'walk' }" @click="profileData.defaultCommute = 'walk'">🚶 Walk</button>
              <button class="option-card" :class="{ active: profileData.defaultCommute === 'bike' }" @click="profileData.defaultCommute = 'bike'">🚲 Bicycle</button>
              <button class="option-card" :class="{ active: profileData.defaultCommute === 'bus' }" @click="profileData.defaultCommute = 'bus'">🚌 Shuttle</button>
              <button class="option-card" :class="{ active: profileData.defaultCommute === 'car' }" @click="profileData.defaultCommute = 'car'">🚗 Car</button>
            </div>
          </div>
        </div>

        <!-- STEP 3: Diet -->
        <div v-else-if="step === 3" class="step-content" key="step3">
          <div class="form-group">
            <label>What is your default dining hall diet?</label>
            <div class="options-grid">
              <button class="option-card" :class="{ active: profileData.defaultDiet === 'vegan' }" @click="profileData.defaultDiet = 'vegan'">🥗 Vegan</button>
              <button class="option-card" :class="{ active: profileData.defaultDiet === 'vegetarian' }" @click="profileData.defaultDiet = 'vegetarian'">🧀 Vegetarian</button>
              <button class="option-card" :class="{ active: profileData.defaultDiet === 'meat' }" @click="profileData.defaultDiet = 'meat'">🍗 Meat-Heavy</button>
            </div>
          </div>
        </div>
      </transition>
      
      <!-- Actions Layout with Back and Next buttons -->
      <div class="actions flex justify-between mt-8">
        <button class="btn btn-outline w-100 mr-2" @click="prevStep">
          ← Back
        </button>
        <button class="btn btn-primary w-100 ml-2" :disabled="!canGoNext()" @click="nextStep">
          {{ step === totalSteps ? 'Save & Continue' : 'Next →' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.baseline-container {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
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

/* Progress bar styles to match the Wizard */
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

.baseline-card {
  min-height: 350px;
  display: flex;
  flex-direction: column;
}

.step-content {
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  background: var(--bg-color);
  transition: all 0.2s;
  cursor: pointer;
}
.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  background: white;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.option-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: var(--bg-color);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.option-card:hover {
  border-color: var(--primary-hover);
  background: white;
}

.option-card.active {
  border-color: var(--primary-color);
  background: rgba(16, 185, 129, 0.05);
  box-shadow: 0 0 0 1px var(--primary-color);
}

.actions {
  border-top: 1px solid var(--border-color);
  padding-top: 1.5rem;
}

.mt-8 { margin-top: 2rem; }
.mr-2 { margin-right: 0.5rem; }
.ml-2 { margin-left: 0.5rem; }
.w-100 { width: 100%; }
</style>
