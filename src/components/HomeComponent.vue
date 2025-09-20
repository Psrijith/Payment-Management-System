<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Payment Management Dashboard</h1>
      <p class="text-gray-600">Manage your payment flows with complete traceability and reporting</p>
    </div>

    <!-- Dashboard Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">$</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total Revenue</p>
            <p class="text-2xl font-bold text-gray-900">${{ totalRevenue }}</p>
            <p class="text-xs text-green-500">+12.5% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">#</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Total Payments</p>
            <p class="text-2xl font-bold text-gray-900">{{ totalPayments }}</p>
            <p class="text-xs text-blue-500">+8.1% from last month</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">👥</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Active Users</p>
            <p class="text-2xl font-bold text-gray-900">{{ activeUsers }}</p>
            <p class="text-xs text-purple-500">{{ activeUsers }}/{{ totalUsers }} users active</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-bold">%</span>
            </div>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Success Rate</p>
            <p class="text-2xl font-bold text-gray-900">{{ successRate }}%</p>
            <p class="text-xs text-orange-500">Payment completion rate</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
<div class="bg-white rounded-lg shadow-md p-6 col-span-4 flex flex-col md:flex-row items-center justify-center h-86 hidden md:flex">

        <!-- Pie Chart with conic-gradient -->
        <div class="w-full md:w-1/2 flex flex-col items-center">
          <div class="w-40 h-40 rounded-full"
               style="background: conic-gradient(
                 #4CAF50 0% 45%, 
                 #2196F3 45% 70%, 
                 #9C27B0 70% 90%, 
                 #FF9800 90% 100%
               )">
          </div>
          <p class="text-sm text-gray-500 mt-2">Payments by Type</p>
        </div>

        <!-- Simple Bar Chart -->
        <div class="w-full md:w-1/2 flex flex-col items-center">
          <div class="flex items-end space-x-2 h-40 w-full max-w-md">
            <div class="bg-blue-500" style="height: 30%; width: 20%;"></div>
            <div class="bg-blue-600" style="height: 50%; width: 20%;"></div>
            <div class="bg-blue-700" style="height: 80%; width: 20%;"></div>
            <div class="bg-blue-400" style="height: 70%; width: 20%;"></div>
            <div class="bg-blue-500" style="height: 90%; width: 20%;"></div>
          </div>
          <p class="text-sm text-gray-500 mt-2">Monthly Revenue</p>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import { fetchPayments } from '../services/PaymentService';
import { fetchUsers } from '../services/UserService';
export default {
  name: 'Dashboard',
  data() {
    return {
      totalRevenue: 123.45,
      totalPayments: 0,
      activeUsers: 0,
      totalUsers: 0,
      successRate: 87,
    };
  },
  mounted() {
    this.getPaymentsCount();
    this.getActiveUsersCount();
  },
  methods: {
     getPaymentsCount(){
        fetchPayments().then(payments => {
          this.totalPayments = payments.length;
        });
     },
     getActiveUsersCount(){
        fetchUsers().then(users => {
          this.totalUsers = users.length;
          this.activeUsers = users.filter(user => user.status === 'active').length;
        });
     }
  },
};
</script>

<style> 
</style>
