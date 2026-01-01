<template>
  <AdminLayout>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-2">
      <div class="bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-800 shadow-sm active:scale-95 md:hover:scale-[1.02] md:hover:border-violet-500/50 transition-all cursor-pointer group">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Store Sales</p>
        <div class="flex items-end justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-black text-white">{{ loading ? '...' : formatCurrency(stats.store_sales) }}</h2>
          <span class="text-emerald-500 text-[10px] font-bold mb-1">Sales</span>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Capital Year</p>
          <p class="text-sm font-black text-violet-400">{{ loading ? '...' : formatCurrency(stats.store_capital) }}</p>
        </div>
      </div>

      <div class="bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-800 active:scale-95 md:hover:scale-[1.02] md:hover:border-blue-500/50 transition-all cursor-pointer">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">GCash & ATM</p>
        <div class="flex items-end justify-between mb-4">
          <h2 class="text-xl md:text-2xl font-black text-white">{{ loading ? '...' : formatCurrency(stats.gcash_atm_sales) }}</h2>
          <span class="text-blue-400 text-[10px] font-bold mb-1">Sales</span>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Capital Year</p>
          <p class="text-sm font-black text-blue-400">{{ loading ? '...' : formatCurrency(stats.gcash_atm_capital) }}</p>
        </div>
      </div>

      <div class="bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-800 active:scale-95 md:hover:scale-[1.02] transition-all md:hover:border-yellow-500/50 transition-all cursor-pointer">
        <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Total Stocks</p>
        <div class="flex items-end justify-between">
          <h2 class="text-xl md:text-2xl font-black text-white">{{ loading ? '...' : stats.total_stocks.toLocaleString() }}</h2>
          <span class="text-amber-500 text-[10px] font-bold mb-1">Level</span>
        </div>
        <div class="mt-5 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div class="h-full transition-all duration-1000" :class="stockProgress.color" :style="{ width: stockProgress.width }"></div>
        </div>
      </div>

      <div class="bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-800 active:scale-95 md:hover:scale-[1.02] transition-all md:hover:border-green-500/50 transition-all cursor-pointer">
        <div class="flex justify-between items-start mb-2">
           <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lending</p>
           <div class="text-right">
             <p class="text-[8px] font-black text-slate-500 uppercase tracking-widest text-emerald-400">Interest Accomulate: {{ loading ? '...' : formatCurrency(stats.lending_sales) }}</p>
           </div>
        </div>
        <div class="flex items-center space-x-4 mb-4">
          <div><p class="text-[9px] text-slate-500 font-bold uppercase">Paid</p><p class="text-lg font-black text-emerald-500">{{ stats.paid_count }}</p></div>
          <div class="h-8 w-px bg-slate-800"></div>
          <div><p class="text-[9px] text-slate-500 font-bold uppercase">Unpaid</p><p class="text-lg font-black text-rose-500">{{ stats.unpaid_count }}</p></div>
        </div>
        <div class="pt-4 border-t border-slate-800/50">
          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest text-rose-400">Total Capital: {{ formatCurrency(stats.total_accumulate) }}</p>
        </div>
      </div>
    </div>

    <div class="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8 px-2">
      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 class="text-lg font-black text-white tracking-tight uppercase italic mb-6">Monthly Sales</h3>
        <div class="overflow-x-auto pb-4 custom-scrollbar">
          <div class="relative min-w-[500px] h-64 mt-10 px-2">
            <div class="flex items-end justify-between h-48 w-full gap-2">
              <div v-for="(data, i) in monthlyData" :key="i"
                   @click="activeMonth = i"
                   class="flex-1 flex flex-col justify-end items-center group/bar relative h-full cursor-pointer">
                <span :class="{'opacity-100 -top-10': activeMonth === i}"
                      class="absolute -top-8 text-[9px] font-black text-white bg-slate-950 px-2 py-1 rounded border border-slate-800 opacity-0 md:group-hover/bar:opacity-100 transition-all z-10 whitespace-nowrap">
                  {{ formatCurrency(data.val) }}
                </span>
                <div class="w-full bg-gradient-to-t from-emerald-600/20 to-emerald-500 border-t-2 border-emerald-400 rounded-t-sm transition-all duration-700" :style="{ height: data.h }"></div>
                <span class="text-[9px] font-black text-slate-500 mt-4 uppercase">{{ data.m }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 overflow-hidden">
        <h3 class="text-lg font-black text-white tracking-tight uppercase italic mb-8">Yearly Comparison</h3>
        <div class="flex flex-col sm:flex-row items-center justify-around gap-8">
          <div v-if="yearlySales.length" class="relative w-40 h-40 md:w-52 md:h-52 rounded-full border-4 border-slate-800 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
               :style="{ background: `conic-gradient(#10b981 0% ${yearlySales[0].percent}%, #1e293b ${yearlySales[0].percent}% 100%)` }">
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p class="text-[10px] md:text-xs font-black text-white italic leading-tight">{{ formatCurrency(yearlySales[0].val) }}</p>
              <p class="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter">{{ yearlySales[0].year }}</p>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-1 gap-3 w-full sm:w-auto">
            <div v-for="(year, idx) in yearlySales" :key="idx" class="p-3 rounded-2xl bg-slate-950/50 border border-slate-800">
              <div class="flex items-center space-x-2">
                <div :class="['w-2 h-2 rounded-full', idx === 0 ? 'bg-emerald-500' : 'bg-slate-600']"></div>
                <span class="text-[10px] font-black text-white uppercase italic">{{ year.year }}</span>
              </div>
              <p :class="['text-lg font-bold mt-1', idx === 0 ? 'text-emerald-400' : 'text-slate-500']">{{ year.percent }}%</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div class="mt-8 px-2 pb-10">
      <section class="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-2">
          <h3 class="text-lg font-black text-white tracking-tight uppercase italic">Top 12 Categories</h3>
          <p class="text-slate-500 text-[10px] font-bold tracking-widest uppercase bg-slate-950 px-3 py-1 rounded-full border border-slate-800">Unit Deductions</p>
        </div>

        <div class="overflow-x-auto pb-6 custom-scrollbar">
          <div class="min-w-[700px] flex items-end justify-between px-2 gap-2">

            <div v-for="(item, i) in productTrend" :key="i"
                class="flex-1 flex flex-col items-center group/trend relative">

              <span :class="{'opacity-100 -top-10': activeTrend === i}"
                    class="absolute -top-8 left-1/2 -translate-x-1/2 text-[9px] font-black text-white bg-slate-950 px-2 py-1 rounded border border-slate-800 opacity-0 md:group-hover/trend:opacity-100 transition-all whitespace-nowrap z-20 shadow-xl pointer-events-none">
                {{ item.val }} Units
              </span>

              <div class="w-full h-48 flex items-end justify-center cursor-pointer" @click="activeTrend = i">
                <div class="w-full max-w-[40px] bg-gradient-to-t from-violet-600 to-indigo-500 rounded-t-lg transition-all duration-500 active:brightness-150"
                    :style="{ height: item.h + '%' }">
                </div>
              </div>

              <span class="mt-4 text-[9px] font-black text-slate-500 uppercase tracking-tighter text-center w-full truncate px-1">
                {{ item.name }}
              </span>

            </div>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabaseClient.js'
import AdminLayout from '../pages/components/AdminLayout.vue'

// Mobile Interaction States
const activeMonth = ref(null)
const activeTrend = ref(null)

const loading = ref(true)
const stats = ref({ store_sales: 0, store_capital: 0, gcash_atm_sales: 0, gcash_atm_capital: 0, total_stocks: 0, paid_count: 0, unpaid_count: 0, total_accumulate: 0, lending_sales: 0 })
const monthlyData = ref([])
const yearlySales = ref([])
const productTrend = ref([])

const stockProgress = computed(() => {
  const count = stats.value.total_stocks
  if (count < 500) return { width: '20%', color: 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]' }
  if (count <= 1000) return { width: '45%', color: 'bg-orange-500' }
  if (count <= 1500) return { width: '70%', color: 'bg-yellow-400' }
  return { width: '100%', color: 'bg-emerald-500' }
})

const fetchData = async () => {
  try {
    loading.value = true
    const { data: invData } = await supabase.from('inventory').select('*')
    const { data: stockData } = await supabase.from('stock_in').select('*')
    const { data: gcashData } = await supabase.from('gcash_atm').select('*')
    const { data: lendData } = await supabase.from('lending_list').select('*')
    const { data: reportFromDB } = await supabase.from('sales_report').select('*').maybeSingle()

    let sSales = 0, sCap = 0, stockCount = 0, gSales = 0, gCap = 0, lPaid = 0, lUnpaid = 0, lAcc = 0, lSales = 0
    if (invData) {
      sSales = invData.reduce((acc, i) => acc + (Number(i.deduct || 0) * Number(i.price || 0)), 0)
      stockCount = invData.reduce((acc, i) => acc + Number(i.quantity || 0), 0)
    }
    if (stockData) sCap = stockData.reduce((acc, i) => acc + (Number(i.quantity || 0) * Number(i.srp || 0)), 0)
    if (gcashData) {
      gSales = gcashData.reduce((acc, i) => acc + Number(i.interest || 0), 0)
      gCap = gcashData.reduce((acc, i) => acc + Number(i.cash_in || 0) + Number(i.cash_out || 0) + Number(i.withdraw || 0), 0)
    }
    if (lendData) {
      lendData.forEach(item => {
        if (item.status?.toUpperCase() === 'PAID') lPaid++; else lUnpaid++
        lAcc += Number(item.deduct || 0); lSales += Number(item.interest || 0)
      })
    }
    stats.value = { store_sales: sSales, store_capital: sCap, gcash_atm_sales: gSales, gcash_atm_capital: gCap, total_stocks: stockCount, paid_count: lPaid, unpaid_count: lUnpaid, total_accumulate: lAcc, lending_sales: lSales }

    const currentMonthIndex = new Date().getMonth()
    const liveTotal = sSales + gSales + lSales
    let baseMonthly = reportFromDB?.monthly_sales || Array(12).fill(0).map((_, i) => ({ m: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][i], val: 0, h: '0%' }))
    const maxVal = Math.max(...baseMonthly.map(m => m.val), liveTotal, 1)
    monthlyData.value = baseMonthly.map((m, idx) => {
      const value = idx === currentMonthIndex ? liveTotal : m.val
      return { ...m, val: value, h: `${(value / maxVal) * 100}%` }
    })

    const annualSum = monthlyData.value.reduce((acc, m) => acc + m.val, 0)
    const currentYear = new Date().getFullYear()
    yearlySales.value = [
      { year: currentYear.toString(), val: annualSum, percent: ((annualSum / (reportFromDB?.yearly_sales?.[1]?.val || 100000)) * 100).toFixed(0) },
      { year: (currentYear - 1).toString(), val: reportFromDB?.yearly_sales?.[1]?.val || 0, percent: 100 }
    ]

    if (invData) {
      const catMap = invData.reduce((acc, item) => {
        const cat = item.category || 'Other'
        acc[cat] = (acc[cat] || 0) + Number(item.deduct || 0)
        return acc
      }, {})
      const sortedTrend = Object.keys(catMap).map(name => ({ name, val: catMap[name] })).sort((a,b) => b.val - a.val).slice(0, 12)
      const maxDeduct = Math.max(...sortedTrend.map(t => t.val), 1)
      productTrend.value = sortedTrend.map(t => ({ ...t, h: (t.val / maxDeduct) * 100 }))
    }

    await supabase.from('sales_report').upsert({ id: 1, monthly_sales: monthlyData.value, product_trend: productTrend.value, yearly_sales: yearlySales.value })

  } catch (err) { console.error(err) } finally { loading.value = false }
}

let channels = []
onMounted(() => {
  fetchData()
  const tables = ['inventory', 'stock_in', 'gcash_atm', 'lending_list']
  tables.forEach(table => {
    const channel = supabase.channel(`pub:${table}`).on('postgres_changes', { event: '*', schema: 'public', table }, () => fetchData()).subscribe()
    channels.push(channel)
  })

  // Reset mobile tooltips when clicking away
  window.addEventListener('touchstart', (e) => {
    if (!e.target.closest('.group\\/bar') && !e.target.closest('.group\\/trend')) {
      activeMonth.value = null
      activeTrend.value = null
    }
  })
})
onUnmounted(() => {
    channels.forEach(ch => supabase.removeChannel(ch))
})

const formatCurrency = (val) => isNaN(val) ? '₱0.00' : new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(val)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
</style>