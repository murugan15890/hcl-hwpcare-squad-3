:: MODULEWISE REQUIREMENTS DOCUMENT (.CMD)
:: Generated based on your Requirements + Development Document
:: For Cursor AI module-by-module code generation

ECHO OFF

:: =============================================================
:: 0. SYSTEM OVERVIEW
:: =============================================================
:: Application: Healthcare Wellness & Preventive Care Portal (MVP)
:: Frameworks: React 19, TS, Tailwind, Redux Toolkit, Jest
:: API: Mock JSON Server (db.json)
:: Roles: superadmin, admin, provider, patient

:: Modules:
::   1. Auth (Patient Self Registration + Login)
::   2. Admin User Management (Providers & Admins created by SuperAdmin)
::   3. Admin Patient→Provider Assignment
::   4. Patient Profile
::   5. Patient Goal Tracker
::   6. Patient Dashboard
::   7. Provider Dashboard (Assigned Patients Only)
::   8. Reminders
::   9. Public Information Pages
::  10. ACL Module
::  11. Global Store & Utilities
::  12. Mock JSON Server
::  13. Testing

:: =============================================================
:: 1. AUTH MODULE (PATIENT SELF-REGISTRATION)
:: =============================================================
:: FEATURES:
::  - Patient can self-register
::  - Provider/Admin cannot self-register
::  - Login using mock API
::  - Fake JWT stored in localStorage
:: ENDPOINTS:
::  GET /users?email=&password=
::  POST /users (Patient only)
:: REDUX:
::  authSlice → registerPatient(), loginUser(), logout()
:: COMPONENTS:
::  LoginPage.tsx, RegisterPatient.tsx

:: =============================================================
:: 2. ADMIN USER MANAGEMENT MODULE (SUPERADMIN ONLY)
:: =============================================================
:: FEATURES:
::  - SuperAdmin creates Admins and Providers
::  - SuperAdmin manages roles
::  - Form-based creation
:: ENDPOINTS:
::  POST /users (role: provider)
::  POST /users (role: admin)
:: COMPONENTS:
::  AdminUserList.tsx
::  UserCreateForm.tsx
:: REDUX:
::  adminUserSlice

:: =============================================================
:: 3. PATIENT → PROVIDER ASSIGNMENT MODULE (ADMIN ONLY)
:: =============================================================
:: FEATURES:
::  - Admin assigns registered patients to providers
::  - Admin can remove assignments
:: ENDPOINTS:
::  GET /users?role=provider
::  GET /users?role=patient
::  GET /providerAssignments?providerId={id}
::  POST /providerAssignments
::  DELETE /providerAssignments/{id}
:: COMPONENTS:
::  AssignmentPage.tsx
::  ProviderDropdown.tsx
::  PatientDropdown.tsx
::  AssignmentList.tsx
:: REDUX:
::  assignmentSlice

:: =============================================================
:: 4. PATIENT PROFILE MODULE
:: =============================================================
:: FEATURES:
::  - Patient views + edits personal profile
:: ENDPOINTS:
::  GET /patientProfiles?userId={id}
::  PUT /patientProfiles/{id}
:: COMPONENTS:
::  ProfilePage.tsx, ProfileForm.tsx
:: REDUX:
::  patientSlice

:: =============================================================
:: 5. PATIENT GOAL TRACKER MODULE
:: =============================================================
:: FEATURES:
::  - Daily logging (sleep, steps, water)
::  - List with virtualization
:: ENDPOINTS:
::  GET /goals?userId={id}
::  POST /goals
::  PUT /goals/{id}
:: COMPONENTS:
::  GoalTracker.tsx, GoalCard.tsx
:: REDUX:
::  goalsSlice

:: =============================================================
:: 6. PATIENT DASHBOARD MODULE
:: =============================================================
:: FEATURES:
::  - Wellness summary
::  - Health tips
::  - Upcoming reminders
:: ENDPOINTS:
::  GET /goals?userId={id}
::  GET /reminders?userId={id}
:: COMPONENTS:
::  PatientDashboard.tsx

:: =============================================================
:: 7. PROVIDER DASHBOARD (ASSIGNED PATIENTS ONLY)
:: =============================================================
:: FEATURES:
::  - Provider sees only assigned patients
::  - Patient status overview
:: ENDPOINTS:
::  GET /providerAssignments?providerId={id}
::  GET /patientProfiles?userId={pid}
::  GET /goals?userId={pid}
:: COMPONENTS:
::  ProviderDashboard.tsx
::  PatientStatusCard.tsx
:: REDUX:
::  providerSlice

:: =============================================================
:: 8. REMINDERS MODULE
:: =============================================================
:: ENDPOINTS:
::  GET /reminders?userId={id}
:: COMPONENTS:
::  ReminderList.tsx, ReminderCard.tsx
:: REDUX:
::  reminderSlice

:: =============================================================
:: 9. PUBLIC INFORMATION MODULE
:: =============================================================
:: Static Pages:
::  - PublicHealth.tsx
::  - PrivacyPolicy.tsx
:: DATA:
::  healthinfo.json
::  privacy.json

:: =============================================================
:: 10. ACL MODULE
:: =============================================================
:: ROLES:
::  - superadmin
::  - admin
::  - provider
::  - patient
:: LOGIC:
::  ProtectedRoute
::  aclConfig.ts
::  useACL hook

:: =============================================================
:: 11. GLOBAL UTILITIES
:: =============================================================
:: FILES:
::  axiosClient.ts
::  caching.ts
::  dateUtils.ts
::  types.ts

:: =============================================================
:: 12. MOCK JSON SERVER
:: =============================================================
:: db.json STRUCTURE:
::  users
::  patientProfiles
::  providers
::  goals
::  reminders
::  providerAssignments
::  logs

:: START COMMAND:
::  json-server --watch mock-api/db.json --port 5000

:: =============================================================
:: 13. TESTING MODULE
:: =============================================================
:: Jest tests:
::  - auth tests
::  - slice tests
::  - UI component tests

ECHO ON