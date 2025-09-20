<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center">
          <button 
            @click="$router.back()"
            class="mr-4 p-2 text-gray-600 hover:text-gray-800"
          >
            ← Back
          </button>
          <h1 class="text-3xl font-bold text-gray-800">Payment Details</h1>
        </div>
        <div class="flex space-x-3">
          <button 
            @click="editPayment"
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Edit Payment
          </button>
          <button 
            @click="confirmDelete"
            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete Payment
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p class="mt-2 text-gray-600">Loading payment details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>

      <!-- Payment Details -->
      <div v-else-if="payment" class="space-y-6">
        <!-- Status Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold text-gray-800 mb-2">Payment Status</h2>
              <span :class="getStatusClass(payment.status)" class="px-3 py-1 text-sm font-semibold rounded-full">
                {{ payment.status.toUpperCase() }}
              </span>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-500">Payment Amount</p>
              <p class="text-3xl font-bold text-gray-800">{{ payment.formattedAmount }}</p>
            </div>
          </div>
        </div>

        <!-- Main Details Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Payment Information -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Payment ID:</span>
                <span class="font-medium">{{ payment.id }}</span>
              </div> 
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Amount:</span>
                <span class="font-medium text-lg">{{ payment.formattedAmount }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Category:</span>
                <span class="font-medium capitalize">{{ payment.category }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Payment Method:</span>
                <span class="font-medium capitalize">{{ payment.method }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">Date:</span>
                <span class="font-medium">{{ payment.formattedDate }}</span>
              </div>
            </div>
          </div>

          <!-- User Information -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">User Information</h3>
            <div class="space-y-4">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">User Name:</span>
                <span class="font-medium">{{ payment.user || 'Unknown User' }}</span>
              </div>
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="text-gray-600">User ID:</span>
                <span class="font-medium">{{ payment.userId || 'N/A' }}</span>
              </div>
              <div v-if="userDetails" class="space-y-2">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Email:</span>
                  <span class="font-medium">{{ userDetails.email }}</span>
                </div>
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="text-gray-600">Phone:</span>
                  <span class="font-medium">{{ userDetails.phone || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Description</h3>
          <p class="text-gray-700">{{ payment.description || 'No description provided' }}</p>
        </div>

        
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
          <div class="mt-3 text-center">
            <h3 class="text-lg font-medium text-gray-900">Delete Payment</h3>
            <div class="mt-2 px-7 py-3">
              <p class="text-sm text-gray-500">
                Are you sure you want to delete this payment? This action cannot be undone.
              </p>
            </div>
            <div class="items-center px-4 py-3">
              <button
                @click="deletePayment"
                class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete
              </button>
              <button
                @click="showDeleteModal = false"
                class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-24 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchPaymentById, updatePayment, deletePayment as deletePaymentService } from '@/services/PaymentService';
import { fetchUserByName } from '@/services/UserService';
import { Payment } from '@/models/Payment';
import { User } from '@/models/User';

export default {
  name: 'PaymentDetail',
  props: {
    paymentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      payment: null,
      userDetails: null,
      loading: true,
      error: null,
      showDeleteModal: false
    };
  },
  async mounted() {
    await this.loadPayment();
    sessionStorage.setItem('currentView', 'payment-detail');
  },
  methods: {
    async loadPayment() {
      try {
        this.loading = true;
        this.error = null;
        
        const paymentId = this.paymentId || this.$route.params.id;
        const paymentData = await fetchPaymentById(paymentId);
        this.payment = Payment.fromJson(paymentData);

        // Load user details if userId is available
        if (this.payment.userId) {
          try {
            const userData = await fetchUserByName(this.payment.userId);
            this.userDetails = User.fromJson(userData);
            console.log('User Details:', this.userDetails);
          } catch (userError) {
            console.warn('Could not load user details:', userError);
          }
        }

      } catch (error) {
        console.error('Error loading payment:', error);
        this.error = 'Failed to load payment details. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    async updateStatus(newStatus) {
      try {
        const updatedPayment = {
          ...this.payment.toJson(),
          status: newStatus
        };
        
        await updatePayment(this.payment.id, updatedPayment);
        this.payment.status = newStatus;
        
        this.$emit('payment-updated', this.payment);
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
    },
    editPayment() {
      this.$router.push(`/payments/${this.payment.id}/edit`);
    },
    confirmDelete() {
      this.showDeleteModal = true;
    },
    async deletePayment() {
      try {
        await deletePaymentService(this.payment.id);
        this.showDeleteModal = false;
        this.$emit('payment-deleted', this.payment);
        this.$router.push('/payments');
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    }, 
    
    getStatusClass(status) {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    }
  }
};
</script>
