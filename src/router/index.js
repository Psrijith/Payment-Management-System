import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/components/HomeComponent.vue";
import UserList from "@/views/UserList.vue";
import UserForm from "@/views/UserForm.vue";
import PaymentList from "@/views/PaymentList.vue";
import PaymentDetail from "@/views/PaymentDetail.vue";
import PaymentForm from "@/views/PaymentForm.vue";

const routes = [
  { 
    path: "/", 
    name: "home", 
    component: HomeView 
  },
  { 
    path: "/users", 
    name: "users", 
    component: UserList 
  },
  { 
    path: "/users/new", 
    name: "user-create", 
    component: UserForm 
  },
  { 
    path: "/users/:id/edit", 
    name: "user-edit", 
    component: UserForm,
    props: true
  },
  { 
    path: "/payments", 
    name: "payments", 
    component: PaymentList 
  },
  { 
    path: "/payments/new", 
    name: "payment-create", 
    component: PaymentForm 
  },
  { 
    path: "/payments/:id", 
    name: "payment-detail", 
    component: PaymentDetail,
    props: true
  },
  { 
    path: "/payments/:id/edit", 
    name: "payment-edit", 
    component: PaymentForm,
    props: true
  },
  // Catch all route for 404
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
