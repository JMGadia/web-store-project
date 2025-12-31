<template>
  <div class="min-h-screen bg-slate-950 flex flex-col justify-center items-center py-12 px-4 relative overflow-hidden">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-violet-500/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-black text-white tracking-tighter uppercase italic">
          Join <span class="text-violet-500">GD-Store</span>
        </h2>
        <p class="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mt-2">Create an Account</p>
      </div>

      <div class="bg-slate-900/50 backdrop-blur-xl py-10 px-8 shadow-2xl rounded-[2.5rem] border border-slate-800/50 relative">
        <form class="space-y-6" @submit.prevent="handleSignup">
          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
            <div class="relative group">
              <input v-model="form.username" type="text" placeholder="Min 6 characters" required
                class="block w-full px-5 py-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Gmail Address</label>
            <input v-model="form.email" type="email" placeholder="example@gmail.com" required
              class="block w-full px-5 py-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all" />
          </div>

          <div class="space-y-2">
            <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" required
                class="block w-full px-5 py-4 bg-slate-950/50 rounded-2xl border border-slate-800 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 outline-none transition-all" />
              <button type="button" @click="showPassword = !showPassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-violet-400 transition-colors">
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L14.5 4.5M21 12a9.54 9.54 0 01-1.5 4.5m-1.5 2L18.5 21" /></svg>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading"
            class="group relative w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-black uppercase tracking-widest rounded-2xl overflow-hidden shadow-xl shadow-violet-500/20 active:scale-95 transition-all disabled:opacity-50">
            <span class="relative z-10">{{ loading ? 'Establishing Link...' : 'Initialize Sign Up' }}</span>
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </form>

        <transition name="fade">
          <div v-if="message"
               :class="`mt-6 p-4 rounded-2xl text-center text-xs font-bold border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-rose-500/10 border-rose-500/50 text-rose-400'}`">
            {{ message }}
          </div>
        </transition>

        <div class="mt-8 text-center">
          <router-link to="/login" class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] hover:text-violet-400 transition-colors">
            Already have credentials? <span class="text-violet-500 underline underline-offset-4 ml-1">Access System</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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
const form = ref({ username: '', email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const message = ref('')
const isSuccess = ref(false)

const handleSignup = async () => {
  if (form.value.username.length < 6) {
    message.value = "Username must be 6+ characters!";
    return;
  }

  loading.value = true
  message.value = ''

  try {
    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()

    if (!res.ok) throw new Error(data.error)

    isSuccess.value = true
    message.value = "Registration successful! Please check your Gmail to verify your account."
    // Don't redirect immediately so they can read the instruction
  } catch (err) {
    isSuccess.value = false
    message.value = err.message
  } finally {
    loading.value = false
  }
}
</script>