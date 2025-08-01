# Postman Tests for Receptionist Module

## Base URL
```
http://localhost:8000/api/receptionist
```

## 1. Patient Management Tests

### Register Patient
**POST** `/patients`
```json
{
  "name": "John Doe",
  "dob": "1990-05-15",
  "gender": "male",
  "bloodGroup": "A+",
  "status": "active"
}
```

### List All Patients
**GET** `/patients`
**Query Parameters:**
- `status=active` (optional)
- `page=1` (optional)
- `limit=10` (optional)
- `search=john` (optional)

### Get Patient by ID
**GET** `/patients/{patientId}`
Replace `{patientId}` with actual patient ID (e.g., `P20240001`)

### Update Patient
**PUT** `/patients/{patientId}`
```json
{
  "name": "John Smith",
  "dob": "1990-05-15",
  "gender": "male",
  "bloodGroup": "A+",
  "status": "active"
}
```

### Deactivate Patient
**PATCH** `/patients/{patientId}/deactivate`

### Get Patient History
**GET** `/patients/{patientId}/history`

## 2. Doctor Management Tests

### Register Doctor
**POST** `/doctors`
```json
{
  "doctorId": "DOC001",
  "name": "Dr. Smith",
  "specialization": "Cardiology",
  "email": "dr.smith@clinic.com",
  "phone": "123-456-7890",
  "isActive": true
}
```

### List All Doctors
**GET** `/doctors`
**Query Parameters:**
- `isActive=true` (optional)
- `specialization=cardiology` (optional)
- `page=1` (optional)
- `limit=10` (optional)
- `search=smith` (optional)

### Get Doctor by ID
**GET** `/doctors/{doctorId}`

### Update Doctor
**PUT** `/doctors/{doctorId}`
```json
{
  "name": "Dr. Johnson",
  "specialization": "Neurology",
  "email": "dr.johnson@clinic.com",
  "phone": "123-456-7890",
  "isActive": true
}
```

## 3. Appointment Management Tests

### Schedule Appointment
**POST** `/appointments`
```json
{
  "patientId": "P20240001",
  "doctorId": "DOC001",
  "date": "2024-12-25T10:00:00Z",
  "status": "scheduled"
}
```

### List Appointments by Date
**GET** `/appointments`
**Query Parameters:**
- `date=2024-12-25` (optional)
- `status=scheduled` (optional)
- `page=1` (optional)
- `limit=10` (optional)

### List Appointments by Patient
**GET** `/appointments/patient/{patientId}`

### List Appointments by Doctor
**GET** `/appointments/doctor/{doctorId}`

### Get Appointment by ID
**GET** `/appointments/{appointmentId}`

### Update Appointment
**PUT** `/appointments/{appointmentId}`
```json
{
  "patientId": "P20240001",
  "doctorId": "DOC001",
  "date": "2024-12-25T10:00:00Z",
  "status": "confirmed"
}
```

### Cancel Appointment
**PATCH** `/appointments/{appointmentId}/cancel`

## 4. Billing Management Tests

### Generate Bill
**POST** `/billing`
```json
{
  "appointmentId": "APT20240001",
  "amount": 150.00,
  "date": "2024-12-25",
  "status": "pending"
}
```

### List Bills by Date Range
**GET** `/billing`
**Query Parameters:**
- `startDate=2024-12-01` (optional)
- `endDate=2024-12-31` (optional)
- `status=pending` (optional)
- `page=1` (optional)
- `limit=10` (optional)

### Get Bill by Appointment ID
**GET** `/billing/{appointmentId}`

### Update Bill
**PUT** `/billing/{appointmentId}`
```json
{
  "amount": 200.00,
  "date": "2024-12-25",
  "status": "paid"
}
```

### Record Payment
**PATCH** `/billing/{appointmentId}/payment`
```json
{
  "paymentAmount": 150.00,
  "paymentMethod": "card"
}
```

### Get Billing Statistics
**GET** `/billing/stats`

## 5. Dashboard & Statistics Tests

### Get Dashboard Statistics
**GET** `/dashboard/stats`

## 6. Health Check

### Health Check
**GET** `/health`

## Test Sequence

1. **Start with Health Check** - Verify server is running
2. **Register a Doctor** - Create a doctor first
3. **Register a Patient** - Create a patient
4. **Schedule an Appointment** - Create appointment between patient and doctor
5. **Generate a Bill** - Create billing for the appointment
6. **Test all list endpoints** - Verify data retrieval
7. **Test update endpoints** - Modify existing records
8. **Test dashboard** - Check statistics

## Sample Test Data

### Doctor Data
```json
{
  "doctorId": "DOC001",
  "name": "Dr. Sarah Johnson",
  "specialization": "Cardiology",
  "email": "sarah.johnson@clinic.com",
  "phone": "555-123-4567",
  "isActive": true
}
```

### Patient Data
```json
{
  "name": "Michael Brown",
  "dob": "1985-08-20",
  "gender": "male",
  "bloodGroup": "O+",
  "status": "active"
}
```

### Appointment Data
```json
{
  "patientId": "P20240001",
  "doctorId": "DOC001",
  "date": "2024-12-25T14:30:00Z",
  "status": "scheduled"
}
```

### Billing Data
```json
{
  "appointmentId": "APT20240001",
  "amount": 250.00,
  "date": "2024-12-25",
  "status": "pending"
}
```

## Expected Responses

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "invalid-value",
      "msg": "Detailed error message",
      "path": "fieldName",
      "location": "body"
    }
  ]
}
```

## Tips for Testing

1. **Use Postman Collections** - Create a collection for all endpoints
2. **Set Environment Variables** - Store base URL and IDs
3. **Test Validation** - Try invalid data to test validation
4. **Check Response Codes** - 200 for success, 400 for validation errors, 404 for not found
5. **Test Pagination** - Use page and limit parameters
6. **Test Search** - Use search parameters for filtering 