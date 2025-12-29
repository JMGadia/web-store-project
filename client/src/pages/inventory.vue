<template>
  <AdminLayout>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="text-3xl font-black text-white tracking-tight text-violet-500 italic uppercase">Inventory Management</h1>
        <p class="text-slate-500 text-sm">Filter items by Category or Month</p>
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
                <input v-if="item.isEditing" type="number" v-model="item.tempQty" class="w-20 bg-slate-950 border border-violet-500 rounded px-2 py-1 text-white focus:outline-none" />
                <span v-else>{{ item.quantity }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-[10px] font-black px-2 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-tighter border border-slate-700">
                  {{ item.type || 'N/A' }}
                </span>
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
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  <span class="text-[10px] font-black uppercase italic tracking-tighter">Edit Qty</span>
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
const monthFilter = ref('All') // NEW MONTH FILTER STATE

const fetchInventory = async () => {
  try {
    const { data, error } = await supabase.from('inventory').select('*').order('date', { ascending: false })
    if (error) throw error
    inventoryItems.value = data.map(item => ({ ...item, isEditing: false, tempQty: item.quantity }))
  } catch (err) {
    console.error('Error fetching inventory:', err.message)
  } finally {
    loading.value = false
  }
}

// Subscribe to changes
let inventoryChannel = null
onMounted(() => {
  fetchInventory()
  inventoryChannel = supabase.channel('inventory-realtime')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory' }, () => { fetchInventory() })
    .subscribe()
})
onUnmounted(() => { if (inventoryChannel) supabase.removeChannel(inventoryChannel) })

// UNIQUE MONTHS GENERATOR
const uniqueMonths = computed(() => {
  const months = inventoryItems.value.map(item => {
    const d = new Date(item.date)
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  })
  return [...new Set(months)].sort((a, b) => new Date(b) - new Date(a)) // Sort newest first
})

const uniqueCategories = computed(() => {
  const cats = inventoryItems.value.map(i => i.category)
  return [...new Set(cats)]
})

// SEARCH AND MULTI-FILTER LOGIC
const filteredItems = computed(() => {
  return inventoryItems.value.filter(item => {
    // Month Matching
    const itemDate = new Date(item.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    const matchesMonth = monthFilter.value === 'All' || itemDate === monthFilter.value

    // Category Matching
    const matchesCategory = categoryFilter.value === 'All' || item.category === categoryFilter.value

    // Search Matching
    const matchesSearch = item.description.toLowerCase().includes(searchQuery.value.toLowerCase())

    return matchesMonth && matchesCategory && matchesSearch
  })
})

const startEdit = (item) => {
  item.tempQty = item.quantity
  item.isEditing = true
}

const saveEdit = async (item) => {
  const updatedQty = item.tempQty === '' || item.tempQty === null ? 0 : Number(item.tempQty)
  let newStatus = updatedQty <= 0 ? 'Out of Stock' : (updatedQty <= 20 ? 'Low Stock' : 'In Stock')

  try {
    const { error } = await supabase.from('inventory').update({ quantity: updatedQty, status: newStatus }).eq('id', item.id)
    if (error) throw error
    item.quantity = updatedQty
    item.status = newStatus
    item.isEditing = false
  } catch (err) {
    alert('Error updating quantity')
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