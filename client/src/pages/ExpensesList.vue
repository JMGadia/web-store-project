<template>
  <UserLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-black text-white uppercase italic tracking-tighter text-violet-500">Expenses List</h1>
      <p class="text-slate-500 text-sm font-bold uppercase tracking-widest">Track your daily expenditures</p>
    </div>

    <div class="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      <div class="p-20 text-center">
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">No expense records found.</p>
      </div>
    </div>
  </UserLayout>
</template>

<script setup>
import UserLayout from './components/UserLayout.vue'
</script>