<template>
  <AdminLayout>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight text-violet-500 italic uppercase">Inventory Management</h1>
        <p class="text-slate-500 text-sm">Input sold units in the Deduct field to update stock</p>
      </div>

      <div class="relative group w-full md:w-96">
        <span class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input v-model="searchQuery" type="text" placeholder="Search items..." class="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all shadow-xl" />
      </div>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
      <div v-if="loading" class="p-20 flex justify-center items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-800/50 border-b border-slate-800">
              <th class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Date</span>
                  <select v-model="monthFilter" class="bg-slate-800 text-violet-400 text-[9px] font-black px-2 py-1 rounded border border-slate-700 focus:border-violet-500 outline-none uppercase cursor-pointer">
                    <option value="All">All Months</option>
                    <option v-for="month in uniqueMonths" :key="month" :value="month">{{ month }}</option>
                  </select>
                </div>
              </th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Description</th>
              <th class="px-6 py-4">
                <div class="flex items-center space-x-2">
                  <span class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Category</span>
                  <select v-model="categoryFilter" class="bg-slate-800 text-violet-400 text-[9px] font-black px-2 py-1 rounded border border-slate-700 focus:border-violet-500 outline-none uppercase cursor-pointer">
                    <option value="All">All</option>
                    <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
              </th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quantity</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>

              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">Deduct</th>

              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SRP</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Price</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
              <th class="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-slate-800/30 transition-colors group">
              <td class="px-6 py-4 text-xs text-slate-500 font-bold uppercase">{{ formatDate(item.date) }}</td>
              <td class="px-6 py-4 text-sm font-bold text-white">{{ item.description }}</td>
              <td class="px-6 py-4 text-xs font-bold text-slate-300 uppercase tracking-wide">{{ item.category }}</td>

              <td class="px-6 py-4 text-sm font-black text-slate-200">
                {{ item.quantity }}
              </td>

              <td class="px-6 py-4">
                <span class="text-[10px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-tighter border border-slate-700">
                  {{ item.type || 'N/A' }}
                </span>
              </td>

              <td class="px-6 py-4 text-sm font-black text-orange-400">
                <input
                  v-if="item.isEditing"
                  type="number"
                  v-model="item.tempDeduct"
                  placeholder="0"
                  class="w-20 bg-slate-950 border border-orange-500/50 rounded px-2 py-1 text-white focus:outline-none focus:ring-1 focus:ring-orange-500"
                />
                <span v-else class="text-slate-600 opacity-40">—</span>
              </td>

              <td class="px-6 py-4 text-sm font-bold text-slate-400">₱{{ Number(item.srp).toFixed(2) }}</td>
              <td class="px-6 py-4 text-sm font-black text-white">₱{{ Number(item.price).toFixed(2) }}</td>

              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border" :class="statusClasses(item.status)">
                  <span class="w-1.5 h-1.5 rounded-full mr-2" :class="statusBullet(item.status)"></span>
                  {{ item.status }}
                </span>
              </td>

              <td class="px-6 py-4 text-center">
                <div v-if="!item.isEditing" @click="startEdit(item)" class="inline-flex items-center text-violet-400 hover:text-violet-300 cursor-pointer transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                  <span class="text-[10px] font-black uppercase italic tracking-tighter">Enter Sales</span>
                </div>
                <div v-else class="flex items-center justify-center space-x-2">
                  <button @click="saveEdit(item)" class="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg></button>
                  <button @click="item.isEditing = false" class="bg-slate-700 hover:bg-slate-600 text-slate-300 p-1.5 rounded-lg transition-all"><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '../supabaseClient.js'
import AdminLayout from '../pages/components/AdminLayout.vue'

const loading = ref(true)
const inventoryItems = ref([])
const searchQuery = ref('')
const categoryFilter = ref('All')
const monthFilter = ref('All')

const fetchInventory = async () => {
  try {
    const { data, error } = await supabase.from('inventory').select('*').order('date', { ascending: false })
    if (error) throw error
    // Initializing tempDeduct to 0 for the input field
    inventoryItems.value = data.map(item => ({ ...item, isEditing: false, tempDeduct: 0 }))
  } catch (err) {
    console.error('Error fetching inventory:', err.message)
  } finally {
    loading.value = false
  }
}

let inventoryChannel = null
onMounted(() => {
  fetchInventory()
  inventoryChannel = supabase.channel('inventory-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => { fetchInventory() })
    .subscribe()
})

onUnmounted(() => { if (inventoryChannel) supabase.removeChannel(inventoryChannel) })

const uniqueMonths = computed(() => {
  const months = inventoryItems.value.map(item => {
    const d = new Date(item.date)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })
  return [...new Set(months)].sort((a, b) => new Date(b) - new Date(a))
})

const uniqueCategories = computed(() => {
  const cats = inventoryItems.value.map(i => i.category)
  return [...new Set(cats)]
})

const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    const itemDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const matchesMonth = monthFilter.value === 'All' || itemDate === monthFilter.value
    const matchesCategory = categoryFilter.value === 'All' || item.category === categoryFilter.value
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesMonth && matchesCategory && matchesSearch
  })
})

const startEdit = (item) => {
  item.tempDeduct = 0 // Clear field for fresh input
  item.isEditing = true
}

const saveEdit = async (item) => {
  const deductVal = Number(item.tempDeduct) || 0

  if (deductVal <= 0) {
    item.isEditing = false
    return
  }

  // 1. Accumulate the total deducted units for sales calculations
  const totalDeducted = (item.deduct || 0) + deductVal
  // 2. Subtract from current quantity
  const newQuantity = Math.max(0, (item.quantity || 0) - deductVal)

  let newStatus = newQuantity <= 0 ? 'Out of Stock' : (newQuantity <= 20 ? 'Low Stock' : 'In Stock')

  try {
    const { error } = await supabase.from('inventory').update({
      quantity: newQuantity,
      deduct: totalDeducted, // Total sales volume
      status: newStatus
    }).eq('id', item.id)

    if (error) throw error

    // Update Local State
    item.quantity = newQuantity
    item.deduct = totalDeducted
    item.tempDeduct = 0 // Input disappears/resets
    item.status = newStatus
    item.isEditing = false
  } catch (err) {
    alert('Error updating stock')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const statusClasses = (s) => {
  if (s === 'In Stock') return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5'
  if (s === 'Low Stock') return 'text-amber-500 border-amber-500/20 bg-amber-500/5'
  return 'text-rose-500 border-rose-500/20 bg-rose-500/5'
}

const statusBullet = (s) => {
  if (s === 'In Stock') return 'bg-emerald-500'
  if (s === 'Low Stock') return 'bg-amber-500'
  return 'bg-rose-500'
}
</script>