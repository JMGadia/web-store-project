<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
    <div class="absolute top-0 -right-4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-0 -left-4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-10">
        <h2 class="text-4xl font-black text-white tracking-tighter uppercase italic">
          System <span class="text-violet-500">Access</span>
        </h2>
        <p class="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Store Management System</p>
      </div>

      <div class="bg-slate-900/50 backdrop-blur-2xl py-10 px-8 md:px-10 shadow-2xl rounded-[3rem] border border-slate-800/50 relative overflow-hidden">
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-violet-500/5 blur-3xl"></div>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email</label>
            <div class="relative">
              <input v-model="email" type="email" placeholder="example@gmail.com" required
                class="block w-full px-5 py-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between items-center px-1">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
              <router-link to="/forgot-password" class="text-[9px] font-bold text-slate-500 hover:text-violet-400 transition-colors uppercase tracking-tighter">Lost Access?</router-link>
            </div>
            <div class="relative">
              <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required
                class="block w-full px-5 py-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-violet-400 transition-colors">
                <span class="text-[9px] font-black tracking-widest uppercase">{{ showPassword ? 'Hide' : 'Show' }}</span>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading"
            class="group relative w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl overflow-hidden shadow-xl shadow-violet-500/20 active:scale-[0.97] transition-all disabled:opacity-50">
            <span class="relative z-10">{{ loading ? 'Authenticating...' : 'Authorize Login' }}</span>
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        <transition name="fade">
          <div v-if="error" class="mt-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/50 text-center">
            <span class="text-[11px] font-black text-rose-400 uppercase tracking-wide">{{ error }}</span>
          </div>
        </transition>

        <div class="mt-8 pt-6 border-t border-slate-800/50 text-center">
          <router-link to="/signup" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group">
            No Authorization? <span class="text-violet-500 group-hover:text-violet-400 transition-colors underline underline-offset-4 ml-1">Create Profile</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Remove browser blue autofill */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #020617 inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// 1. DYNAMIC API URL
// Locally: uses http://localhost:3000
// On Render: uses the VITE_API_URL you set in the dashboard
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // 2. USE THE API_BASE VARIABLE
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error)

    localStorage.setItem('userSession', JSON.stringify({
      username: data.user.username,
      role: data.user.role,
      token: Date.now()
    }));

    if (data.user.role === 'admin') {
      router.push('/admin-dashboard')
    } else {
      router.push('/user-home')
    }

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>