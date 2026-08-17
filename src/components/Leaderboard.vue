<script setup>
import { computed } from 'vue'

const leaderboards = [
  { rank: 1, name: 'Brahmaputra Hostel', score: 85, trend: 'up', streak: 12 },
  { rank: 2, name: 'Kameng Hostel', score: 78, trend: 'up', streak: 8 },
  { rank: 3, name: 'Barak Hostel', score: 72, trend: 'down', streak: 3 },
  { rank: 4, name: 'Umiam Hostel', score: 65, trend: 'up', streak: 5 },
  { rank: 5, name: 'Manas Hostel', score: 60, trend: 'down', streak: 1 }
]

const userHostel = 'Kameng Hostel'
</script>

<template>
  <div class="leaderboard-container">
    <div class="header text-center mb-8">
      <h2>Campus Leaderboards 🏆</h2>
      <p>See how your hostel ranks in the weekly sustainability challenge.</p>
    </div>

    <div class="card leaderboard-card">
      <div class="list-header">
        <span>Rank</span>
        <span class="flex-1">Hostel Name</span>
        <span>Eco-Score</span>
        <span>Streak</span>
      </div>
      
      <ul class="ranking-list">
        <li 
          v-for="item in leaderboards" 
          :key="item.rank" 
          class="ranking-item"
          :class="{ 'is-user': item.name === userHostel }"
        >
          <div class="rank-badge" :class="`rank-${item.rank}`">{{ item.rank }}</div>
          <div class="hostel-info flex-1">
            <strong>{{ item.name }}</strong>
            <span v-if="item.name === userHostel" class="you-badge">You</span>
          </div>
          <div class="score">
            {{ item.score }}
            <span class="trend" :class="item.trend">{{ item.trend === 'up' ? '▲' : '▼' }}</span>
          </div>
          <div class="streak">
            🔥 {{ item.streak }}
          </div>
        </li>
      </ul>
    </div>
    
    <div class="reward-box mt-4 card">
      <div class="flex items-center gap-4">
        <div class="reward-icon">🎁</div>
        <div>
          <h3>Weekly Reward</h3>
          <p class="mb-0">The top hostel wins a free pizza night at the food court this Friday!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.list-header {
  display: flex;
  padding: 0 1rem 1rem;
  border-bottom: 2px solid var(--border-color);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.list-header span, .ranking-item > div {
  width: 80px;
  text-align: center;
}

.list-header .flex-1, .ranking-item .flex-1 {
  flex: 1;
  text-align: left;
  padding-left: 1rem;
}

.ranking-list {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.ranking-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  transition: all 0.2s;
  background: var(--surface-color);
}

.ranking-item:hover {
  background: var(--bg-color);
  transform: translateX(4px);
}

.ranking-item.is-user {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-weight: 700;
  background: var(--bg-color);
  color: var(--text-primary);
  margin: 0 auto;
}

.rank-1 { background: #fbbf24; color: white; }
.rank-2 { background: #94a3b8; color: white; }
.rank-3 { background: #b45309; color: white; }

.hostel-info strong {
  display: block;
  font-size: 1.1rem;
}

.you-badge {
  font-size: 0.75rem;
  background: var(--primary-color);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
  display: inline-block;
}

.score {
  font-weight: 700;
  font-size: 1.1rem;
}

.trend {
  font-size: 0.8rem;
  margin-left: 4px;
}
.trend.up { color: var(--success-color); }
.trend.down { color: var(--danger-color); }

.streak {
  font-weight: 700;
  color: #f97316;
}

.reward-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fcd34d;
}

.reward-icon {
  font-size: 3rem;
}

.mt-4 { margin-top: 2rem; }
.mb-0 { margin-bottom: 0; }
</style>
