:: =============================================================
:: MODULE-WISE DEVELOPMENT DOCUMENT (.CMD)
:: Healthcare Wellness & Preventive Care Portal – MVP
:: =============================================================
:: This file provides a complete module-by-module development plan
:: for building the Healthcare Wellness & Preventive Care Portal.
:: Use this document in Cursor AI to generate each module separately.
:: =============================================================

ECHO OFF

:: =============================================================
:: 0. PROJECT OVERVIEW
:: =============================================================
:: ACL MODULE INCLUDED: SuperAdmin, Patient, Provider role-based page access
:: =============================================================
:: =============================================================
:: Architecture Type: React 19 + TS + Tailwind + Redux Toolkit + Axios
:: API Layer: Mock JSON server using db.json
:: Data Source: Simple mock JSON dataset
:: Modules: Auth, Patient Dashboard, Provider Dashboard, Profile Mgmt,
::          Goal Tracker, Reminders, Public Pages, Logging

:: Cursor will use this document to build modules one by one.


:: =============================================================
:: =============================================================
:: ACL MODULE: ROLE-BASED ACCESS CONTROL (SUPERADMIN / ADMIN / PROVIDER / PATIENT)
:: =============================================================
:: DESCRIPTION:
::   Implement a central ACL system controlling page-level and component-level access.
:: ROLES:
::   - superadmin
::   - admin (NEW ROLE: can assign patients → providers)
::   - provider
::   - patient
:: ACL FEATURES:
::   - SuperAdmin → full system control, create Admins & Providers
::   - Admin → assign registered patients to specific providers, manage mappings
::   - Provider → can view ONLY assigned patients
::   - Patient → can only view their own dashboard
:: FRONTEND IMPLEMENTATION:
::   - aclConfig.ts → defines allowed routes per role
::   - ProtectedRoute component checks role-based access
::   - RouteGuard for Admin-only assignment pages
:: API REQUIREMENTS:
::   - users[] includes role: "superadmin" | "admin" | "patient" | "provider"
::   - providerAssignments[] endpoint requires admin privileges
:: REDUX:
::   - authSlice stores user.role
::   - selector canAccess(routeKey) enforces ACL

:: ============================================================= (SUPERADMIN / PATIENT / PROVIDER)
:: =============================================================
:: DESCRIPTION:
::   Implement a central ACL system controlling page-level and component-level access.
:: ROLES:
::   - superadmin
::   - provider
::   - patient
:: ACL FEATURES:
::   - SuperAdmin can access: user management, provider list, system logs
::   - Provider can access: provider dashboard, assigned patient data
::   - Patient can access: patient dashboard, goal tracking, profile
:: FRONTEND IMPLEMENTATION:
::   - aclConfig.ts → defines allowed routes per role
::   - ProtectedRoute component checks role-based access
::   - Centralized route guard in React Router
:: API REQUIREMENTS:
::   - users[] includes role: "superadmin" | "patient" | "provider"
:: REDUX:
::   - authSlice must store user.role
::   - selector canAccess(routeKey) returns boolean

:: =============================================================
:: =============================================================
:: 1. MODULE: AUTHENTICATION MODULE
:: =============================================================
:: DESCRIPTION:
::   Patient can self-register. Providers CANNOT self-register.
::   Providers are added ONLY by SuperAdmin via Provider Management module.
:: USER FLOWS:
::   - PATIENT: Register → Login → Dashboard
::   - PROVIDER: Created by SuperAdmin → Receives credentials → Login
::   - SUPERADMIN: Cannot self-register; seeded or created manually in mock data
:: API ENDPOINTS (MOCK):
::   GET /users?email=&password=
::   POST /users  (ONLY for patient registration)
::   Provider creation happens in: POST /providers (SuperAdmin only)
:: DATA:
::   users[] → id, role (patient/provider/superadmin), email, password, name, consent
:: REDUX REQUIREMENTS:
::   authSlice → loginUser(), registerPatient(), logout()
:: ACL NOTE:
::   - Registration page visible ONLY for patient role
::   - Provider creation handled in SuperAdmin module
:: =============================================================
:: DESCRIPTION:
:: Provides login & registration using mock JSON API.
:: USER ROLES: patient, provider
:: API ENDPOINTS:
::   GET /users?email=&password=
:: DATA:
::   users[] → id, role, email, password, name, consent
:: FRONTEND REQUIREMENTS:
::   - Login page
::   - Registration page
::   - Form validation
::   - Fake JWT storage in localStorage
:: REDUX REQUIREMENTS:
::   authSlice:
::     state: user, token, loading, error
::     async thunks:
::       loginUser(), registerUser(), logout()
:: AXIOS LOGIC:
::   - Attach fake token
::   - Handle 401


:: =============================================================
:: 2. MODULE: PATIENT PROFILE MANAGEMENT
:: =============================================================
:: DESCRIPTION:
::   Patient can view/edit personal health profile.
:: API ENDPOINTS:
::   GET /patientProfiles?userId={id}
::   PUT /patientProfiles/{id}
:: DATA:
::   patientProfiles[] → id, userId, age, gender, allergies, medications
:: COMPONENTS:
::   - ProfilePage.tsx
::   - ProfileForm.tsx
:: REDUX:
::   patientSlice:
::     loadProfile(), updateProfile()


:: =============================================================
:: 3. MODULE: PATIENT GOAL TRACKER
:: =============================================================
:: DESCRIPTION:
::   Patient logs daily wellness goals (steps, sleep, water intake).
:: API ENDPOINTS:
::   GET /goals?userId={id}
::   POST /goals
::   PUT /goals/{id}
:: DATA:
::   goals[] → id, userId, date, steps, water, sleep
:: COMPONENTS:
::   - GoalTracker.tsx
::   - DailyGoalCard.tsx
:: REQUIREMENTS:
::   - Form to submit/update goals
::   - Display chart/list of goals
:: REDUX:
::   goalsSlice:
::     fetchGoals(), saveGoal(), updateGoal()
:: EXTRA:
::   Use virtualization for large goal lists


:: =============================================================
:: 4. MODULE: PATIENT DASHBOARD
:: =============================================================
:: DESCRIPTION:
::   Main dashboard for patient with:
::   - Wellness progress summary
::   - Upcoming reminders
::   - Health Tip of the Day
:: API ENDPOINTS:
::   GET /goals?userId={id}
::   GET /reminders?userId={id}
::   Static health tips JSON file or random selection
:: UI ELEMENTS:
::   - Progress cards
::   - Reminders widget
::   - Tip-of-the-day panel
:: REDUX:
::   Combine data from goals, reminders slices


:: =============================================================
:: =============================================================
:: 5. MODULE: PROVIDER DASHBOARD (ASSIGNED PATIENTS ONLY)
:: =============================================================
:: DESCRIPTION:
::   Providers can view ONLY the patients that have been assigned to them.
::   Patient assignment is performed by Admin role, not provider.
:: API ENDPOINTS:
::   GET /providerAssignments?providerId={id}
::   GET /goals?userId={patientId}
::   GET /patientProfiles?userId={patientId}
:: UI COMPONENTS:
::   - ProviderDashboard.tsx
::   - PatientStatusCard.tsx
:: FEATURES:
::   - List all assigned patients
::   - Show goal compliance
::   - Drill-down patient view
:: REDUX:
::   providerSlice:
::     fetchAssignedPatients(), fetchPatientStatus()

:: =============================================================
:: =============================================================
:: DESCRIPTION:
::   Providers can view assigned patients and their compliance status.
:: API ENDPOINTS:
::   GET /providerAssignments?providerId={id}
::   GET /goals?userId={patientId}
::   GET /patientProfiles?userId={patientId}
:: UI COMPONENTS:
::   - ProviderDashboard.tsx
::   - PatientStatusCard.tsx
:: FEATURES:
::   - List all assigned patients
::   - Show goal compliance
::   - Click patient → view detail page
:: REDUX:
::   providerSlice:
::     fetchAssignedPatients(), fetchPatientStatus()


:: =============================================================
:: 6. MODULE: REMINDERS MODULE
:: =============================================================
:: DESCRIPTION:
::   Display preventive care reminders to patients.
:: API ENDPOINTS:
::   GET /reminders?userId={id}
:: DATA:
::   reminders[] → id, userId, title, dueDate
:: COMPONENTS:
::   - ReminderList.tsx
::   - ReminderCard.tsx
:: REDUX:
::   remindersSlice:
::     fetchReminders()


:: =============================================================
:: 7. MODULE: PUBLIC HEALTH INFORMATION PAGE
:: =============================================================
:: DESCRIPTION:
::   Static content page: health info + privacy policy.
:: UI COMPONENTS:
::   - PublicHealth.tsx
::   - PrivacyPolicy.tsx
:: DATA:
::   - healthinfo.json (static)
::   - privacy.json (static)


:: =============================================================
:: 8. MODULE: LOGGING & AUDIT MOCK
:: =============================================================
:: DESCRIPTION:
::   Log important user actions (mock only).
:: MOCK API ENDPOINTS:
::   POST /logs
:: LOGGED EVENTS:
::   - login
::   - view patient data
::   - update profile
:: IMPLEMENTATION:
::   - send JSON entry to /logs


:: =============================================================
:: =============================================================
:: 9. MODULE: PATIENT → PROVIDER ASSIGNMENT MODULE (ADMIN ONLY)
:: =============================================================
:: DESCRIPTION:
::   Admin user can assign registered patients to providers.
:: API ENDPOINTS (MOCK JSON):
::   GET /users?role=provider → list providers
::   GET /users?role=patient → list patients
::   GET /providerAssignments?providerId={id}
::   POST /providerAssignments (admin assigns patient)
::   DELETE /providerAssignments/{id}
:: UI COMPONENTS:
::   - AdminAssignPage.tsx
::   - ProviderSelectDropdown.tsx
::   - PatientSelectDropdown.tsx
::   - AssignmentList.tsx
:: REDUX:
::   adminAssignmentSlice:
::     fetchProviders(), fetchPatients(), assignPatient(), removeAssignment()
:: ADDITIONAL DATA:
::   providerAssignments[] → id, providerId, patientId

:: =============================================================
:: 10. MODULE: MOCK JSON API LAYER
:: =============================================================
:: DESCRIPTION:
::   Local json-server to mock backend.
:: FILE:
::   mock-api/db.json
:: DEFAULT PORT:
::   http://localhost:5000
:: INCLUDED COLLECTIONS:
::   users, patientProfiles, goals, reminders, providerAssignments, logs
:: COMMAND TO START API:
::   json-server --watch mock-api/db.json --port 5000


:: =============================================================
:: 10. MODULE: GLOBAL UTILS
:: =============================================================
:: INCLUDE:
::   axiosClient.ts
::   caching.ts (TTL-based cache)
::   dateUtils.ts
::   constants.ts
:: FEATURES:
::   - Axios interceptors
::   - Automatic token injection


:: =============================================================
:: 11. MODULE: GLOBAL STATE MANAGEMENT
:: =============================================================
:: Redux store structure:
::   store.ts
::   authSlice
::   patientSlice
::   goalsSlice
::   remindersSlice
::   providerSlice

:: Each slice uses createAsyncThunk for API calls.


:: =============================================================
:: 12. MODULE: TESTING MODULE
:: =============================================================
:: Use Jest + React Testing Library.
:: Required tests:
::   - Login component test
::   - authSlice test
::   - Goal tracker test
::   - Provider list test


:: =============================================================
:: 13. MODULE: ROUTING MODULE
:: =============================================================
:: ROUTER SETUP:
::   /login
::   /register
::   /patient/dashboard
::   /provider/dashboard
::   /profile
::   /public/health


:: =============================================================
:: 14. MODULE: UI SYSTEM
:: =============================================================
:: Tailwind CSS utilities.
:: Global styles.
:: Shared components:
::   - Button
::   - Card
::   - Input
::   - Layout wrapper


:: =============================================================
:: HOW TO USE THIS FILE IN CURSOR
:: =============================================================
:: 1. Open this .cmd file in Cursor.
:: 2. Select a specific module section.
:: 3. Use CMD+K or the magic wand to generate code for that module.
:: 4. Build your app module-by-module.

ECHO ON
