<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-violet-500/30 font-sans overflow-x-hidden">
    <nav class="bg-slate-900/80 backdrop-blur-xl shadow-2xl border-b border-slate-800/50 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-[60]">
      <div class="flex items-center space-x-3 shrink-0">
        <div class="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <span class="text-lg md:text-2xl font-black text-white tracking-tight shrink-0">
          Gadia<span class="text-violet-500 italic">SARI</span>
        </span>
      </div>

      <div class="hidden md:flex items-center flex-1 justify-end ml-4 lg:ml-8">
        <div class="flex items-center space-x-1 border-r border-slate-800 pr-4 lg:pr-6 mr-4 lg:mr-6 overflow-x-auto no-scrollbar">
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path"
            class="px-3 lg:px-4 py-2 text-[12px] lg:text-sm font-bold text-slate-400 hover:text-white transition-all rounded-lg hover:bg-slate-800 whitespace-nowrap"
            active-class="text-violet-400 bg-violet-500/10">
            {{ link.name }}
          </router-link>
        </div>

        <div class="relative">
          <button @click="isAccountDropdownOpen = !isAccountDropdownOpen"
            class="flex items-center space-x-2 bg-slate-800/50 px-3 lg:px-4 py-2.5 rounded-xl border border-slate-700/50 hover:bg-slate-700 transition-all">
            <div class="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-[10px] font-black uppercase text-white shrink-0">
              {{ adminName.charAt(0) }}
            </div>
            <span class="text-xs lg:text-sm font-bold text-slate-200 hidden sm:inline">Admin</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-500 transition-transform" :class="{'rotate-180': isAccountDropdownOpen}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <transition name="fade">
            <div v-if="isAccountDropdownOpen" class="absolute right-0 mt-3 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl py-3 z-[70]">
              <div class="px-5 py-3 border-b border-slate-800 mb-2">
                <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Details</p>
                <p class="text-sm font-bold text-white truncate">{{ adminName }}</p>
                <p class="text-xs text-slate-400 truncate">{{ adminEmail }}</p>
              </div>
              <button @click="triggerLogoutModal" class="w-[calc(100%-16px)] mx-2 flex items-center space-x-3 px-3 py-2.5 text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-bold text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                <span>Sign Out</span>
              </button>
            </div>
          </transition>
        </div>
      </div>

      <div class="md:hidden flex items-center">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-slate-300 p-2 hover:bg-slate-800 rounded-xl transition-colors">
          <svg v-if="!isMobileMenuOpen" xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10m-10 6h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </nav>

    <transition name="slide">
      <div v-if="isMobileMenuOpen" class="fixed inset-y-0 right-0 w-[280px] z-[55] bg-slate-900 border-l border-slate-800 shadow-2xl md:hidden flex flex-col pt-20">
        <div class="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          <div class="bg-slate-950/50 p-4 rounded-2xl border border-slate-800 mb-6">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Signed In As</p>
            <h2 class="text-lg font-black text-white truncate">{{ adminName }}</h2>
          </div>
          <router-link v-for="link in navLinks" :key="link.path" :to="link.path" @click="isMobileMenuOpen = false"
            class="flex items-center px-4 py-4 rounded-xl text-base font-bold text-slate-300 hover:bg-slate-800 transition-all"
            active-class="bg-violet-600 text-white shadow-lg shadow-violet-600/20">
            {{ link.name }}
          </router-link>
          <button @click="triggerLogoutModal" class="w-full text-left px-4 py-4 text-rose-500 font-bold mt-4 border-t border-slate-800">Sign Out</button>
        </div>
      </div>
    </transition>

    <div v-if="isMobileMenuOpen || isAccountDropdownOpen"
         class="fixed inset-0 bg-black/20 z-[40]"
         @click="isMobileMenuOpen = false; isAccountDropdownOpen = false"></div>

    <transition name="modal">
      <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-950/90 backdrop-blur-md" @click="showLogoutModal = false"></div>
        <div class="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
          <div class="text-center">
            <h3 class="text-xl font-black text-white mb-6 uppercase">Confirm Logout?</h3>
            <div class="grid grid-cols-2 gap-3">
              <button @click="showLogoutModal = false" class="py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-[10px] uppercase">Cancel</button>
              <button @click="confirmLogout" class="py-3 bg-rose-600 text-white font-bold rounded-xl text-[10px] uppercase">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <main class="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto min-h-[calc(100vh-80px)]">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const adminName = ref('Admin')
const adminEmail = ref('')
const isMobileMenuOpen = ref(false)
const isAccountDropdownOpen = ref(false) // Added for tablet click support
const showLogoutModal = ref(false)

const navLinks = [
  { name: 'Dashboard', path: '/admin-dashboard' },
  { name: 'Inventory', path: '/inventory' },
  { name: 'Stock In', path: '/stock-in' },
  { name: 'GCash & ATM', path: '/gcash-atm' },
  { name: 'Lending List', path: '/lending-list' }
]

const triggerLogoutModal = () => {
  isMobileMenuOpen.value = false
  isAccountDropdownOpen.value = false
  showLogoutModal.value = true
}

// Close dropdown on escape key
const handleEsc = (e) => {
  if (e.key === 'Escape') {
    isAccountDropdownOpen.value = false
    isMobileMenuOpen.value = false
  }
}

onMounted(() => {
  const session = localStorage.getItem('userSession')
  if (session) {
    const userData = JSON.parse(session)
    adminName.value = userData.username || 'Admin'
    adminEmail.value = userData.email || 'No email provided'
  }
  window.addEventListener('keydown', handleEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleEsc)
})

const confirmLogout = () => {
  localStorage.removeItem('userSession')
  router.replace('/login')
}
</script>