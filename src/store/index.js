 
import { createStore } from 'vuex';
 
const store = createStore({
  state: {
    users: [],
    loading: false,
    error: null,
    loggedInUser: {
      name: 'Peddireddy Srijith',
      role: 'Administrator'
    }
  },
  mutations: {
    setUsers(state, users) { state.users = users; },
    setLoading(state, loading) { state.loading = loading; },
    setError(state, error) { state.error = error; },
    setLoggedInUser(state, payload) { state.loggedInUser = payload; }
  },
  actions: {
    setUsers({ commit }, users) { commit('setUsers', users); },
    setLoading({ commit }, loading) { commit('setLoading', loading); },
    setError({ commit }, error) { commit('setError', error); },
    setLoggedInUser({ commit }, payload) { commit('setLoggedInUser', payload); }
  },
  getters: {
    getUsers: (state) => state.users,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    loggedInName: (state) => state.loggedInUser.name,
    loggedInRole: (state) => state.loggedInUser.role
  }
});

// Helper to mimic previous `useUserStore()` usage in components.
// Returns the store getters and actions directly for template access.
export function useUserStore() {
  return {
    get getUsers() { return store.getters.getUsers; },
    get isLoading() { return store.getters.isLoading; },
    get getError() { return store.getters.getError; },
    get loggedInName() { return store.getters.loggedInName; },
    get loggedInRole() { return store.getters.loggedInRole; },
    // actions
    setUsers: (users) => store.dispatch('setUsers', users),
    setLoading: (loading) => store.dispatch('setLoading', loading),
    setError: (error) => store.dispatch('setError', error),
    setLoggedInUser: (name, role) => store.dispatch('setLoggedInUser', { name, role })
  };
}

export default store;
