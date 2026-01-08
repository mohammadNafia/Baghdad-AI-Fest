# Real-Time Testing Guide

## Quick Start

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open browser console** (F12) and run:
   ```javascript
   // Load test script
   import('/src/test/manual-test-script.js').then(module => {
     window.testRegistrationService = module.testRegistrationService;
     window.testSettingsService = module.testSettingsService;
     window.testCapacityLimit = module.testCapacityLimit;
     window.runAllTests = module.runAllTests;
   });
   ```

3. **Run tests:**
   ```javascript
   runAllTests()
   ```

---

## Complete Test Checklist

### ✅ Backend/Database Tests

#### Test 1: Registration Capacity Check
```javascript
// In browser console
const testCapacity = async () => {
  // Check current count
  const count = await registrationService.getTotalAttendeeCount();
  console.log('Current count:', count.count);
  
  // Try to register when at capacity
  if (count.count >= 250) {
    const result = await registrationService.submitAttendee({
      name: 'Test',
      email: 'test@example.com',
      phone: '123',
      age: 25,
      occupation: 'Student',
      motivation: 'Test'
    });
    console.log('Should fail:', result.success === false);
    console.log('Error message:', result.error);
  }
};
testCapacity();
```

#### Test 2: Attendee CRUD Operations
```javascript
// Create
const create = await registrationService.submitAttendee({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  age: 30,
  occupation: 'Engineer',
  motivation: 'Interested'
});
console.log('Created:', create);

// Read
const read = await registrationService.findAttendeeByEmail('john@example.com');
console.log('Found:', read);

// Update
if (read.success) {
  const update = await registrationService.updateAttendeeStatus(
    read.data.id,
    'approved'
  );
  console.log('Updated:', update);
}
```

#### Test 3: Settings Management
```javascript
// Get current settings
const isOpen = await settingsService.isRegistrationOpen();
const showSpeakers = await settingsService.isShowSpeakers();
console.log('Registrations open:', isOpen);
console.log('Show speakers:', showSpeakers);

// Toggle settings
await settingsService.setRegistrationOpen(!isOpen);
await settingsService.setShowSpeakers(!showSpeakers);

// Verify changes
const newIsOpen = await settingsService.isRegistrationOpen();
const newShowSpeakers = await settingsService.isShowSpeakers();
console.log('Changed:', newIsOpen !== isOpen, newShowSpeakers !== showSpeakers);

// Restore
await settingsService.setRegistrationOpen(isOpen);
await settingsService.setShowSpeakers(showSpeakers);
```

---

### ✅ Frontend/UI Tests

#### Test 4: Registration Form
1. Navigate to homepage
2. Click "Register" button
3. **Expected**: Registration form opens
4. Fill out form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "1234567890"
   - Age: 25
   - Occupation: "Student"
   - Motivation: "Interested in AI"
5. Submit form
6. **Expected**: 
   - Success message appears
   - Form clears
   - Can navigate to "My Ticket"

#### Test 5: Admin Dashboard
1. Navigate to `/admin/login`
2. Log in with admin credentials
3. **Expected**: Redirects to dashboard
4. Check "Seats Taken" card
5. **Expected**: Shows "X / 250"
6. Navigate to "Attendees" tab
7. **Expected**: List of attendees displayed
8. Find a pending attendee
9. Click "Approve"
10. **Expected**: 
    - Status changes to approved
    - List refreshes
    - Success notification appears

#### Test 6: Settings Panel
1. In Admin Dashboard, click "Settings" tab
2. **Expected**: Settings panel appears
3. Toggle "Registrations Open" switch
4. **Expected**: 
   - Switch toggles
   - Success message appears
   - Setting saved to database
5. Navigate to registration form
6. **Expected**: Form reflects the setting (open/closed)

#### Test 7: Ticket Checking
1. Navigate to `/check-ticket`
2. Enter email of pending attendee
3. Click "Search"
4. **Expected**: "Your application is under review."
5. Enter email of rejected attendee
6. **Expected**: "Application not accepted."
7. Enter email of approved attendee
8. **Expected**: 
   - Digital ticket displayed
   - QR code visible
   - Download PDF button available
9. Click "Download PDF"
10. **Expected**: PDF downloads with ticket

---

### ✅ End-to-End User Flows

#### Flow 1: Complete Registration → Approval → Ticket
1. User registers via form
2. **Expected**: Status = 'pending'
3. Admin logs in
4. Admin approves attendee
5. **Expected**: Status = 'approved'
6. User checks ticket
7. **Expected**: Ticket with QR code displayed
8. User downloads PDF
9. **Expected**: PDF file downloads

#### Flow 2: Capacity Management
1. Admin checks seats counter
2. **Expected**: Shows current count
3. Admin approves attendees until 250
4. **Expected**: Counter shows 250/250
5. User tries to register
6. **Expected**: "Registration Closed: Capacity Reached."
7. Admin closes registrations in Settings
8. **Expected**: Registration form shows closed message

#### Flow 3: Settings Control
1. Admin closes registrations
2. **Expected**: Registration form disabled
3. Admin hides speakers
4. **Expected**: Speakers section hidden on homepage
5. Admin opens registrations
6. **Expected**: Registration form enabled
7. Admin shows speakers
8. **Expected**: Speakers section visible

---

## Database Verification

### SQL Queries to Run in Supabase

```sql
-- 1. Check total attendees
SELECT COUNT(*) as total FROM attendees;

-- 2. Check by status
SELECT status, COUNT(*) as count 
FROM attendees 
GROUP BY status;

-- 3. Check capacity
SELECT 
  COUNT(*) as current,
  250 as capacity,
  CASE 
    WHEN COUNT(*) >= 250 THEN 'FULL'
    ELSE 'AVAILABLE'
  END as status
FROM attendees;

-- 4. Check settings
SELECT * FROM site_settings;

-- 5. Check recent registrations
SELECT name, email, status, created_at 
FROM attendees 
ORDER BY created_at DESC 
LIMIT 10;

-- 6. Verify admin users
SELECT id, email, role 
FROM users 
WHERE role = 'admin';
```

---

## Performance Testing

### Load Test Script

```javascript
// Test concurrent registrations
async function loadTest() {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      registrationService.submitAttendee({
        name: `Load Test ${i}`,
        email: `loadtest${i}@example.com`,
        phone: `123456789${i}`,
        age: 25,
        occupation: 'Student',
        motivation: 'Load test'
      })
    );
  }
  
  const results = await Promise.all(promises);
  const successCount = results.filter(r => r.success).length;
  console.log(`Success: ${successCount}/10`);
}

loadTest();
```

---

## Browser Console Test Commands

```javascript
// Quick capacity check
registrationService.getTotalAttendeeCount().then(console.log);

// Quick settings check
settingsService.isRegistrationOpen().then(console.log);
settingsService.isShowSpeakers().then(console.log);

// Find specific attendee
registrationService.findAttendeeByEmail('user@example.com').then(console.log);

// Check all attendees
registrationService.getAllAttendees().then(r => console.log(r.data?.length));
```

---

## Test Results Template

```
Test Date: __________
Tester: __________
Browser: __________
OS: __________

✅ Registration Capacity: PASS / FAIL
✅ Admin Dashboard: PASS / FAIL
✅ Approval Workflow: PASS / FAIL
✅ Settings Panel: PASS / FAIL
✅ Ticket System: PASS / FAIL
✅ QR Code: PASS / FAIL
✅ PDF Download: PASS / FAIL
✅ Admin Auth: PASS / FAIL

Notes:
_________________________________
_________________________________
```

---

## Automated Test Summary

Run: `npm test` to see automated test results.

**Current Status:**
- ✅ Service tests: Mostly passing
- ⚠️ Component tests: Some need fixes
- ✅ Integration tests: Structure in place

**Manual Testing Required:**
- Real database operations
- Cross-browser testing
- Performance testing
- User acceptance testing
