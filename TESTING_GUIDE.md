# Comprehensive Testing Guide

## Test Suite Overview

This document provides a complete testing guide for the Baghdad AI Summit application, covering unit tests, integration tests, and manual testing procedures.

## Automated Tests

### Test Files Created

1. **Service Tests**
   - `src/services/__tests__/registrationService.test.ts` - Registration service logic
   - `src/services/__tests__/settingsService.test.ts` - Settings service logic

2. **Component Tests**
   - `src/pages/__tests__/CheckTicket.test.tsx` - Ticket checking component
   - `src/pages/__tests__/AdminDashboard.test.tsx` - Admin dashboard component
   - `src/components/forms/__tests__/GeneralRegistrationForm.test.tsx` - Registration form

3. **Integration Tests**
   - `src/test/integration/end-to-end.test.ts` - Complete user flows

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

---

## Manual Testing Guide

### Prerequisites

1. **Environment Setup**
   ```bash
   # Ensure .env file exists with:
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Database Setup**
   - Ensure Supabase tables exist:
     - `attendees`
     - `site_settings`
     - `users`
   - Create at least one admin user in `users` table with `role = 'admin'`

---

## Test Scenarios

### 1. Registration Capacity Check

**Test Case 1.1: Normal Registration (< 250 attendees)**
1. Navigate to registration form
2. Fill out all required fields
3. Submit the form
4. **Expected**: Form submits successfully, shows success message, form clears

**Test Case 1.2: Capacity Reached (>= 250 attendees)**
1. Ensure database has 250+ attendees
2. Navigate to registration form
3. Fill out all required fields
4. Submit the form
5. **Expected**: Shows error "Registration Closed: Capacity Reached.", form does not submit

**Test Case 1.3: Registration Closed via Settings**
1. In Admin Dashboard → Settings tab
2. Toggle "Registrations Open" to OFF
3. Navigate to registration form
4. **Expected**: Shows "Registrations Closed" message, form is disabled

---

### 2. Admin Dashboard - Seats Counter

**Test Case 2.1: Display Seats Counter**
1. Log in as admin
2. Navigate to Admin Dashboard
3. **Expected**: See "Seats Taken: X / 250" card at top of dashboard

**Test Case 2.2: Counter Updates**
1. Approve a pending attendee
2. **Expected**: Seats counter updates immediately

**Test Case 2.3: Full Capacity Warning**
1. Ensure 250+ attendees exist
2. View dashboard
3. **Expected**: Counter shows red warning, "Maximum capacity reached"

---

### 3. Attendee Approval Workflow

**Test Case 3.1: Approve Pending Attendee**
1. Log in as admin
2. Navigate to Attendees tab
3. Find a pending attendee
4. Click "Approve" button
5. **Expected**: 
   - Status changes to "approved"
   - List refreshes automatically
   - Success toast notification appears

**Test Case 3.2: Reject Pending Attendee**
1. Log in as admin
2. Navigate to Attendees tab
3. Find a pending attendee
4. Click "Reject" button
5. **Expected**: 
   - Status changes to "rejected"
   - List refreshes automatically
   - Success toast notification appears

**Test Case 3.3: Buttons Visibility**
1. Log in as admin
2. Navigate to Attendees tab
3. **Expected**: 
   - Pending attendees show "Approve" and "Reject" buttons
   - Approved/Rejected attendees show "Reset" button only

---

### 4. Settings Control Panel

**Test Case 4.1: Toggle Registrations Open/Closed**
1. Log in as admin
2. Navigate to Settings tab
3. Toggle "Registrations Open" switch
4. **Expected**: 
   - Toggle updates immediately
   - Success message appears
   - Public registration form reflects the change

**Test Case 4.2: Toggle Show Speakers**
1. Log in as admin
2. Navigate to Settings tab
3. Toggle "Show Speakers" switch to OFF
4. Navigate to homepage
5. **Expected**: Speakers section is hidden
6. Toggle back to ON
7. **Expected**: Speakers section appears

---

### 5. Ticket Checking System

**Test Case 5.1: Search Pending Ticket**
1. Navigate to "Check Ticket" page
2. Enter email of pending attendee
3. Click Search
4. **Expected**: Shows "Your application is under review." message

**Test Case 5.2: Search Rejected Ticket**
1. Navigate to "Check Ticket" page
2. Enter email of rejected attendee
3. Click Search
4. **Expected**: Shows "Application not accepted." message

**Test Case 5.3: Search Approved Ticket**
1. Navigate to "Check Ticket" page
2. Enter email of approved attendee
3. Click Search
4. **Expected**: 
   - Shows digital ticket
   - QR code is displayed
   - Download PDF button is available

**Test Case 5.4: QR Code Generation**
1. Search for approved attendee
2. **Expected**: 
   - QR code appears on ticket
   - QR code contains attendee ID or email
   - QR code is scannable

**Test Case 5.5: PDF Download**
1. Search for approved attendee
2. Click "Download Ticket (PDF)" button
3. **Expected**: 
   - PDF is generated
   - PDF contains ticket design
   - PDF includes QR code
   - Filename includes attendee name

**Test Case 5.6: Invalid Email**
1. Navigate to "Check Ticket" page
2. Enter non-existent email
3. Click Search
4. **Expected**: Shows "No Application Found" message

---

### 6. Admin Authentication

**Test Case 6.1: Successful Admin Login**
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Click Sign In
4. **Expected**: 
   - Redirects to admin dashboard
   - Admin session is established
   - Can access all admin features

**Test Case 6.2: Non-Admin User Rejection**
1. Navigate to `/admin/login`
2. Enter non-admin user credentials
3. Click Sign In
4. **Expected**: 
   - Shows error message
   - User is signed out automatically
   - Cannot access admin dashboard

**Test Case 6.3: Invalid Credentials**
1. Navigate to `/admin/login`
2. Enter invalid credentials
3. Click Sign In
4. **Expected**: Shows error message, account locks after 5 attempts

---

### 7. Database Operations

**Test Case 7.1: Create Attendee**
1. Submit registration form
2. Check Supabase `attendees` table
3. **Expected**: New row created with status='pending'

**Test Case 7.2: Update Attendee Status**
1. Approve an attendee in admin dashboard
2. Check Supabase `attendees` table
3. **Expected**: Status updated to 'approved', updated_at timestamp changed

**Test Case 7.3: Settings Update**
1. Toggle a setting in admin dashboard
2. Check Supabase `site_settings` table
3. **Expected**: Setting value updated, updated_at timestamp changed

---

## API/Endpoint Testing

### Registration Service Endpoints

```javascript
// Test in browser console or Postman

// 1. Get Total Count
const count = await registrationService.getTotalAttendeeCount();
console.log('Total attendees:', count);

// 2. Submit Attendee
const result = await registrationService.submitAttendee({
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  age: 25,
  occupation: 'Student',
  motivation: 'Interested in AI'
});
console.log('Submit result:', result);

// 3. Find Attendee
const attendee = await registrationService.findAttendeeByEmail('test@example.com');
console.log('Found attendee:', attendee);

// 4. Update Status
const update = await registrationService.updateAttendeeStatus('attendee-id', 'approved');
console.log('Update result:', update);
```

### Settings Service Endpoints

```javascript
// 1. Get Setting
const setting = await settingsService.getSetting('registrations_open');
console.log('Registration status:', setting);

// 2. Update Setting
const update = await settingsService.setRegistrationOpen(false);
console.log('Update result:', update);

// 3. Check Status
const isOpen = await settingsService.isRegistrationOpen();
console.log('Is registration open?', isOpen);
```

---

## UI/UX Testing Checklist

### Visual Testing

- [ ] **Responsive Design**: Test on mobile, tablet, desktop
- [ ] **Theme Switching**: Light/Dark mode works correctly
- [ ] **Language Switching**: English/Arabic translations work
- [ ] **Loading States**: Spinners show during async operations
- [ ] **Error Messages**: Clear, user-friendly error messages
- [ ] **Success Messages**: Toast notifications appear correctly
- [ ] **Form Validation**: Real-time validation feedback
- [ ] **Button States**: Disabled states work correctly
- [ ] **Color Coding**: Status colors (green/red/amber) are correct

### Interaction Testing

- [ ] **Form Submission**: Forms submit correctly
- [ ] **Button Clicks**: All buttons respond correctly
- [ ] **Navigation**: All links navigate correctly
- [ ] **Modal Dialogs**: Open/close correctly
- [ ] **Dropdowns**: Select options work
- [ ] **Toggles**: Settings toggles switch correctly
- [ ] **Search**: Search functionality works
- [ ] **Pagination**: Page navigation works

---

## Database Testing

### Direct Database Queries (Supabase SQL Editor)

```sql
-- 1. Check total attendees
SELECT COUNT(*) FROM attendees;

-- 2. Check capacity limit
SELECT COUNT(*) FROM attendees WHERE COUNT(*) >= 250;

-- 3. Check pending attendees
SELECT * FROM attendees WHERE status = 'pending';

-- 4. Check approved attendees
SELECT * FROM attendees WHERE status = 'approved';

-- 5. Check settings
SELECT * FROM site_settings;

-- 6. Check admin users
SELECT * FROM users WHERE role = 'admin';

-- 7. Test capacity check
SELECT 
  CASE 
    WHEN COUNT(*) >= 250 THEN 'FULL'
    ELSE 'AVAILABLE'
  END as capacity_status,
  COUNT(*) as current_count
FROM attendees;
```

---

## Performance Testing

### Load Testing

1. **Registration Form**
   - Test with 100+ concurrent submissions
   - Monitor database performance
   - Check for race conditions

2. **Admin Dashboard**
   - Load with 1000+ attendees
   - Test pagination performance
   - Check search performance

3. **Ticket Search**
   - Test with high volume of searches
   - Monitor query performance

---

## Security Testing

### Authentication

- [ ] Admin login requires valid credentials
- [ ] Non-admin users cannot access admin routes
- [ ] Session expires after timeout
- [ ] Password is not exposed in network requests

### Authorization

- [ ] Only admins can approve/reject attendees
- [ ] Only admins can change settings
- [ ] Regular users cannot access admin dashboard

### Data Validation

- [ ] Email validation works
- [ ] Required fields are enforced
- [ ] SQL injection prevention
- [ ] XSS prevention

---

## Browser Compatibility

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

---

## Real-Time Testing Script

Create a test script to run in browser console:

```javascript
// Complete Registration Flow Test
async function testRegistrationFlow() {
  console.log('🧪 Starting Registration Flow Test...');
  
  // 1. Check capacity
  const count = await registrationService.getTotalAttendeeCount();
  console.log('📊 Current count:', count.count);
  
  // 2. Submit registration
  const submitResult = await registrationService.submitAttendee({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    phone: '1234567890',
    age: 25,
    occupation: 'Student',
    motivation: 'Testing'
  });
  console.log('✅ Submit result:', submitResult);
  
  // 3. Find attendee
  if (submitResult.success) {
    const found = await registrationService.findAttendeeByEmail(submitResult.data.email);
    console.log('🔍 Found attendee:', found);
  }
  
  console.log('✅ Registration Flow Test Complete!');
}

// Run test
testRegistrationFlow();
```

---

## Test Results Summary

### ✅ Passing Tests
- Service unit tests (basic functionality)
- Component rendering tests
- Integration test structure

### ⚠️ Needs Fixing
- Some component tests need better mocking
- AdminDashboard hook ordering issue
- Form component tests need async handling

### 📝 Manual Testing Required
- Real database operations
- End-to-end user flows
- Cross-browser compatibility
- Performance under load

---

## Next Steps

1. **Fix Test Issues**: Address hook ordering and mocking issues
2. **Add More Tests**: Expand coverage for edge cases
3. **E2E Testing**: Set up Playwright or Cypress for full E2E tests
4. **Performance Tests**: Add load testing
5. **Accessibility Tests**: Add a11y testing

---

## Quick Test Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- CheckTicket.test.tsx

# Run with coverage
npm run test:coverage

# Run in watch mode
npm test -- --watch
```

---

## Test Coverage Goals

- **Services**: 90%+ coverage
- **Components**: 80%+ coverage
- **Integration**: 70%+ coverage
- **E2E**: Critical paths covered

---

## Reporting Issues

When reporting test failures, include:
1. Test file name
2. Test case name
3. Expected behavior
4. Actual behavior
5. Steps to reproduce
6. Browser/OS information
