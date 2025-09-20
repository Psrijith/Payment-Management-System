<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center mb-6">
        <button 
          @click="$router.back()"
          class="mr-4 p-2 text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 class="text-3xl font-bold text-gray-800">
          {{ isEditing ? 'Edit Payment' : 'Create New Payment' }}
        </h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="submitForm">
          <div class="space-y-6">
            <!-- User Selection -->
            <div>
              <label for="userId" class="block text-sm font-medium text-gray-700 mb-2">
                Select User <span class="text-red-600">*</span>
              </label>
              <select
                id="userId"
                v-model="form.userId"
                @change="onUserChange"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select a user...</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.name }} ({{ user.email }})
                </option>
              </select>
              <p v-if="errors.userId" class="mt-1 text-sm text-red-600">{{ errors.userId }}</p>
            </div>

            <!-- Amount -->
            <div>
              <label for="amount" class="block text-sm font-medium text-gray-700 mb-2">
                Amount <span class="text-red-600">*</span>
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  id="amount"
                  v-model.number="form.amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                >
              </div>
              <p v-if="errors.amount" class="mt-1 text-sm text-red-600">{{ errors.amount }}</p>
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                v-model="form.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter payment description..."
              ></textarea>
              <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description }}</p>
            </div>


            <!-- Payment Method -->
            <div>
              <label for="method" class="block text-sm font-medium text-gray-700 mb-2">
                Payment Method <span class="text-red-600">*</span>
              </label>
              <select
                id="method"
                v-model="form.method"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="card">Credit/Debit Card</option>
                <option value="bank">NetBanking</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
              <p v-if="errors.method" class="mt-1 text-sm text-red-600">{{ errors.method }}</p>
            </div>

            <!-- Status -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status <span class="text-red-600">*</span>
              </label>
              <select
                id="status"
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
            </div>

        

            <!-- Date -->
            <div>
              <label for="date" class="block text-sm font-medium text-gray-700 mb-2">
                Payment Date <span class="text-red-600">*</span>
              </label>
              <input
                id="date"
                v-model="form.dateString"
                type="datetime-local"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
              <p v-if="errors.date" class="mt-1 text-sm text-red-600">{{ errors.date }}</p>
            </div>

            <!-- Submit Buttons -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                @click="$router.back()"
                class="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading"
                class="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
                <span v-else>
                  {{ isEditing ? 'Update Payment' : 'Create Payment' }}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        Payment {{ isEditing ? 'updated' : 'created' }} successfully!
      </div>

      <!-- Error Message -->
      <div v-if="showError" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>
 
    </div>
  </div>
</template>

<script>
import { fetchPaymentById, createPayment, updatePayment } from '@/services/PaymentService';
import { fetchUsers } from '@/services/UserService';
import { Payment } from '@/models/Payment';
import { User } from '@/models/User';

export default {
  name: 'PaymentForm',
  props: {
    paymentId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        userId: '',
        user: '',
        amount: 0,
        description: '',
        category: 'general',
        method: 'card',
        status: 'pending',
        transactionId: '',
        dateString: ''
      },
      users: [],
      errors: {},
      loading: false,
      showSuccess: false,
      showError: false,
      errorMessage: ''
    };
  },
  computed: {
    isEditing() {
      return !!this.paymentId || !!this.$route.params.id;
    },
    selectedUserName() {
      const user = this.users.find(u => u.id === this.form.userId);
      return user ? user.name : '';
    }
  },
  async mounted() {
    await this.loadUsers(); 
    
    // Set default date to now
    if (!this.form.dateString) {
      this.form.dateString = this.formatDateForInput(new Date());
    }
    
    sessionStorage.setItem('currentForm', 'payment');
  },
  methods: {
    async loadUsers() {
      try {
        const userData = await fetchUsers();
        this.users = userData.map(user => User.fromJson(user));
      } catch (error) {
        console.error('Error loading users:', error);
      }
    },
    async loadPayment() {
      try {
        this.loading = true;
        const paymentId = this.paymentId || this.$route.params.id;
        const paymentData = await fetchPaymentById(paymentId);
        const payment = Payment.fromJson(paymentData);
        
        this.populateForm(payment.toJson());
      } catch (error) {
        console.error('Error loading payment:', error);
        this.showError = true;
        this.errorMessage = 'Failed to load payment data';
      } finally {
        this.loading = false;
      }
    }, 
    onUserChange() {
      const selectedUser = this.users.find(user => user.id === this.form.userId);
      if (selectedUser) {
        this.form.user = selectedUser.name;
      }
    },
    validateForm() {
      this.errors = {};
      
      if (!this.form.userId) {
        this.errors.userId = 'Please select a user';
      }
      
      if (!this.form.amount || this.form.amount <= 0) {
        this.errors.amount = 'Amount must be greater than 0';
      }
      
      if (!this.form.category) {
        this.errors.category = 'Please select a category';
      }
      
      if (!this.form.method) {
        this.errors.method = 'Please select a payment method';
      }
      
      if (!this.form.status) {
        this.errors.status = 'Please select a status';
      }
      
      if (!this.form.dateString) {
        this.errors.date = 'Please select a date';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.loading = true;
        this.showError = false;
        this.showSuccess = false;

        const paymentData = {
          userId: this.form.userId,
          user: this.form.user,
          amount: parseFloat(this.form.amount),
          description: this.form.description,
          category: this.form.category,
          method: this.form.method,
          status: this.form.status, 
          date: new Date(this.form.dateString).getTime()
        };

        if (this.isEditing) {
          const paymentId = this.paymentId || this.$route.params.id;
          await updatePayment(paymentId, paymentData);
          this.$emit('payment-updated', paymentData);
        } else {
          const newPayment = await createPayment(paymentData);
          this.$emit('payment-created', newPayment);
        }

        this.showSuccess = true;
        
        // Redirect after success
        setTimeout(() => {
          this.$router.push('/payments');
        }, 1500);

      } catch (error) {
        console.error('Error saving payment:', error);
        this.showError = true;
        this.errorMessage = 'Failed to save payment. Please try again.';
      } finally {
        this.loading = false;
      }
    }, 
    formatDateForInput(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },
    resetForm() {
      this.form = {
        userId: '',
        user: '',
        amount: 0,
        description: '',
        category: 'general',
        method: 'card',
        status: 'pending',
        transactionId: '',
        dateString: this.formatDateForInput(new Date())
      };
      this.errors = {};
      this.showSuccess = false;
      this.showError = false;
    }
  }
};
</script>
