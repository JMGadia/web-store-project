<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-white tracking-tight uppercase italic">Dashboard Overview</h1>
      <p class="text-slate-500 text-sm tracking-wide">Gadia Sari-Sari Store Management System</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm hover:border-violet-500/50 transition-all group">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Store Sales</p>
        <div class="flex items-end justify-between mb-4">
          <h2 class="text-2xl font-black text-white">
            {{ loading ? '...' : formatCurrency(stats.store_sales) }}
          </h2>
          <span class="text-emerald-500 text-xs font-bold mb-1">+12% ↑</span>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Capital This Year</p>
          <p class="text-sm font-black text-violet-400">
            {{ loading ? '...' : formatCurrency(stats.store_capital) }}
          </p>
        </div>
      </div>

      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm hover:border-blue-500/50 transition-all">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">GCash & ATM</p>
        <div class="flex items-end justify-between mb-4">
          <h2 class="text-2xl font-black text-white">
            {{ loading ? '...' : formatCurrency(stats.gcash_atm_sales) }}
          </h2>
          <span class="text-blue-400 text-xs font-bold mb-1">Sales</span>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Capital This Year</p>
          <p class="text-sm font-black text-blue-400">
            {{ loading ? '...' : formatCurrency(stats.gcash_atm_capital) }}
          </p>
        </div>
      </div>

      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm hover:border-amber-500/50 transition-all">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Stocks</p>
        <div class="flex items-end justify-between">
          <h2 class="text-2xl font-black text-white">
            {{ loading ? '...' : stats.total_stocks.toLocaleString() }}
          </h2>
          <span class="text-amber-500 text-xs font-bold mb-1">Live Inventory</span>
        </div>
        <div class="mt-5 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="bg-amber-500 h-full w-[80%]"></div>
        </div>
      </div>

      <div class="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-sm hover:border-rose-500/50 transition-all">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Lending Status</p>
        <div class="flex items-center space-x-4 mt-1 mb-4">
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase">Paid</p>
            <p class="text-xl font-black text-emerald-500">
              {{ loading ? '..' : stats.paid_count }}
            </p>
          </div>
          <div class="h-8 w-px bg-slate-800"></div>
          <div>
            <p class="text-[10px] text-slate-500 font-bold uppercase">Not Paid</p>
            <p class="text-xl font-black text-rose-500">
              {{ loading ? '..' : stats.unpaid_count }}
            </p>
          </div>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Accumulate</p>
          <p class="text-sm font-black text-rose-400">
            {{ loading ? '...' : formatCurrency(stats.total_accumulate) }}
          </p>
        </div>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 group overflow-hidden">
        <div class="mb-6">
          <h3 class="text-lg font-black text-white tracking-tight uppercase italic">Monthly Sales Performance</h3>
          <p class="text-slate-500 text-xs font-bold tracking-widest uppercase">Gadia Revenue Flow</p>
        </div>

        <div class="overflow-x-auto pb-4 custom-scrollbar">
          <div class="relative min-w-[600px] h-64 mt-10 px-2">
            <div class="flex items-end justify-between h-48 w-full gap-3 px-1">
              <div v-for="(data, i) in monthlyData" :key="i" class="flex-1 flex flex-col justify-end items-center group/bar relative h-full">
                <span class="absolute -top-8 text-[10px] font-black text-white bg-slate-950 px-2 py-1 rounded border border-slate-800 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 z-10 whitespace-nowrap shadow-xl">
                  ₱{{ data.val }}
                </span>
                <div
                  class="w-full monthly-bar bg-gradient-to-t from-emerald-500/5 via-emerald-500/20 to-emerald-500 border-t-2 border-emerald-400 rounded-t-md transition-all duration-700 ease-out"
                  :style="{ height: data.h }"
                ></div>
                <span class="text-[10px] font-black text-slate-500 mt-4 uppercase tracking-tighter">{{ data.m }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-8 group overflow-hidden">
        <div class="mb-8">
          <h3 class="text-lg font-black text-white tracking-tight uppercase italic">Yearly Sales Comparison</h3>
          <p class="text-slate-500 text-xs font-bold tracking-widest uppercase">Performance vs Previous Year</p>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-around gap-10">
          <div class="relative w-56 h-56 rounded-full transition-all duration-500 group-hover:scale-110 shadow-[0_0_50px_rgba(16,185,129,0.15)] border-4 border-slate-800 overflow-hidden"
               style="background: conic-gradient(#10b981 0% 55%, #475569 55% 100%);">
            <div class="absolute top-[25%] left-[60%] -translate-x-1/2 text-center pointer-events-none">
              <p class="text-[10px] font-black text-white drop-shadow-md italic">₱450k</p>
              <p class="text-[8px] font-bold text-emerald-100 uppercase">2024</p>
            </div>
            <div class="absolute bottom-[25%] left-[20%] text-center pointer-events-none">
              <p class="text-[10px] font-black text-white drop-shadow-md italic">₱380k</p>
              <p class="text-[8px] font-bold text-slate-300 uppercase">2023</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 group-hover:border-emerald-500/50 transition-all">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-sm bg-emerald-500"></div>
                <span class="text-xs font-black text-white uppercase italic">Current Year</span>
              </div>
              <p class="text-xl font-bold text-emerald-400 mt-1">55%</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 group-hover:border-slate-500/50 transition-all">
              <div class="flex items-center space-x-3">
                <div class="w-3 h-3 rounded-sm bg-slate-600"></div>
                <span class="text-xs font-black text-white uppercase italic">Last Year</span>
              </div>
              <p class="text-xl font-bold text-slate-500 mt-1">45%</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="mt-8 space-y-8">
      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-8">
        <div class="flex justify-between items-center mb-8">
          <h3 class="text-lg font-black text-white tracking-tight bold uppercase">Products Trend</h3>
        </div>
        <div class="flex items-end justify-around h-48 space-x-2">
          <div v-for="(h, i) in [40, 90, 65, 80, 30, 100, 55, 55]" :key="i" class="w-full max-w-[40px] bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg transition-all hover:brightness-125 hover:scale-105 cursor-pointer" :style="{ height: h + '%' }"></div>
        </div>
        <div class="flex justify-around mt-4 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
          <span>Rice</span><span>Eggs</span><span>Coffee</span><span>Canned</span><span>Soda</span><span>Bread</span><span>Snacks</span><span>ICE CREAM</span>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Update this path to where your actual Supabase client file is located
import { supabase } from '../supabaseClient.js'
import AdminLayout from '../pages/components/AdminLayout.vue'

// Reactive state for database values
const stats = ref({
  store_sales: 0,
  store_capital: 0,
  gcash_atm_sales: 0,
  gcash_atm_capital: 0,
  total_stocks: 0,
  paid_count: 0,
  unpaid_count: 0,
  total_accumulate: 0
})

const loading = ref(true)

// Static data for Monthly Chart (for now)
const monthlyData = ref([
  {m: 'JAN', h: '25%', val: '250K'}, {m: 'FEB', h: '30%', val: '300K'},
  {m: 'MAR', h: '45%', val: '450K'}, {m: 'APR', h: '40%', val: '400K'},
  {m: 'MAY', h: '55%', val: '550K'}, {m: 'JUN', h: '60%', val: '600K'},
  {m: 'JUL', h: '75%', val: '750K'}, {m: 'AUG', h: '70%', val: '700K'},
  {m: 'SEP', h: '85%', val: '850K'}, {m: 'OCT', h: '90%', val: '900K'},
  {m: 'NOV', h: '100%', val: '1.0M'}, {m: 'DEC', h: '42%', val: '421K'}
])

const fetchStats = async () => {
  try {
    const { data, error } = await supabase
      .from('stat_cards')
      .select('*')
      .limit(1)
      .single()

    if (error) throw error
    if (data) stats.value = data
  } catch (err) {
    console.error('Error loading dashboard stats:', err.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(val)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #10b981;
}

.group\/bar:hover .monthly-bar {
  filter: brightness(1.2);
  box-shadow: 0 -4px 12px rgba(16, 185, 129, 0.3);
}

.monthly-bar {
  min-height: 2px;
}
</style>