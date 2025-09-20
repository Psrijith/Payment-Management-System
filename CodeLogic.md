CodeLogic — PaymentPP

Project: PaymentPP — Vue 3 Payment Management System

Author: (Your name)
Repo path: (local workspace)
GitHub repo: <[Github Project Link](https://github.com/Psrijith/Payment-Management-System.git)>

---

1) Brief walkthrough of the logic applied to solve the project

Overview
- The frontend is a Vue 3 single-page application built with Vite. Pinia is used for simple global state (logged-in user), Vue Router for navigation, and Axios for API calls.

Key design decisions and logic
- Keep business logic in views and models: `Payment` and `User` models provide `fromJson`/`toJson` helpers and formatting getters (`formattedAmount`, `formattedDate`) so views render consistent data.
- Service layer: `PaymentService` and `UserService` wrap Axios calls so HTTP concerns are centralized and easy to mock or replace.
- Simple tests: to stay beginner-friendly and reliable without heavy DOM mounting, tests focus on pure method logic (validation, formatting, filtering, status mapping). This satisfies the requirement of 2 tests per major component.
- Minimal, targeted fixes: fixed a duplicate import in `src/main.js` that prevented app bootstrap; added `jest.config.js` and straightforward Jest tests to make the test suite pass.

File-level flow (runtime)
- `src/main.js` — createApp -> install Pinia -> install Router -> mount app.
- `src/App.vue` — global layout with sidebar and top bar; uses `useUserStore` for logged in user display and contains `<router-view/>`.
- `src/router/index.js` — defines routes for Dashboard, Users, Payments list/create/detail/edit, and a catch-all redirect.
- Payment List flow (`src/views/PaymentList.vue`): on mounted, `loadPayments()` calls `PaymentService.fetchPayments()`, maps data to `Payment` models, stores to `payments`, then runs `filterPayments()` to populate `filteredPayments`.
- Payment Form flow (`src/views/PaymentForm.vue`): loads users via `UserService.fetchUsers()` to populate the user dropdown, sets default date using `formatDateForInput()`, validates form with `validateForm()`, and on submit calls either `createPayment()` or `updatePayment()`.
- Payment Detail flow (`src/views/PaymentDetail.vue`): `loadPayment()` fetches a single payment (and optionally user details) and exposes actions like `updateStatus()` and `deletePayment()` which call the service layer.

Testing logic and how to run
- Tests are in `tests/` and include `.test.js` and `.spec.js` variants. They are simple JS logic tests which validate methods such as `validateForm()`, `formatDateForInput()`, `filterPayments()` and `getStatusClass()`.
- Run tests with `npm test` or `npx jest`.

2) GitHub repo link  https://github.com/Psrijith/Payment-Management-System.git

3) Instructions for the evaluator to run the project

Prerequisites
- Node.js (18+ recommended)
- npm

Steps
1. Clone the repo (or unzip the submitted folder)

```bash
git clone <repo-url>
cd paymentpp
```

2. Install dependencies

```bash
npm install
```

3. Start dev server

```bash
npm run dev
```

Open: http://localhost:5173

4. Run tests

```bash
npm test
# or
npx jest
```
 