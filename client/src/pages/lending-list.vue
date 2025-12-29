<template>
  <AdminLayout>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight italic uppercase text-amber-500">Lending List</h1>
        <p class="text-slate-500 text-sm">Update deductions and track balances</p>
      </div>

      <button @click="addLendingRow" class="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95">
        Add New Record
      </button>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/50 border-b border-slate-800 text-slate-400">
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest">Date & Time</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest">Name</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-amber-400">Borrowed Money</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-indigo-400">Contract Duration</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-emerald-400">Interest</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-orange-400">Deduct</th>
              <th class="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
              <th class="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="(loan, i) in lendingRecords" :key="i" class="hover:bg-slate-800/20">

              <td class="px-3 py-3">
                <input type="datetime-local" v-model="loan.datetime" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-[10px] text-white w-full disabled:opacity-80" />
              </td>

              <td class="px-3 py-3">
                <input type="text" v-model="loan.name" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white w-full disabled:opacity-50 font-bold" />
              </td>

              <td class="px-3 py-3">
                <div class="flex items-center bg-slate-950 border border-slate-800 rounded-lg px-2 py-2" :class="{'border-emerald-500/50': loan.flash}">
                  <span class="text-slate-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="loan.amount" :disabled="loan.isLocked" class="bg-transparent text-xs text-white w-full outline-none disabled:text-amber-400" />
                </div>
              </td>

              <td class="px-3 py-3">
                <div class="flex gap-1">
                  <input type="number" v-model="loan.durationValue" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-2 py-2 text-xs text-indigo-300 w-16 disabled:opacity-50" />
                  <select v-model="loan.durationUnit" :disabled="loan.isLocked" class="bg-slate-950 border border-slate-800 rounded-lg px-1 py-2 text-[10px] text-indigo-400 outline-none w-full disabled:opacity-50">
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
                  <input type="number" v-model="loan.interest" :disabled="loan.isLocked" class="bg-transparent text-xs text-emerald-400 font-bold w-full outline-none text-center disabled:opacity-50" />
                </div>
              </td>

              <td class="px-3 py-3">
                <div class="flex items-center bg-slate-950 border border-orange-500/30 rounded-lg px-2 py-2 focus-within:border-orange-500">
                  <span class="text-orange-600 text-[10px] mr-1">₱</span>
                  <input type="number" v-model="loan.deductValue" class="bg-transparent text-xs text-orange-200 w-full outline-none font-bold" placeholder="0" />
                </div>
              </td>

              <td class="px-3 py-3 text-center">
                <select v-model="loan.status" class="bg-slate-950 border border-slate-800 text-[9px] font-black uppercase rounded-lg px-2 py-2 outline-none" :class="loan.status === 'Paid' ? 'text-emerald-500' : 'text-amber-500'">
                  <option value="Pending">Pending</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                </select>
              </td>

              <td class="px-3 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="saveAndDeduct(i)" class="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl transition-all shadow-lg active:scale-90" title="Update & Deduct">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                  </button>

                  <button v-if="!loan.isLocked" @click="removeRow(i)" class="bg-rose-600/20 text-rose-500 p-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="hasUnlocked" class="p-6 bg-slate-800/30 border-t border-slate-800 flex justify-end">
        <button @click="showModal = true" class="bg-amber-600 hover:bg-amber-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">
          Confirm Records
        </button>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
      <div class="bg-slate-900 border border-slate-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl">
        <h2 class="text-xl font-black text-white uppercase italic mb-4">Lock Records?</h2>
        <p class="text-slate-400 text-sm mb-8">This will add the Interest to the Borrowed Money and lock the core details. Deductions will remain open.</p>
        <div class="flex gap-4">
          <button @click="showModal = false" class="flex-1 py-3 bg-slate-800 text-slate-300 rounded-xl font-bold uppercase text-xs">Cancel</button>
          <button @click="confirmAll" class="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs shadow-lg">Confirm</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import AdminLayout from '../pages/components/AdminLayout.vue'

const lendingRecords = ref([])
const showModal = ref(false)

const hasUnlocked = computed(() => lendingRecords.value.some(r => !r.isLocked))

// Helper to get current local time in YYYY-MM-DDThh:mm format
const getCurrentLocalTime = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now - offset).toISOString().slice(0, 16)
}

const addLendingRow = () => {
  lendingRecords.value.push({
    datetime: getCurrentLocalTime(),
    name: '',
    amount: 0,
    durationValue: 0,
    durationUnit: 'months',
    interest: 0,
    deductValue: 0,
    status: 'Pending',
    isLocked: false,
    flash: false
  })
}

const saveAndDeduct = (index) => {
  const r = lendingRecords.value[index]
  const toDeduct = Number(r.deductValue) || 0

  if (toDeduct > 0) {
    // 1. Math: Subtract from Borrowed Money
    r.amount = Math.max(0, r.amount - toDeduct)
    r.deductValue = 0 // Reset deduct field

    // 2. NEW: Update the date and time to current moment of deduction
    r.datetime = getCurrentLocalTime()

    // 3. Auto-update status
    if (r.amount === 0) r.status = 'Paid'
    else r.status = 'Partial'

    // Visual feedback
    r.flash = true
    setTimeout(() => { r.flash = false }, 1000)

    alert('Deduction confirmed! Date updated.')
  } else {
    alert('Please enter a deduction amount.')
  }
}

const confirmAll = () => {
  lendingRecords.value.forEach(r => {
    if (!r.isLocked) {
      // NEW: Add Interest to Borrowed Money upon confirmation
      r.amount = Number(r.amount) + Number(r.interest) // Set interest to 0 as it's now integrated into the principal
      r.isLocked = true
    }
  })
  showModal.value = false
}

const removeRow = (i) => lendingRecords.value.splice(i, 1)
</script>