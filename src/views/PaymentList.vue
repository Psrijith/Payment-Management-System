<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Viewing All Payments</h1>
      <button 
        @click="$router.push('/payments/new')"
        class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>+</span>
        New Payment
      </button>
    </div>

    <!-- Filters and Search -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <input 
            v-model="searchTerm"
            @input="filterPayments"
            type="text" 
            placeholder="Search by user..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
        </div>
        <div>
          <select 
            v-model="statusFilter"
            @change="filterPayments"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
         
      </div>
    </div> 

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      <p class="mt-2 text-gray-600">Loading payments...</p>
    </div>

    <!-- Payments Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr> 
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th class="px-20 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="payment in paginatedPayments" :key="payment.id" class="hover:bg-gray-50">
             
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ payment.user || 'Unknown User' }}</div> 
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">${{ payment.amount }}.00</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(payment.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ payment.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(payment.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="viewPayment(payment)"
                  class="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View Details
                </button>
                <button 
                  @click="editPayment(payment)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDelete(payment)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button 
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredPayments.length) }} of {{ filteredPayments.length }} results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button 
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button 
                v-for="page in visiblePages" 
                :key="page"
                @click="currentPage = page"
                :class="page === currentPage ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                {{ page }}
              </button>
              <button 
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredPayments.length === 0" class="text-center py-8">
        <p class="text-gray-500">No payments found</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900">Delete Payment</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete this payment ? This action cannot be undone.
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
</template>

<script>
import { fetchPayments, deletePayment as deletePaymentService } from '@/services/PaymentService';
import { Payment } from '@/models/Payment';

export default {
  name: 'PaymentList',
  data() {
    return {
      payments: [],
      filteredPayments: [],
      loading: true,
      searchTerm: '',
      statusFilter: '',
      categoryFilter: '',
      sortBy: 'date',
      showDeleteModal: false,
      paymentToDelete: null,
      currentPage: 1,
      itemsPerPage: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredPayments.length / this.itemsPerPage);
    },
    paginatedPayments() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPayments.slice(start, end);
    },
    visiblePages() {
      const pages = [];
      const startPage = Math.max(1, this.currentPage - 2);
      const endPage = Math.min(this.totalPages, this.currentPage + 2);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    },
    totalAmount() {
      const total = this.filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
      return this.formatCurrency(total);
    }
  },
  async mounted() {
    await this.loadPayments();
    sessionStorage.setItem('currentPage', 'payments');
  },
  methods: {
    async loadPayments() {
      try {
        this.loading = true;
        const paymentData = await fetchPayments();
        this.payments = paymentData.map(payment => Payment.fromJson(payment));
        this.filterPayments();
      } catch (error) {
        console.error('Error loading payments:', error);
      } finally {
        this.loading = false;
      }
    },
    filterPayments() {
      let filtered = [...this.payments];

      if (this.searchTerm) {
        filtered = filtered.filter(payment => 
          (payment.user && payment.user.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
          (payment.description && payment.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      }

      if (this.statusFilter) {
        filtered = filtered.filter(payment => payment.status === this.statusFilter);
      }

      if (this.categoryFilter) {
        filtered = filtered.filter(payment => payment.category === this.categoryFilter);
      }

      this.filteredPayments = filtered;
      this.sortPayments();
      this.currentPage = 1;
    },  
    getStatusClass(status) {
      const classes = {
        completed: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        cancelled: 'bg-red-100 text-red-800'
      };
      return classes[status] || 'bg-gray-100 text-gray-800';
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString();
    },
    viewPayment(payment) {
      this.$router.push(`/payments/${payment.id}`);
    },
    editPayment(payment) {
      this.$router.push(`/payments/${payment.id}/edit`);
    },
    confirmDelete(payment) {
      this.paymentToDelete = payment;
      this.showDeleteModal = true;
    },
    async deletePayment() {
      try {
        await deletePaymentService(this.paymentToDelete.id);
        await this.loadPayments();
        this.showDeleteModal = false;
        this.paymentToDelete = null;
        this.$emit('payment-deleted', this.paymentToDelete);
      } catch (error) {
        console.error('Error deleting payment:', error);
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
};
</script>
