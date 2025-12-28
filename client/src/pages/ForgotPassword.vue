<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4">
    <div class="sm:mx-auto w-full max-w-md bg-white py-10 px-8 shadow-2xl rounded-3xl">
      <h2 class="text-3xl font-black text-gray-900 mb-4">Reset Password</h2>
      <p class="text-gray-500 mb-6 text-sm">Enter your email and we'll send you a reset link.</p>

      <form @submit.prevent="handleResetRequest" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
          <input v-model="email" type="email" required placeholder="yourname@gmail.com"
            class="block w-full px-4 py-3.5 rounded-2xl border border-gray-200 focus:ring-4 focus:ring-indigo-500/10 outline-none" />
        </div>
        <button type="submit" :disabled="loading"
          class="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <p v-if="message" :class="`mt-4 text-center text-sm font-bold ${isError ? 'text-red-600' : 'text-green-600'}`">
        {{ message }}
      </p>

      <div class="mt-6 text-center">
        <router-link to="/login" class="text-indigo-600 text-sm font-bold">Back to Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 1. Import your existing client from your dedicated file
// This ensures VITE_ variables are handled in one place
import { supabase } from '../supabaseClient'

const email = ref('')
const loading = ref(false)
const message = ref('')
const isError = ref(false)

const handleResetRequest = async () => {
  loading.value = true
  message.value = ''
  isError.value = false

  try {
    // 2. Check if email exists in your 'accounts' table
    const { data: userExists, error: dbError } = await supabase
      .from('accounts')
      .select('email')
      .eq('email', email.value)
      .maybeSingle()

    if (dbError) throw dbError

    if (!userExists) {
      isError.value = true
      message.value = "This email is not registered."
      loading.value = false
      return
    }

    // 4. Send Reset Link via Supabase Auth
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: 'https://web-store-project-vdfv.onrender.com/reset-password',
    })

    if (authError) throw authError

    message.value = "Reset link sent! Please check your Gmail."

  } catch (err) {
    isError.value = true
    message.value = err.message
  } finally {
    loading.value = false
  }
}
</script>