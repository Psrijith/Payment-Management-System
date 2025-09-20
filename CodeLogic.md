CodeLogic — PaymentPP

Project: PaymentPP — Vue 3 Payment Management System

Author: (Your name)
Repo path: (local workspace)
GitHub repo: <PLACEHOLDER - add your GitHub repo URL here>

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

2) GitHub repo link
- Please paste your GitHub repo URL here: https://github.com/<username>/<repo>

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

Notes for evaluator
- The mock API base URL is in `src/api/index.js`. If you want to test with a real backend, change `baseURL`.
- Tests are lightweight and DO NOT mount full DOM components; they validate component method logic.

4) Rubric mapping (deliverables coverage)

Criterion: Functional Requirements (40)
- CRUD Functionality: Partial — Payments views (`PaymentList`, `PaymentForm`, `PaymentDetail`) and Users views exist. If backend is available (mockapi is configured), CRUD works via the Axios services. For full offline testing, the evaluator can stub or mock API endpoints.
- Field Validations & Enums: Partial — `PaymentForm.vue` implements validation rules in `validateForm()` and uses select inputs for enums (method/status). User form may require further validation edits.
- Data Representation & Navigation: Done — Routing is complete for list, create, detail, and edit flows. Models provide formatted values.

Criterion: UI/UX Design (25)
- Layout & Responsiveness: Partial — App uses utility classes for layout (Tailwind-like) and is responsive in the main layout. Some small components may need refinements for mobile.
- UX & Accessibility: Partial — Basic UX flows and labels are present; ARIA attributes and full keyboard navigation can be improved.
- Visual Consistency: Partial — Consistent utility classes used, but theme tuning or a design system is not added.

Criterion: Code Architecture & Quality (20)
- Component Architecture: Partial — Views and components are separated; could re-use smaller components more.
- State Management: Partial — Pinia is installed and used for user store; other state is local to components as appropriate.
- Clean Code & Error Handling: Partial — Code is organized; services centralize API errors but UI-facing error messaging exists in forms.

Criterion: Testing (10)
- Component & UI Tests: Done (meets minimum) — At least 2 unit tests per major component implemented for method logic (PaymentForm, PaymentList, PaymentDetail). See `tests/` folder.

Criterion: Application Working (5)
- Project Runs Successfully: Done — App boots after fixing `main.js` issue and tests pass. With a reachable API (default mockapi configured), CRUD flows operate.

Overall status: Mostly Done with some Partial items (UI polish, comprehensive accessibility, more component-level tests).

---

Package for submission
- This repository folder contains all source files.
- I will create `submission.zip` (excluding `node_modules` and `.git`) containing all project files plus `CodeLogic.md` and `CodeLogic.pdf`.


