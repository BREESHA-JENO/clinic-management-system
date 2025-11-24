# Role-Specific Authentication System

## Overview
This system implements role-specific authentication where each role (admin, receptionist, doctor, labtech, pharmacist) has their own login endpoint and generates role-specific tokens that only allow access to their respective functions.

## Authentication Endpoints

### 1. Admin Login
- **Endpoint:** `POST /api/auth/admin/login`
- **Body:** `{ "username": "admin1", "password": "Admin@123" }`
- **Token Scope:** Admin functions only
- **Access:** All admin routes (`/api/admin/*`)

### 2. Receptionist Login
- **Endpoint:** `POST /api/auth/receptionist/login`
- **Body:** `{ "username": "receptionist1", "password": "Receptionist@123" }`
- **Token Scope:** Receptionist functions only
- **Access:** Receptionist routes (`/api/receptionist/*`)

### 3. Doctor Login
- **Endpoint:** `POST /api/auth/doctor/login`
- **Body:** `{ "username": "doctor1", "password": "Doctor@123" }`
- **Token Scope:** Doctor functions only
- **Access:** Doctor routes (`/api/doctor/*`)

### 4. Lab Technician Login
- **Endpoint:** `POST /api/auth/labtech/login` or `POST /api/auth/labtechnician/login`
- **Body:** `{ "username": "labtech1", "password": "Labtech@123" }`
- **Token Scope:** Lab technician functions only
- **Access:** Lab technician routes (`/api/labtechnician/*`)
- **Note:** Both endpoints work the same way - `/labtechnician/login` is an alias for `/labtech/login`

### 5. Pharmacist Login
- **Endpoint:** `POST /api/auth/pharmacist/login`
- **Body:** `{ "username": "pharmacist1", "password": "Pharmacist@123" }`
- **Token Scope:** Pharmacist functions only
- **Access:** Pharmacist routes (`/api/pharmacist/*`)

## Generic Login (Optional)
- **Endpoint:** `POST /api/auth/login`
- **Body:** `{ "username": "username", "password": "password", "role": "role" }`
- **Use:** When you want to specify the role in the request body

## Protected Routes

### User Information
- **Endpoint:** `GET /api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Returns:** Current user information

### Logout
- **Endpoint:** `POST /api/auth/logout`
- **Headers:** `Authorization: Bearer <token>`
- **Note:** Client-side token removal

## Token Structure

Each role-specific token contains:
```json
{
  "userId": "user_id",
  "role": "admin|receptionist|doctor|labtech|pharmacist",
  "permissions": ["role_specific_permissions"],
  "username": "username",
  "name": "display_name",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

## Role Permissions

### Admin Token
- Can access all admin functions
- Can create users for all roles
- Can manage roles, staff, specializations, doctors
- **Routes:** `/api/admin/*`

### Receptionist Token
- Can manage patients, appointments, billing
- Cannot access admin functions
- **Routes:** `/api/receptionist/*`

### Doctor Token
- Can manage consultations, prescriptions
- Cannot access admin or other role functions
- **Routes:** `/api/doctor/*`

### Lab Technician Token
- Can manage lab tests and results
- Cannot access other role functions
- **Routes:** `/api/labtechnician/*`

### Pharmacist Token
- Can manage medicines and prescriptions
- Cannot access other role functions
- **Routes:** `/api/pharmacist/*`

## Security Features

1. **Account Lockout:** After 3 failed login attempts, account is locked for 30 seconds
2. **Role Validation:** Tokens are validated against specific roles
3. **Token Expiration:** Tokens expire at the end of the day (23:59:59)
4. **Password Hashing:** All passwords are hashed using bcrypt
5. **Input Validation:** All inputs are validated and sanitized

## Usage Examples

### Admin Login
```bash
curl -X POST http://localhost:8000/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin1", "password": "Admin@123"}'
```

### Using Admin Token
```bash
curl -X GET http://localhost:8000/api/admin/staff \
  -H "Authorization: Bearer <admin_token>"
```

### Receptionist Login
```bash
curl -X POST http://localhost:8000/api/auth/receptionist/login \
  -H "Content-Type: application/json" \
  -d '{"username": "receptionist1", "password": "Receptionist@123"}'
```

### Using Receptionist Token
```bash
curl -X GET http://localhost:8000/api/receptionist/patients \
  -H "Authorization: Bearer <receptionist_token>"
```

## Error Responses

### Invalid Credentials
```json
{
  "success": false,
  "message": "Invalid credentials. 2 attempts remaining.",
  "remainingAttempts": 2
}
```

### Account Locked
```json
{
  "success": false,
  "message": "Account locked for 30 seconds due to multiple failed attempts.",
  "lockTime": 30
}
```

### Invalid Role
```json
{
  "success": false,
  "message": "Invalid role. Must be one of: admin, receptionist, doctor, labtech, pharmacist"
}
```

### Token Expired
```json
{
  "success": false,
  "message": "Token has expired. Please login again."
}
```

### Insufficient Permissions
```json
{
  "success": false,
  "message": "Access denied. Required roles: admin. Your role: receptionist"
}
```

## Setup Instructions

1. **Run the seed script:**
   ```bash
   node seedAdmin.js
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Test the endpoints:**
   - Use the provided credentials for each role
   - Each role can only access their specific functions
   - Tokens are role-specific and cannot be used across different role endpoints

## Database Seeding

The seed script creates:
- 5 roles (Admin, Doctor, Receptionist, Lab Technician, Pharmacist)
- 10 specializations (Cardiology, Dermatology, etc.)
- 5 users (one for each role)

### Default Credentials
- **Admin:** admin1 / Admin@123
- **Receptionist:** receptionist1 / Receptionist@123
- **Doctor:** doctor1 / Doctor@123
- **Lab Tech:** labtech1 / Labtech@123
- **Pharmacist:** pharmacist1 / Pharmacist@123 