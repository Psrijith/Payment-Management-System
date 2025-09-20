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
          {{ isEditing ? 'Edit User' : 'Create New User' }}
        </h1>
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <form @submit.prevent="submitForm">
          <div class="space-y-6">
            <!-- Name Field -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter full name"
              >
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter email address"
              >
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Phone Field -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter phone number"
              >
              <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
            </div>

            <!-- Status Field -->
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                v-model="form.status"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <p v-if="errors.status" class="mt-1 text-sm text-red-600">{{ errors.status }}</p>
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
                class="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <span v-if="loading" class="inline-flex items-center">
                  <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </span>
                <span v-else>
                  {{ isEditing ? 'Update User' : 'Create User' }}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccess" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        User {{ isEditing ? 'updated' : 'created' }} successfully!
      </div>

      <!-- Error Message -->
      <div v-if="showError" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import { fetchUserById, createUser, updateUser } from '@/services/UserService';
import { User } from '@/models/User';

export default {
  name: 'UserForm',
  props: {
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        status: 'active'
      },
      errors: {},
      loading: false,
      showSuccess: false,
      showError: false,
      errorMessage: ''
    };
  },
  computed: {
    isEditing() {
      return !!this.userId || !!this.$route.params.id;
    }
  },
  async mounted() {
    if (this.isEditing) {
      await this.loadUser();
    }
    // Store form state in session storage
    sessionStorage.setItem('currentForm', 'user');
  },
  methods: {
    async loadUser() {
      try {
        this.loading = true;
        const userId = this.userId || this.$route.params.id;
        const userData = await fetchUserById(userId);
        const user = User.fromJson(userData);
        
        this.form = {
          name: user.name,
          email: user.email,
          phone: user.phone,
          status: user.status
        };
      } catch (error) {
        console.error('Error loading user:', error);
        this.showError = true;
        this.errorMessage = 'Failed to load user data';
      } finally {
        this.loading = false;
      }
    },
    validateForm() {
      this.errors = {};
      
      if (!this.form.name.trim()) {
        this.errors.name = 'Name is required';
      }
      
      if (!this.form.email.trim()) {
        this.errors.email = 'Email is required';
      } else if (!this.isValidEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }
      
      if (this.form.phone && !this.isValidPhone(this.form.phone)) {
        this.errors.phone = 'Please enter a valid phone number';
      }
      
      return Object.keys(this.errors).length === 0;
    },
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    isValidPhone(phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return phoneRegex.test(phone) && phone.length >= 10;
    },
    async submitForm() {
      if (!this.validateForm()) {
        return;
      }

      try {
        this.loading = true;
        this.showError = false;
        this.showSuccess = false;

        const userData = {
          ...this.form,
          created: this.isEditing ? undefined : Date.now()
        };

        if (this.isEditing) {
          const userId = this.userId || this.$route.params.id;
          await updateUser(userId, userData);
          this.$emit('user-updated', userData);
        } else {
          const newUser = await createUser(userData);
          this.$emit('user-created', newUser);
        }

        this.showSuccess = true;
        
        // Redirect after success
        setTimeout(() => {
          this.$router.push('/users');
        }, 1500);

      } catch (error) {
        console.error('Error saving user:', error);
        this.showError = true;
        this.errorMessage = 'Failed to save user. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        phone: '',
        status: 'active'
      };
      this.errors = {};
      this.showSuccess = false;
      this.showError = false;
    }
  }
};
</script>
