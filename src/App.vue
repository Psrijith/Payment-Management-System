<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Mobile menu button -->
    <div class="lg:hidden">
      <div class="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-white p-4 flex justify-between items-center">
        <h2 class="text-xl font-bold">Payment</h2>
        <button @click="sidebarOpen = !sidebarOpen" class="p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed h-full w-64 bg-gray-800 text-white p-4 z-40 transition-transform duration-300 ease-in-out',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      class="lg:translate-x-0"
    >
      <div class="mb-6 pt-16 lg:pt-0">
        <h2 class="text-xl font-bold">Payment</h2>
        <p class="text-sm text-gray-300">Management System</p>
      </div>
      <nav class="space-y-2">
        <router-link
          to="/"
          @click="sidebarOpen = false"
          class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
          :class="{ 'bg-blue-600': $route.path === '/' }"
        > 
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
          </svg>
          Dashboard
        </router-link>

        
        <router-link
          to="/payments"
          @click="sidebarOpen = false"
          class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
          :class="{ 'bg-blue-600': $route.path.startsWith('/payments') }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
          </svg>
          Payments
        </router-link>
        
        <router-link
          to="/users"
          @click="sidebarOpen = false"
          class="flex items-center p-3 rounded-md hover:bg-gray-700 transition-colors"
          :class="{ 'bg-blue-600': $route.path.startsWith('/users') }"
        >
          <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 
              2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 
              0c-.29 0-.62.02-.97.05 1.16.84 1.97 2 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Users
        </router-link>
        

        <!-- Divider -->
        <div class="border-t border-gray-600 my-4"></div>

         
        <!-- Bottom section -->
        <div class="absolute bottom-4 left-4 right-4">
          <div class="border-t border-gray-600 pt-4">
            <div class="flex items-center">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-sm font-semibold">PS</span>
              </div>
              <div class="ml-3">
                <span>{{ userStore.loggedInName }}</span>
                <span class="text-xs text-gray-400">{{ userStore.loggedInRole }}</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>

    <!-- Overlay for mobile -->
    <div 
      v-if="sidebarOpen" 
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
    ></div>

    <!-- Main Content -->
    <main class="lg:ml-64 pt-16 lg:pt-0">
      <!-- Top Bar -->
      <div class="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-semibold text-gray-800">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center space-x-4">

            <div class="relative">
              <button class="p-2 text-gray-600 hover:text-gray-800 flex items-center space-x-2">
                <div class="flex items-center">
                  <span>{{ userStore.loggedInName }}</span>
                  <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center ml-2">
                    <span class="text-white text-sm font-semibold">{{ userStore.loggedInName.charAt(0) }}</span>
                  </div>
                </div>
              </button>
            </div>

             
          </div>
        </div>
      </div>

      <!-- Router View with padding -->
      <div class="p-4 lg:p-6">
        <router-view @user-created="onUserCreated" @user-updated="onUserUpdated" @user-deleted="onUserDeleted" @payment-created="onPaymentCreated" @payment-updated="onPaymentUpdated" @payment-deleted="onPaymentDeleted" />
      </div>
    </main>
  </div>
</template>

<script>
import { useUserStore } from './store/index.js';
export default {
  name: 'App',
  data() {
    return {
      sidebarOpen: false,
      currentTime: '',
      notificationCount: 3
    };
  },
  setup() {
    const userStore = useUserStore();
    return { userStore };
  },
  computed: {
    pageTitle() {
      const routeMap = {
        '/': 'Dashboard',
        '/users': 'User Management',
        '/users/new': 'Create User',
        '/payments': 'Payment Management',
        '/payments/new': 'Create Payment'
      };
      
      // Handle dynamic routes
      if (this.$route.path.includes('/users/') && this.$route.path.includes('/edit')) {
        return 'Edit User';
      }
      if (this.$route.path.includes('/payments/') && this.$route.path.includes('/edit')) {
        return 'Edit Payment';
      }
      if (this.$route.path.includes('/payments/') && !this.$route.path.includes('/new') && !this.$route.path.includes('/edit')) {
        return 'Payment Details';
      }
      
      return routeMap[this.$route.path] || 'Payment Management';
    },
    breadcrumbs() {
      const path = this.$route.path;
      const segments = path.split('/').filter(Boolean);
      const crumbs = [];
      
      if (segments.length > 0) {
        if (segments[0] === 'users') {
          crumbs.push({ name: 'Users', path: '/users' });
          if (segments[1] === 'new') {
            crumbs.push({ name: 'Create User' });
          } else if (segments[2] === 'edit') {
            crumbs.push({ name: 'Edit User' });
          }
        } else if (segments[0] === 'payments') {
          crumbs.push({ name: 'Payments', path: '/payments' });
          if (segments[1] === 'new') {
            crumbs.push({ name: 'Create Payment' });
          } else if (segments[2] === 'edit') {
            crumbs.push({ name: 'Edit Payment' });
          } else if (segments[1] && segments[1] !== 'new') {
            crumbs.push({ name: 'Payment Details' });
          }
        }
      }
      
      return crumbs;
    }
  },
  mounted() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      this.currentTime = new Date().toLocaleTimeString();
    },
    onUserCreated(user) { 
      console.log('User created:', user);
    },
    onUserUpdated(user) {
      console.log('User updated:', user);
    },
    onUserDeleted(user) {
      console.log('User deleted:', user);
    },
    onPaymentCreated(payment) { 
      console.log('Payment created:', payment);
    },
    onPaymentUpdated(payment) {
      console.log('Payment updated:', payment);
    },
    onPaymentDeleted(payment) {
      console.log('Payment deleted:', payment);
    }
  }
};
</script>