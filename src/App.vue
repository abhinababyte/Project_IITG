<script setup>
import { ref, reactive, computed } from 'vue'
import Landing from './components/Landing.vue'
import Auth from './components/Auth.vue'
import BaselineProfile from './components/BaselineProfile.vue'
import Wizard from './components/Wizard.vue'
import Dashboard from './components/Dashboard.vue'
import Leaderboard from './components/Leaderboard.vue'
import About from './components/About.vue'
import Contact from './components/Contact.vue'
import Footer from './components/Footer.vue'
import Pledge from './components/Pledge.vue'

// Top-level Navigation State
const currentTab = ref('home') // 'home', 'about', 'contact'
const showNotifications = ref(false)
const showProfileMenu = ref(false)
const feedItems = ref([])

// Fetch live campus activity feed
const fetchFeed = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/feed')
    if (res.ok) {
      feedItems.value = await res.json()
    }
  } catch (err) {
    console.error("Failed to fetch feed:", err)
  }
}

// Fetch once immediately, then poll every 30 seconds
import { onMounted } from 'vue'
onMounted(() => {
  fetchFeed()
  setInterval(fetchFeed, 30000)
})

// App flow states (only active when currentTab === 'home')
const currentView = ref('landing') // 'landing', 'auth', 'baseline', 'wizard', 'dashboard', 'leaderboard', 'pledge'

// Global state holding the user's answers and baseline
const userData = reactive({
  id: null,
  token: '',
  name: '',
  hostel: '',
  eco_coins: 0,
  defaultCommute: '',
  defaultDiet: '',
  
  commuteMode: '', 
  commuteDistance: 0,
  acHours: 0,
  laptopHours: 0,
  dietType: '', 
  recycling: false
})

const logout = () => {
  userData.name = ''
  userData.hostel = ''
  showProfileMenu.value = false
  currentView.value = 'landing'
  currentTab.value = 'home'
}

const startAuth = () => { currentView.value = 'auth' }
const startBaseline = () => { currentView.value = 'baseline' }
const startWizard = () => { currentView.value = 'wizard' }
const showDashboard = () => { currentView.value = 'dashboard' }

const restart = () => {
  userData.commuteMode = userData.defaultCommute
  userData.commuteDistance = 0
  userData.acHours = 0
  userData.laptopHours = 0
  userData.dietType = userData.defaultDiet
  userData.recycling = false
  currentView.value = 'wizard'
}

const hasCompletedWizard = computed(() => {
  return currentView.value === 'dashboard' || currentView.value === 'leaderboard' || currentView.value === 'pledge'
})

const isLoggedIn = computed(() => {
  // If we have a token or an ID, the user is authenticated.
  return !!userData.token || !!userData.id || userData.name !== ''
})

// Helper to switch to home tab and reset to landing if logo clicked
const goHome = () => {
  currentTab.value = 'home'
  if (!hasCompletedWizard.value) {
    currentView.value = 'landing'
  }
}

// Navigation helper for footer links
const navigateTo = (tab) => {
  currentTab.value = tab
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <!-- Global Header -->
  <header class="main-header">
    <div class="header-left">
      <div class="logo" @click="goHome" style="cursor: pointer">
        <span class="leaf">🌿</span>
        <span class="brand">EcoCampus</span>
      </div>
      
      <!-- Global Tabs Next to Logo -->
      <nav class="global-tabs">
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'home' }"
          @click="currentTab = 'home'"
        >
          Home
        </button>
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'about' }"
          @click="currentTab = 'about'"
        >
          About Us
        </button>
        <button 
          class="tab-item" 
          :class="{ active: currentTab === 'contact' }"
          @click="currentTab = 'contact'"
        >
          Contact Us
        </button>
      </nav>
    </div>
    
    <div class="header-right flex items-center gap-4">
      <!-- Login / Sign In Button (Visible if not logged in) -->
      <button 
        v-if="!isLoggedIn && currentView !== 'auth'" 
        class="btn btn-primary login-btn"
        @click="currentTab = 'home'; currentView = 'auth'"
      >
        Log In / Sign Up
      </button>
      
      <!-- User Controls (Visible on all pages if logged in) -->
      <div v-if="isLoggedIn" class="user-controls flex items-center gap-3 relative">
        
        <!-- Eco-Coins -->
        <div class="eco-coins card" title="Redeem these for campus rewards!">
          🪙 <strong>{{ userData.eco_coins || 0 }}</strong>
        </div>
        
        <!-- Notifications Bell -->
        <div class="notifications-wrapper relative">
          <button class="icon-btn" @click="showNotifications = !showNotifications">
            🔔<span class="notif-dot"></span>
          </button>
          
          <transition name="slide-fade">
            <div v-if="showNotifications" class="notif-dropdown card glass-card">
              <h4 class="mb-2" style="font-size: 0.9rem; color: #94a3b8;">Campus Activity</h4>
              <div v-if="feedItems.length === 0" class="text-secondary text-sm">No new activity yet.</div>
              <div v-for="item in feedItems.slice(0,5)" :key="item.id" class="notif-item">
                <span class="notif-icon">{{ item.type === 'pledge' ? '🏅' : '🌱' }}</span>
                <p>{{ item.message }}</p>
              </div>
            </div>
          </transition>
        </div>

        <!-- Profile Button & Dropdown -->
        <div class="profile-wrapper relative">
          <button class="profile-btn" @click="showProfileMenu = !showProfileMenu">
            <span class="avatar-emoji">👨‍🎓</span>
            <span class="profile-name">{{ userData.name || 'Student' }}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          
          <transition name="slide-fade">
            <div v-if="showProfileMenu" class="profile-dropdown card glass-card">
              <div class="dropdown-header">
                <strong>{{ userData.name || 'Student' }}</strong>
                <small>{{ userData.hostel || 'No Hostel Set' }}</small>
              </div>
              <hr class="dropdown-divider">
              <button class="dropdown-item">⚙️ Profile Settings</button>
              <button class="dropdown-item">👤 My Account</button>
              <button class="dropdown-item">🔒 Privacy</button>
              <hr class="dropdown-divider">
              <button class="dropdown-item text-danger" @click="logout">🚪 Sign Out</button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>

  <!-- Main Content Area -->
  <main>
    <transition name="slide-fade" mode="out-in">
      <!-- ABOUT TAB -->
      <About v-if="currentTab === 'about'" />
      
      <!-- CONTACT TAB -->
      <Contact v-else-if="currentTab === 'contact'" />

      <!-- HOME TAB (Contains the main application flow) -->
      <div v-else-if="currentTab === 'home'" class="app-flow-container w-100 h-100 flex-column">
        
        <!-- App Sub-Navigation (Dashboard vs Leaderboard) -->
        <div v-if="hasCompletedWizard" class="flex justify-center mb-6 w-100">
          <nav class="app-nav card">
            <button 
              class="nav-item" 
              :class="{ active: currentView === 'dashboard' }"
              @click="currentView = 'dashboard'"
            >
              My Dashboard
            </button>
            <button 
              class="nav-item" 
              :class="{ active: currentView === 'leaderboard' }"
              @click="currentView = 'leaderboard'"
            >
              Hostel Leaderboards
            </button>
          </nav>
        </div>

        <transition name="slide-fade" mode="out-in">
          <Landing 
            v-if="currentView === 'landing'" 
            @start="startAuth" 
          />
          <Auth 
            v-else-if="currentView === 'auth'"
            @authenticated="(data) => { 
              if (data && data.user) {
                userData.id = data.user.id;
                userData.name = data.user.name; 
                userData.hostel = data.user.hostel;
                userData.eco_coins = data.user.eco_coins;
                userData.token = data.token;
              }
              startBaseline(); 
            }"
          />
          <BaselineProfile 
            v-else-if="currentView === 'baseline'"
            :userData="userData"
            @profile-complete="startWizard"
            @back="currentView = 'auth'"
          />
          <Wizard 
            v-else-if="currentView === 'wizard'" 
            :userData="userData" 
            @finish="showDashboard" 
          />
          <Dashboard 
            v-else-if="currentView === 'dashboard'"
            :userData="userData"
            @restart="restart"
            @update-coins="(coins) => userData.eco_coins = coins"
            @take-pledge="currentView = 'pledge'"
          />
          <Leaderboard 
            v-else-if="currentView === 'leaderboard'" 
            :userData="userData"
          />
          <Pledge 
            v-else-if="currentView === 'pledge'"
            :userData="userData"
            @update-coins="(coins) => userData.eco_coins = coins"
            @back="currentView = 'dashboard'"
          />
        </transition>
      </div>
    </transition>
  </main>
  
  <!-- Premium Dark Footer -->
  <Footer @navigate="navigateTo" />
  
  <!-- Live Campus Pulse Ticker (Fixed at very bottom) -->
  <div class="ticker-wrap" v-if="feedItems.length > 0">
    <div class="ticker-move">
      <!-- Original items -->
      <div class="ticker-item" v-for="item in feedItems" :key="item.id">
        {{ item.message }}
      </div>
      <!-- Duplicate for infinite seamless scrolling -->
      <div class="ticker-item" v-for="item in feedItems" :key="'dup-'+item.id">
        {{ item.message }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.eco-coins {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.8rem;
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(218, 165, 32, 0.1) 100%);
  border: 1px solid rgba(255, 215, 0, 0.4);
  color: #fbbf24;
  border-radius: 9999px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.2s;
}
.eco-coins:hover { transform: scale(1.05); }

.icon-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;
}
.icon-btn:hover { background: rgba(255, 255, 255, 0.4); }

.notif-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #ef4444;
  border-radius: 50%;
  border: 2px solid var(--bg-color);
}

.notif-dropdown {
  position: absolute;
  top: 50px;
  right: -20px;
  width: 320px;
  padding: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.notif-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  color: var(--text-primary);
  line-height: 1.4;
  transition: background 0.2s;
  cursor: pointer;
}
.notif-item:hover { background: rgba(255, 255, 255, 0.8); }
.notif-icon { font-size: 1.2rem; }

/* Profile Button & Dropdown Styles */
.profile-wrapper {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 0.4rem 0.8rem 0.4rem 0.4rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--text-primary);
  font-family: inherit;
}
.profile-btn:hover {
  background: rgba(255, 255, 255, 0.6);
}

.avatar-emoji {
  font-size: 1.2rem;
  background: rgba(255,255,255,0.8);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.dropdown-arrow {
  font-size: 0.6rem;
  opacity: 0.6;
}

.profile-dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  width: 220px;
  padding: 0.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
}
.dropdown-header strong { font-size: 1rem; color: var(--text-primary); }
.dropdown-header small { font-size: 0.8rem; color: var(--text-secondary); }

.dropdown-divider {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-family: inherit;
  font-size: 0.95rem;
  color: var(--text-secondary);
  text-align: left;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.8);
  color: var(--text-primary);
}

.text-danger {
  color: #ef4444 !important;
}
.text-danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.login-btn {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
}

.profile-avatar {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.leaf {
  font-size: 1.8rem;
  filter: drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2));
}

.brand {
  letter-spacing: -0.02em;
}

/* Global Tabs styling */
.global-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-item {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-weight: 600;
  font-size: 1.05rem;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-item:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.4);
}

.tab-item.active {
  color: var(--primary-color);
  background: rgba(255, 255, 255, 0.7);
  box-shadow: var(--shadow-sm);
}

/* Inner App Nav */
.app-nav {
  display: flex;
  padding: 0.25rem !important;
  border-radius: 9999px !important;
  box-shadow: var(--shadow-sm) !important;
}

.nav-item {
  background: transparent;
  border: none;
  padding: 0.6rem 1.25rem;
  font-family: inherit;
  font-weight: 600;
  color: var(--text-secondary);
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.3);
}

.nav-item.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-flow-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.w-100 { width: 100%; }
.h-100 { height: 100%; }
.flex-column { display: flex; flex-direction: column; }

/* Live Campus Pulse Ticker */
.ticker-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  height: 40px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  z-index: 100;
}

.ticker-move {
  display: flex;
  white-space: nowrap;
  animation: ticker 30s linear infinite;
}

.ticker-item {
  padding: 0 2rem;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
}

@keyframes ticker {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); } /* -50% because we duplicated content */
}

@media (max-width: 900px) {
  .main-header { flex-direction: column; align-items: flex-start; }
  .header-left { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>
