// stores/userStore.js
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
    loggedInUser: {
      name: 'Peddireddy Srijith',
      role: 'Administrator'
    }
  }),
  actions: {
    setUsers(users) {
      this.users = users;
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    setLoggedInUser(name, role) {
      this.loggedInUser = { name, role };
    }
  },
  getters: {
    getUsers: (state) => state.users,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    loggedInName: (state) => state.loggedInUser.name,
    loggedInRole: (state) => state.loggedInUser.role
  }
});
