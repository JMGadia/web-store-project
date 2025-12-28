import { createRouter, createWebHistory } from 'vue-router';
import LogIn from './pages/LogIn.vue';
import SignUp from './pages/SignUp.vue';
import ForgotPassword from './pages/ForgotPassword.vue';
import ResetPassword from './pages/ResetPassword.vue';
import AdminDashboard from './pages/AdminDashboard.vue';
import UserHome from './pages/UserHome.vue';
import Inventory from './pages/inventory.vue';
import StockIn from './pages/stock-in.vue';
import StockOut from './pages/stock-out.vue';
import GcashATM from './pages/gcash-atm.vue';
import LendingList from './pages/lending-list.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LogIn },
  { path: '/signup', component: SignUp },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/admin-dashboard', component: AdminDashboard },
  { path: '/user-home', component: UserHome },
  { path: '/inventory', component: Inventory },
  { path: '/stock-in', component: StockIn },
  { path: '/stock-out', component: StockOut },
  { path: '/gcash-atm', component: GcashATM },
  { path: '/lending-list', component: LendingList }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const session = localStorage.getItem('userSession');
  const userData = session ? JSON.parse(session) : null;

  // 1. PUBLIC PATHS
  // These routes can be accessed by ANYONE (even without a session).
  // This is crucial for the password reset link to work.
  const publicPaths = ['/login', '/signup', '/forgot-password', '/reset-password'];

  // 2. PREVENT LOGGED-IN USERS FROM GOING TO LOGIN/SIGNUP/FORGOT/RESET
  // If they are already logged in, send them to their respective home.
  if (publicPaths.includes(to.path) && userData) {
    if (userData.role === 'admin') return next('/admin-dashboard');
    return next('/user-home');
  }

  // If it's a public path and they aren't logged in, let them through!
  if (publicPaths.includes(to.path)) {
    return next();
  }

  // 3. PROTECTION LOGIC (URLs for Logged-in Users)
  const adminPaths = ['/admin-dashboard', '/inventory', '/stock-in', '/stock-out', '/gcash-atm', '/lending-list'];

  if (adminPaths.includes(to.path)) {
    if (!userData) {
      alert("Please login first.");
      return next('/login');
    }
    if (userData.role !== 'admin') {
      alert("Access Denied: Admins only.");
      return next('/user-home');
    }
  }

  if (to.path === '/user-home' && !userData) {
    alert("Please login first.");
    return next('/login');
  }

  next();
});

export default router;