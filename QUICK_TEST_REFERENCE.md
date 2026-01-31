# Quick Test Reference Card

## 🚀 Quick Start

```bash
# 1. Start dev server
npm run dev

# 2. Run automated tests
npm test

# 3. Open browser console (F12) and run:
runAllTests()
```

---

## ✅ Test All Features in 5 Minutes

### 1. Registration Capacity (30 seconds)
```javascript
// Browser console
registrationService.getTotalAttendeeCount()
  .then(c => console.log(`Count: ${c.count}/250`));
```

### 2. Submit Registration (1 minute)
- Go to homepage → Click "Register"
- Fill form → Submit
- **Expected**: Success message or capacity error

### 3. Admin Approval (1 minute)
- Go to `/admin/login` → Login
- Go to "Attendees" tab
- Click "Approve" on pending attendee
- **Expected**: Status changes, list refreshes

### 4. Settings Toggle (30 seconds)
- Admin Dashboard → "Settings" tab
- Toggle "Registrations Open"
- **Expected**: Toggle switches, success message

### 5. Ticket Check (1 minute)
- Go to `/check-ticket`
- Enter approved attendee email
- **Expected**: Ticket with QR code displayed
- Click "Download PDF"
- **Expected**: PDF downloads

---

## 🔍 Quick Verification Commands

```javascript
// Check capacity
registrationService.getTotalAttendeeCount().then(console.log);

// Check settings
settingsService.isRegistrationOpen().then(console.log);

// Find attendee
registrationService.findAttendeeByEmail('email@example.com').then(console.log);

// Test complete flow
testHelpers.testRegistrationFlow();
```

---

## 📋 Test Checklist

- [ ] Registration works (< 250)
- [ ] Capacity blocks (>= 250)
- [ ] Admin can approve
- [ ] Admin can reject
- [ ] Settings toggle works
- [ ] Ticket search works
- [ ] QR code generates
- [ ] PDF downloads

---

## 🎯 All Tests Pass When:

✅ Services return correct data
✅ Components render correctly
✅ User interactions work
✅ Database operations succeed
✅ Error handling works
✅ UI updates correctly

---

**For detailed testing, see:**
- `TESTING_GUIDE.md` - Complete manual guide
- `REAL_TIME_TESTING.md` - Real-time testing
- `COMPREHENSIVE_TEST_SUMMARY.md` - Full summary
