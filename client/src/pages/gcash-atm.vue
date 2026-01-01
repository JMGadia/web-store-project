<template>
  <AdminLayout>
    <transition name="toast">
      <div v-if="toast.show" class="fixed top-5 right-5 z-[200] bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-2xl font-bold flex items-center space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight italic uppercase">GCash & ATM</h1>
        <p class="text-slate-500 text-sm">Pang Track ng Kita sa GCash at ATM at Listahan</p>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <select v-model="selectedMonth" class="bg-slate-900 border border-slate-800 text-slate-400 text-xs font-bold rounded-2xl px-4 py-3 appearance-none cursor-pointer">
          <option v-for="m in months" :key="m" :value="m">{{ m }}</option>
        </select>

        <button @click="addTransactionRow" class="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" /></svg>
          <span>New Entry</span>
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">GCash App Capital</p>
          <button @click="openModal('app')" class="px-3 py-1 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase transition-all hover:bg-blue-500">Update</button>
        </div>
        <h2 class="text-2xl font-black text-white italic">₱{{ latestAppCapital.toLocaleString() }}</h2>
        <p class="text-[9px] text-slate-500 mt-2 uppercase tracking-tighter italic">App Wallet Balance</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">GCash Cash Capital</p>
          <button @click="openModal('cash')" class="px-3 py-1 bg-amber-600 text-white rounded-lg text-[9px] font-black uppercase transition-all hover:bg-amber-500">Update</button>
        </div>
        <h2 class="text-2xl font-black text-white italic">₱{{ latestCashCapital.toLocaleString() }}</h2>
        <p class="text-[9px] text-slate-500 mt-2 uppercase tracking-tighter italic">Physical Money on Hand</p>
      </div>

      <div class="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] shadow-xl relative overflow-hidden group">
        <div class="flex items-center justify-between mb-4">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">ATM Capital</p>
          <button @click="openModal('atm')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase transition-all hover:bg-emerald-500">Update</button>
        </div>
        <h2 class="text-2xl font-black text-white italic">₱{{ latestAtmCapital.toLocaleString() }}</h2>
        <p class="text-[9px] text-slate-500 mt-2 uppercase tracking-tighter italic">Bank/ATM Balance</p>
      </div>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/50 border-b border-slate-800 text-slate-400">
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em]">Date & Time</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Cash In (To App)</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Cash Out (From App)</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Withdraw</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 text-center">Interest/Fee</th>
              <th class="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="(tr, i) in paginatedTransactions" :key="tr.id || i" :class="[tr.status === 'Locked' ? 'bg-slate-950/40' : 'hover:bg-slate-800/20']">
              <td class="px-4 py-3 font-mono text-[10px] text-slate-300">
                <input type="datetime-local" v-model="tr.datetime" :disabled="tr.status === 'Locked'" class="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white w-full uppercase" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span class="text-slate-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="tr.cash_in" :disabled="tr.status === 'Locked'" class="bg-transparent text-xs text-white outline-none w-full font-bold" />
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span class="text-slate-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="tr.cash_out" :disabled="tr.status === 'Locked'" class="bg-transparent text-xs text-white outline-none w-full font-bold" />
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <span class="text-slate-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="tr.withdraw" :disabled="tr.status === 'Locked'" class="bg-transparent text-xs text-white outline-none w-full font-bold" />
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center bg-slate-950 border border-cyan-900/30 rounded-xl px-3 py-2">
                  <span class="text-cyan-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="tr.interest" :disabled="tr.status === 'Locked'" class="bg-transparent text-xs text-cyan-400 font-black outline-none w-full text-center" />
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <span v-if="tr.status === 'Locked'" class="text-slate-700 text-[9px] font-black uppercase italic tracking-widest">Locked</span>
                <button v-else @click="removeRow(i)" class="text-rose-500/50 hover:text-rose-500 text-[9px] font-black uppercase">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="p-6 bg-slate-800/30 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="flex items-center space-x-4">
          <button @click="currentPage--" :disabled="currentPage === 1" class="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20"> < </button>
          <span class="text-[10px] font-black text-slate-500 uppercase">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage >= totalPages" class="p-2 bg-slate-800 text-white rounded-lg disabled:opacity-20"> > </button>
        </div>

        <div v-if="hasUnsaved" class="flex items-center space-x-8">
           <div class="text-right">
            <p class="text-[9px] font-black text-slate-500 uppercase">New Interest Earned</p>
            <p class="text-lg font-black text-cyan-400">₱{{ totalUnsavedInterest.toFixed(2) }}</p>
          </div>
          <button @click="showSaveModal = true" class="bg-cyan-600 hover:bg-cyan-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95">
            Lock Entries
          </button>
        </div>
      </div>
    </div>

    <transition name="modal">
      <div v-if="activeModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-950/90 backdrop-blur-md" @click="activeModal = null"></div>
        <div class="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-8">
          <h3 class="text-lg font-black text-white mb-2 uppercase text-center">Supply {{ modalTitle }}</h3>
          <p class="text-[10px] text-slate-500 uppercase text-center mb-6 italic">This adds to current: ₱{{ currentModalBalance.toLocaleString() }}</p>

          <div class="space-y-4">
            <div class="bg-slate-950 border border-slate-800 rounded-2xl p-4">
              <span class="text-[9px] font-black text-slate-500 uppercase block mb-1">Addition Amount</span>
              <input type="number" v-model="supplyAmount" class="bg-transparent text-2xl font-black text-white outline-none w-full" placeholder="0.00" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <button @click="activeModal = null" class="py-4 bg-slate-800 text-slate-400 font-bold rounded-2xl text-[10px] uppercase">Cancel</button>
              <button @click="processUpdate" :disabled="isSaving" class="py-4 bg-indigo-600 text-white font-bold rounded-2xl text-[10px] uppercase">Confirm</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <transition name="modal">
      <div v-if="showSaveModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="fixed inset-0 bg-slate-950/90 backdrop-blur-md" @click="showSaveModal = false"></div>
        <div class="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 text-center">
          <h3 class="text-xl font-black text-white mb-6 uppercase">Save All Entries?</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="showSaveModal = false" class="py-3 bg-slate-800 text-slate-400 font-bold rounded-xl text-[10px] uppercase">Cancel</button>
            <button @click="confirmSave" :disabled="isSaving" class="py-3 bg-cyan-600 text-white font-bold rounded-xl text-[10px] uppercase">Lock Now</button>
          </div>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '../supabaseClient.js'
import AdminLayout from '../pages/components/AdminLayout.vue'

const showSaveModal = ref(false)
const isSaving = ref(false)
const activeModal = ref(null)
const supplyAmount = ref(0)
const toast = ref({ show: false, message: '' })

const baseAppCapital = ref(0)
const baseCashCapital = ref(0)
const baseAtmCapital = ref(0)

const selectedMonth = ref('December')
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const transactions = ref([])
const currentPage = ref(1)
const itemsPerPage = 12

let realtimeSubscription = null

onMounted(async () => {
  baseAppCapital.value = Number(localStorage.getItem('base_app_cap')) || 0
  baseCashCapital.value = Number(localStorage.getItem('base_cash_cap')) || 0
  baseAtmCapital.value = Number(localStorage.getItem('base_atm_cap')) || 0
  await fetchTransactions()
  setupRealtime()
})

onUnmounted(() => {
  if (realtimeSubscription) supabase.removeChannel(realtimeSubscription)
})

const triggerToast = (msg) => {
  toast.value.message = msg
  toast.value.show = true
  setTimeout(() => toast.value.show = false, 3000)
}

const setupRealtime = () => {
  realtimeSubscription = supabase
    .channel('public:gcash_atm')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'gcash_atm' }, () => {
      fetchTransactions()
    })
    .subscribe()
}

const fetchTransactions = async () => {
  const { data, error } = await supabase
    .from('gcash_atm')
    .select('*')
    .order('created_at', { ascending: false })

  if (!error && data) {
    transactions.value = data.map(item => ({
      ...item,
      datetime: item.transaction_date + 'T' + item.transaction_time,
    }))
  }
}

// --- CAPITAL LOGIC ---
const latestAppCapital = computed(() => {
  const locked = transactions.value.filter(t => t.status === 'Locked')
  return locked.length > 0 ? Number(locked[0].gcash_capital) : baseAppCapital.value
})

const latestCashCapital = computed(() => {
  const locked = transactions.value.filter(t => t.status === 'Locked')
  return locked.length > 0 ? Number(locked[0].cash_capital) : baseCashCapital.value
})

const latestAtmCapital = computed(() => {
  const locked = transactions.value.filter(t => t.status === 'Locked')
  return locked.length > 0 ? Number(locked[0].atm_capital) : baseAtmCapital.value
})

const currentModalBalance = computed(() => {
  if (activeModal.value === 'app') return latestAppCapital.value
  if (activeModal.value === 'cash') return latestCashCapital.value
  return latestAtmCapital.value
})

const modalTitle = computed(() => {
  if (activeModal.value === 'app') return 'App Balance'
  if (activeModal.value === 'cash') return 'Cash Balance'
  return 'ATM Balance'
})

const openModal = (type) => {
  activeModal.value = type
  supplyAmount.value = 0
}

const processUpdate = async () => {
  if (supplyAmount.value <= 0) return
  isSaving.value = true
  const now = new Date()
  const added = Number(supplyAmount.value)

  let newApp = latestAppCapital.value
  let newCash = latestCashCapital.value
  let newAtm = latestAtmCapital.value

  if (activeModal.value === 'app') newApp += added
  else if (activeModal.value === 'cash') newCash += added
  else if (activeModal.value === 'atm') newAtm += added

  try {
    const { error } = await supabase.from('gcash_atm').insert([{
      transaction_date: now.toISOString().split('T')[0],
      transaction_time: now.toTimeString().split(' ')[0],
      cash_in: 0, cash_out: 0, withdraw: 0, interest: 0,
      status: 'Locked',
      gcash_capital: newApp,
      cash_capital: newCash,
      atm_capital: newAtm
    }])
    if (error) throw error
    activeModal.value = null
    await fetchTransactions()
  } catch (err) {
    alert(err.message)
  } finally {
    isSaving.value = false
  }
}

// --- TRANSACTION LOGIC ---
const filteredTransactions = computed(() => {
  return transactions.value.filter(t => {
    return t.status === 'Pending' || (Number(t.cash_in) !== 0 || Number(t.cash_out) !== 0 || Number(t.withdraw) !== 0 || Number(t.interest) !== 0)
  })
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1)

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredTransactions.value.slice(start, start + itemsPerPage)
})

const totalUnsavedInterest = computed(() => {
  return transactions.value.filter(t => t.status !== 'Locked').reduce((sum, item) => sum + (Number(item.interest) || 0), 0)
})

const addTransactionRow = () => {
  const now = new Date().toISOString().slice(0, 16)
  transactions.value.unshift({ datetime: now, cash_in: 0, cash_out: 0, withdraw: 0, interest: 0, status: 'Pending' })
  currentPage.value = 1
}

const removeRow = (i) => {
  const indexInMain = transactions.value.indexOf(paginatedTransactions.value[i])
  transactions.value.splice(indexInMain, 1)
}

const hasUnsaved = computed(() => transactions.value.some(t => t.status !== 'Locked'))

const confirmSave = async () => {
  const unsaved = transactions.value.filter(t => t.status !== 'Locked')

  if (unsaved.some(t => !t.interest || Number(t.interest) <= 0)) {
    triggerToast("Interest/Fee is required for all entries!")
    showSaveModal.value = false
    return
  }

  isSaving.value = true
  try {
    let runningApp = latestAppCapital.value
    let runningCash = latestCashCapital.value
    let runningAtm = latestAtmCapital.value

    // Reverse to process the oldest pending entry first for correct running totals
    const entriesToSave = [...unsaved].reverse().map(t => {
      const cIn = Number(t.cash_in) || 0
      const cOut = Number(t.cash_out) || 0
      const wth = Number(t.withdraw) || 0

      // NEW FIXED MATH LOGIC:
      // Cash In: App Deducts (-), Cash Increases (+)
      runningApp -= cIn
      runningCash += cIn

      // Cash Out: App Increases (+), Cash Deducts (-)
      runningApp += cOut
      runningCash -= cOut

      // Withdraw: ATM Deducts (-)
      runningAtm -= wth

      return {
        transaction_date: t.datetime.split('T')[0],
        transaction_time: t.datetime.split('T')[1],
        cash_in: cIn, cash_out: cOut, withdraw: wth,
        interest: Number(t.interest),
        status: 'Locked',
        gcash_capital: runningApp,
        cash_capital: runningCash,
        atm_capital: runningAtm
      }
    })

    const { error } = await supabase.from('gcash_atm').insert(entriesToSave)
    if (error) throw error
    showSaveModal.value = false
    await fetchTransactions()
  } catch (err) {
    alert(err.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s ease; }
.toast-enter-from, .toast-leave-to { transform: translateX(100%); opacity: 0; }
</style>