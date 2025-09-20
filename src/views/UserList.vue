<template>
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Viewing All Users</h1>
      <button 
        @click="$router.push('/users/new')"
        class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <span>+</span>
        Add User
      </button>
    </div>

    <!-- Search and Filter Controls -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-64">
          <input 
            v-model="searchTerm"
            @input="filterUsers"
            type="text" 
            placeholder="Search users by name or email..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
        </div>
        <div>
          <select 
            v-model="statusFilter"
            @change="filterUsers"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <select 
            v-model="sortBy"
            @change="sortUsers"
            class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="created">Sort by Date</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600">Loading users...</p>
    </div>

    <!-- Users Table -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                      <span class="text-white font-medium">{{ user.name.charAt(0).toUpperCase() }}</span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ user.email }}</div>
                <div class="text-sm text-gray-500">{{ user.phone }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(user.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ user.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(user.created) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button 
                  @click="editUser(user)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  Edit
                </button>
                <button 
                  @click="confirmDelete(user)"
                  class="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State -->
      <div v-if="filteredUsers.length === 0" class="text-center py-8">
        <p class="text-gray-500">No users found</p>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900">Delete User</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete {{ userToDelete?.name }}? This action cannot be undone.
            </p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="deleteUser"
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
import { fetchUsers, deleteUser as deleteUserService } from '@/services/UserService';
import { User } from '@/models/User';

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      filteredUsers: [],
      loading: true,
      searchTerm: '',
      statusFilter: '',
      sortBy: 'name',
      showDeleteModal: false,
      userToDelete: null
    };
  },
  async mounted() {
    await this.loadUsers();
    // Store current page in session storage
    sessionStorage.setItem('currentPage', 'users');
  },
  methods: {
    async loadUsers() {
      try {
        this.loading = true;
        const userData = await fetchUsers();
        this.users = userData.map(user => User.fromJson(user));
        this.filterUsers();
      } catch (error) {
        console.error('Error loading users:', error);
      } finally {
        this.loading = false;
      }
    },
    filterUsers() {
      let filtered = [...this.users];

      // Filter by search term
      if (this.searchTerm) {
        filtered = filtered.filter(user => 
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (this.statusFilter) {
        filtered = filtered.filter(user => user.status === this.statusFilter);
      }

      this.filteredUsers = filtered;
      this.sortUsers();
    },
    sortUsers() {
      this.filteredUsers.sort((a, b) => {
        const aValue = a[this.sortBy];
        const bValue = b[this.sortBy];
        
        if (typeof aValue === 'string') {
          return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
      });
    },
    editUser(user) {
      this.$router.push(`/users/${user.id}/edit`);
    },
    confirmDelete(user) {
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    async deleteUser() {
      try {
        await deleteUserService(this.userToDelete.id);
        await this.loadUsers();
        this.showDeleteModal = false;
        this.userToDelete = null;
        this.$emit('user-deleted', this.userToDelete);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    },
    getStatusClass(status) {
      return status === 'active' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString();
    }
  }
};
</script>
