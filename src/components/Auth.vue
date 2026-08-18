<script setup>
import { ref } from 'vue'

const emit = defineEmits(['authenticated'])

const authMode = ref('login') // 'login' or 'signup'
const isLoading = ref(false)
const errorMessage = ref('')

const email = ref('')
const password = ref('')
const name = ref('')
const hostel = ref('Kameng Hostel') // Default for signup

const hostels = [
  'Kameng Hostel', 'Barak Hostel', 'Umiam Hostel', 
  'Brahmaputra Hostel', 'Manas Hostel', 'Dihing Hostel'
]

const handleAuth = async () => {
  if (!email.value || !password.value) return 
  
  isLoading.value = true
  errorMessage.value = ''
  
  const endpoint = authMode.value === 'signup' 
    ? 'http://localhost:3000/api/auth/signup' 
    : 'http://localhost:3000/api/auth/login'
    
  const payload = authMode.value === 'signup'
    ? { name: name.value, email: email.value, password: password.value, hostel: hostel.value }
    : { email: email.value, password: password.value }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      errorMessage.value = data.error || 'Authentication failed'
      isLoading.value = false
      return
    }

    if (authMode.value === 'signup') {
      window.alert('Account successfully created! Please log in with your new credentials.')
      authMode.value = 'login'
      password.value = ''
      isLoading.value = false
    } else {
      // Pass token and user data up to App.vue
      emit('authenticated', { token: data.token, user: data.user })
    }
  } catch (err) {
    errorMessage.value = 'Could not connect to the server. Is it running?'
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card card glass-card">
      <div class="text-center mb-4">
        <div class="shield-icon mb-2">🎓</div>
        <h2>{{ authMode === 'login' ? 'Welcome Back' : 'Create Account' }}</h2>
        <p class="text-secondary text-sm">Log in with your university or college mail id.</p>
      </div>

      <!-- Toggle Tabs -->
      <div class="auth-tabs mb-4">
        <button 
          class="tab-btn" 
          :class="{ active: authMode === 'login' }" 
          @click="authMode = 'login'"
        >
          Log In
        </button>
        <button 
          class="tab-btn" 
          :class="{ active: authMode === 'signup' }" 
          @click="authMode = 'signup'"
        >
          Sign Up
        </button>
      </div>
      
      <form v-if="!isLoading" @submit.prevent="handleAuth" class="auth-form">
        <!-- Error Message -->
        <div v-if="errorMessage" class="error-msg text-center mb-2" style="color: #ef4444; font-weight: 600;">
          {{ errorMessage }}
        </div>

        <!-- Name and Hostel fields only for Sign Up -->
        <transition name="slide-fade">
          <div v-if="authMode === 'signup'" class="form-group-wrapper">
            <div class="form-group mb-3">
              <label>Full Name</label>
              <input type="text" v-model="name" class="form-input" placeholder="John Doe" required>
            </div>
            <div class="form-group">
              <label>Hostel</label>
              <select v-model="hostel" class="form-input" required>
                <option v-for="h in hostels" :key="h" :value="h">{{ h }}</option>
              </select>
            </div>
          </div>
        </transition>

        <div class="form-group">
          <label>University / College Email ID</label>
          <input type="email" v-model="email" class="form-input" placeholder="student@university.edu" required>
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="password" class="form-input" placeholder="••••••••" required>
        </div>
        
        <button type="submit" class="btn btn-primary w-100 mt-4 auth-btn">
          {{ authMode === 'login' ? 'Log In to EcoCampus' : 'Sign Up for EcoCampus' }}
        </button>
        
        <p class="small-text text-secondary text-center mt-4">
          By continuing, you agree to the EcoCampus Terms of Service and Privacy Policy.
        </p>
      </form>
      
      <!-- Loading State -->
      <div v-else class="loading-state">
        <div class="spinner"></div>
        <p class="mt-4 font-semibold text-primary">
          {{ authMode === 'login' ? 'Authenticating...' : 'Creating Account...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 60vh;
  animation: fade-in 0.5s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-card {
  max-width: 450px;
  width: 100%;
  padding: 2.5rem 2rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.shield-icon {
  font-size: 3rem;
}

.auth-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-md);
  padding: 0.25rem;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-secondary);
  border-radius: calc(var(--radius-md) - 4px);
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: white;
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
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

.auth-btn {
  font-size: 1.1rem;
  padding: 1rem;
}

.w-100 {
  width: 100%;
}

.small-text {
  font-size: 0.85rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(16, 185, 129, 0.2);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.mt-4 { margin-top: 1rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.text-sm { font-size: 0.9rem; }
.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
.text-primary { color: var(--primary-color); }
</style>
