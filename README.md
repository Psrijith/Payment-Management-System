# Vue 3 - Payment Management System

A simple payment management frontend built with Vue 3, Vite, Pinia, and Tailwind-style utility classes. It includes user and payment CRUD views, routing, API services (Axios), and a small Jest test suite.

This README covers setup, running the app, testing, and where to find key files.

## Features

- Vue 3 + Vite for fast development
- Pinia for state management
- Vue Router for navigation
- Payment and User models with formatting helpers
- REST API services (Axios) with a configurable base URL
- Jest tests for component method logic

## Quick start

Prerequisites:
- Node.js 18+ (recommended)
- npm

1. Install dependencies

```bash
npm install
```

2. Start dev server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production bundle 
- `npm test` — run Jest tests

## Testing

This project uses Jest for unit tests. Tests live in the `tests/` folder and include both `.test.js` and `.spec.js` files.

Run tests:

```bash
npm test
# or
npx jest
```

The current tests focus on component method logic (validation, formatting, filtering, status handling).

## Project structure (important files)

- `src/main.js` — app entry point (mounts Vue, Pinia, Router)
- `src/App.vue` — main layout, navigation, and top bar
- `src/router/index.js` — route definitions for users/payments
- `src/views/PaymentList.vue` — payments listing and filtering
- `src/views/PaymentForm.vue` — create/edit payment form and methods
- `src/views/PaymentDetail.vue` — payment detail and status actions
- `src/services/PaymentService.js` — Axios-based API calls for payments
- `src/services/UserService.js` — Axios-based API calls for users
- `src/models/Payment.js` and `src/models/User.js` — data models with helpers
- `src/api/index.js` — Axios instance (update baseURL to point to your backend)
- `tests/` — Jest test files

## API

This project uses [**MockAPI**](https://mockapi.io/) as the backend service for handling all API requests during development and testing.

### 📦 Why MockAPI?

MockAPI is a fast and free service that helps simulate real RESTful APIs. It's used in this project to:

- Quickly prototype and test frontend features without a real backend.
- Avoid backend setup during early development.
- Provide consistent fake data for development and testing.

You can explore or manage the current API directly at [https://mockapi.io](https://mockapi.io).

Default API base URL is set in `src/api/index.js`:

```
https://68cc236b716562cf507693eb.mockapi.io
```

Change this to your backend URL if required.

 


## Flow & Walkthrough — how the app works (file-level)

This section describes the runtime flow, component responsibilities, and how the pieces interact. Use this as a quick mental map when extending or debugging the app.

1) App bootstrap
- `src/main.js` — application entry point. Creates the Vue app, installs Pinia (state), and mounts the Vue Router, then mounts the app into `#app`.

2) Routing and navigation
- `src/router/index.js` defines routes for the main views: dashboard (`/`), users (`/users`), payments list (`/payments`), payment create (`/payments/new`), payment detail (`/payments/:id`), and edit routes. Routes commonly pass `props: true` for edit/detail routes so components can read `paymentId` from props or `$route.params`.

3) Layout and top-level UI
- `src/App.vue` contains the sidebar, top bar and `<router-view/>`. It reads the logged-in user from the store and shows their name/role. The router-view renders the active view (list, form, detail).

4) Views and components
- `src/views/PaymentList.vue` — responsible for loading payment data, filtering (search/status/category), pagination, and actions like view/edit/delete. Key methods:
	- `loadPayments()` — fetches data via `PaymentService.fetchPayments()` and maps JSON to `Payment` models.
	- `filterPayments()` — filters the in-memory list based on `searchTerm`, `statusFilter`, etc.
	- `getStatusClass(status)` — returns a CSS class for a status badge.

- `src/views/PaymentForm.vue` — create/edit view. Handles form state and validation. Key methods:
	- `loadUsers()` — loads users for the select box using `UserService.fetchUsers()`.
	- `validateForm()` — verifies required fields and builds `errors`.
	- `submitForm()` — constructs a payment payload and calls `createPayment()` or `updatePayment()` from `PaymentService`, then emits events and navigates back.
	- `formatDateForInput(date)` — helper that formats a Date object to the `datetime-local` input format.

- `src/views/PaymentDetail.vue` — shows payment data and allows status updates or delete.
	- `loadPayment()` — fetches payment JSON and converts to `Payment` model; also attempts to load user details if present.
	- `updateStatus(newStatus)` — prepares an updated payment payload and calls `PaymentService.updatePayment()` then updates local state.

5) Models
- `src/models/Payment.js` and `src/models/User.js` contain small classes with `fromJson()` / `toJson()` helpers and getters (formattedAmount, formattedDate) used by views to present data consistently.

6) Services and API
- `src/services/PaymentService.js` and `src/services/UserService.js` wrap Axios (`src/api/index.js`) to keep HTTP code in one place. Update `src/api/index.js` to point to your own backend.

7) State management
- Pinia is installed (`createPinia()` in `main.js`). The user store exposes a static `loggedInUser` in `src/store/index.js` (name and role) used by `App.vue` for display.

8) Tests
- Tests are located in `tests/` and focus on component method logic (validation, formatting, filtering) to keep them simple and fast. Jest configuration is in `jest.config.js`. Use `npm test` or `npx jest` to run them.
 


