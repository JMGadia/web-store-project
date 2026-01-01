<template>
  <AdminLayout>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight italic uppercase text-amber-500">Lending List</h1>
        <p class="text-slate-500 text-sm">Listahan ng mga Utang sa Tindahan</p>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="relative group">
          <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg class="w-4 h-4 text-slate-500 group-focus-within:text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search Borrower Name..."
            class="bg-slate-950 border border-slate-800 text-white text-xs rounded-2xl py-3 pl-10 pr-4 w-64 focus:outline-none focus:border-amber-500/50 transition-all font-bold tracking-wide"
          />
        </div>

        <button @click="addLendingRow" class="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 w-full md:w-auto">
          Add New Record
        </button>
      </div>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/50 border-b border-slate-800 text-slate-400">
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest">Date & Time</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest">Name</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400">Borrowed Money</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">Contract</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Interest (8%)</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-orange-400">Deduct</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
              <th class="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="(loan, i) in filteredRecords" :key="loan.id || i" class="hover:bg-slate-800/20 transition-colors">

              <td class="px-3 py-3">
                <input type="datetime-local" v-model="loan.datetime" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] text-white w-full disabled:opacity-80" />
              </td>

              <td class="px-3 py-3">
                <input type="text" v-model="loan.name" :disabled="loan.isLocked" placeholder="Enter Name" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white w-full disabled:opacity-50 font-bold" />
              </td>

              <td class="px-3 py-3">
                <div class="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-2" :class="{'border-emerald-500/50': loan.flash}">
                  <span class="text-slate-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="loan.amount" @input="calculateInterest(loan)" :disabled="loan.isLocked" class="bg-transparent text-xs text-white w-full outline-none disabled:text-amber-400 font-bold" />
                </div>
              </td>

              <td class="px-3 py-3">
                <div class="flex gap-1">
                  <input type="number" v-model="loan.durationValue" @input="calculateInterest(loan)" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-indigo-300 w-16 disabled:opacity-50" />
                  <select v-model="loan.durationUnit" @change="calculateInterest(loan)" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-1 py-2 text-[10px] text-indigo-400 outline-none w-full disabled:opacity-50">
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </td>

              <td class="px-3 py-3">
                <div class="flex items-center bg-slate-950 border border-emerald-900/20 rounded-lg px-2 py-2">
                  <span class="text-emerald-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="loan.interest" disabled class="bg-transparent text-xs text-emerald-400 font-black w-full outline-none text-center" />
                </div>
              </td>

              <td class="px-3 py-3">
                <div
                  class="flex items-center bg-slate-950 border border-orange-500/30 rounded-lg px-2 py-2 transition-all focus-within:border-orange-500"
                  :class="{'opacity-30 border-slate-800 pointer-events-none': loan.status === 'Paid'}"
                >
                  <span class="text-orange-600 text-[10px] mr-1">₱</span>
                  <input
                    type="number"
                    v-model="loan.deductValue"
                    :disabled="loan.status === 'Paid'"
                    class="bg-transparent text-xs text-orange-200 w-full outline-none font-bold disabled:text-slate-500"
                    placeholder="0"
                  />
                </div>
              </td>

              <td class="px-3 py-3 text-center">
                <div class="flex flex-col items-center justify-center gap-1">
                  <span :class="loan.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'" class="text-[10px] font-black uppercase">
                    {{ loan.status }}
                  </span>
                  <button @click="openNoteModal(loan)" class="hover:scale-110 transition-transform" :class="loan.notes ? 'text-amber-400' : 'text-slate-600'">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                      <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </td>

              <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button v-if="loan.isLocked" @click="saveAndDeduct(loan)" :disabled="loan.status === 'Paid'" class="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all shadow-lg active:scale-90 disabled:opacity-20 disabled:grayscale" title="Confirm Deduction">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </button>

                  <button v-else @click="removeRow(i)" class="bg-rose-600/20 text-rose-500 p-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredRecords.length === 0" class="p-12 text-center">
            <p class="text-slate-500 text-sm font-bold italic uppercase tracking-widest">No matching records found</p>
        </div>
      </div>

      <div v-if="hasUnlocked" class="p-6 bg-slate-800/30 border-t border-slate-800 flex justify-end">
        <button @click="validateAndShowModal" class="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Confirm Records
        </button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        <h2 class="text-xl font-black text-white uppercase italic mb-2 tracking-widest">Finalize Record?</h2>
        <p class="text-slate-400 text-xs mb-8">Confirmed records will be saved to the database and <span class="text-rose-400">cannot be deleted</span>.</p>
        <div class="flex gap-4">
          <button @click="showModal = false" class="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase text-[10px]">Cancel</button>
          <button @click="confirmAll" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px]">Confirm</button>
        </div>
      </div>
    </div>

    <div v-if="noteModal.show" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div class="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] max-w-md w-full shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-3 bg-amber-500/10 rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-black text-white uppercase tracking-tight italic">Record Notes</h2>
            <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Borrower: {{ noteModal.activeLoan?.name || 'New Record' }}</p>
          </div>
        </div>

        <textarea
          v-model="noteModal.tempNote"
          placeholder="Type important notes here (e.g., 'Will pay on Friday', 'Promised extra interest')..."
          class="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-200 text-sm focus:outline-none focus:border-amber-500/50 transition-all resize-none mb-6"
        ></textarea>

        <div class="flex gap-3">
          <button @click="closeNoteModal" class="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold uppercase text-[10px]">Discard</button>
          <button @click="saveNote" class="flex-1 py-3 bg-amber-600 text-white rounded-xl font-black uppercase text-[10px] shadow-lg shadow-amber-600/20">Save Note</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../pages/components/AdminLayout.vue'
import { supabase } from '../supabaseClient.js'

const lendingRecords = ref([])
const showModal = ref(false)
const searchQuery = ref('')

// Note Modal State
const noteModal = ref({
  show: false,
  activeLoan: null,
  tempNote: ''
})

// --- SEARCH FILTER & SORTING LOGIC ---
const filteredRecords = computed(() => {
  let records = [...lendingRecords.value]

  // 1. Filter by Search Query
  if (searchQuery.value) {
    records = records.filter(record =>
      record.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 2. Sort by Status (Partial/Active first, then Pending/Paid)
  // Logic: Partial (0), Active (1), Pending (2), Paid (3)
  return records.sort((a, b) => {
    const priority = { 'Partial': 0, 'Active': 1, 'Pending': 2, 'Paid': 3 }
    return priority[a.status] - priority[b.status]
  })
})

const fetchRecords = async () => {
  const { data, error } = await supabase
    .from('lending_list')
    .select('*')
    .order('transaction_date', { ascending: false })

  if (error) {
    console.error("Fetch error:", error.message)
    return
  }

  lendingRecords.value = data.map(item => {
    const contractParts = item.contract ? item.contract.split(' ') : [0, 'months']
    return {
      id: item.id,
      datetime: `${item.transaction_date}T${item.transaction_time}`,
      name: item.name,
      amount: item.borrowed_money,
      durationValue: contractParts[0],
      durationUnit: contractParts[1],
      interest: item.interest,
      deductValue: 0,
      status: item.status,
      notes: item.notes || '', // Ensure notes are fetched
      isLocked: true,
      flash: false
    }
  })
}

onMounted(() => {
  fetchRecords()
})

const hasUnlocked = computed(() => lendingRecords.value.some(r => !r.isLocked))

const getCurrentLocalTime = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now - offset).toISOString().slice(0, 16)
}

const addLendingRow = () => {
  lendingRecords.value.unshift({
    id: null,
    datetime: getCurrentLocalTime(),
    name: '',
    amount: 0,
    durationValue: 0,
    durationUnit: 'months',
    interest: 0,
    deductValue: 0,
    status: 'Pending',
    notes: '',
    isLocked: false,
    flash: false
  })
}

// NOTE MODAL ACTIONS
const openNoteModal = (loan) => {
  noteModal.value.activeLoan = loan
  noteModal.value.tempNote = loan.notes || ''
  noteModal.value.show = true
}

const closeNoteModal = () => {
  noteModal.value.show = false
  noteModal.value.activeLoan = null
}

const saveNote = async () => {
  const loan = noteModal.value.activeLoan
  if (!loan) return

  loan.notes = noteModal.value.tempNote

  // If the record already exists in DB, update it immediately
  if (loan.id) {
    const { error } = await supabase
      .from('lending_list')
      .update({ notes: loan.notes })
      .eq('id', loan.id)

    if (error) console.error("Error saving note:", error.message)
  }

  closeNoteModal()
}

const calculateInterest = (loan) => {
  if (loan.isLocked) return
  const principal = Number(loan.amount) || 0
  const duration = Number(loan.durationValue) || 0
  loan.interest = parseFloat((principal * 0.08 * duration).toFixed(2))
}

const validateAndShowModal = () => {
  const invalid = lendingRecords.value.some(r => !r.isLocked && (!r.name || r.amount <= 0 || r.durationValue <= 0))
  if (invalid) {
    alert("Please provide Name, Amount, and Contract for new records.")
    return
  }
  showModal.value = true
}

const confirmAll = async () => {
  for (let r of lendingRecords.value) {
    if (!r.isLocked) {
      const originalInterest = Number(r.interest)
      const totalToBorrow = parseFloat((Number(r.amount) + originalInterest).toFixed(2))
      const [date, time] = r.datetime.split('T')

      const { data, error } = await supabase
        .from('lending_list')
        .insert([{
          transaction_date: date,
          transaction_time: time,
          name: r.name,
          borrowed_money: totalToBorrow,
          contract: `${r.durationValue} ${r.durationUnit}`,
          interest: originalInterest,
          deduct: 0,
          status: 'Active',
          notes: r.notes || ''
        }])
        .select()

      if (!error) {
        r.id = data[0].id
        r.amount = totalToBorrow
        r.status = 'Active'
        r.isLocked = true
      }
    }
  }
  showModal.value = false
}

const saveAndDeduct = async (loan) => {
  if (loan.status === 'Paid') return

  const toDeduct = Number(loan.deductValue) || 0

  if (toDeduct > 0) {
    const newAmount = Math.max(0, parseFloat((loan.amount - toDeduct).toFixed(2)))
    const newStatus = newAmount === 0 ? 'Paid' : 'Partial'

    const { error } = await supabase
      .from('lending_list')
      .update({
        borrowed_money: newAmount,
        deduct: toDeduct,
        status: newStatus
      })
      .eq('id', loan.id)

    if (!error) {
      loan.amount = newAmount
      loan.status = newStatus
      loan.deductValue = 0
      loan.flash = true
      setTimeout(() => { loan.flash = false }, 1000)
    }
  }
}

const removeRow = (i) => {
  lendingRecords.value.splice(i, 1)
}
</script>