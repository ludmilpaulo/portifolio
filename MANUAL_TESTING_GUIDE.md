# Manual Testing Guide - Real User Login Flow

## 🎯 Testing Overview

This guide will help you test the login system like a real user would, verifying all error messages and success flows.

---

## 📋 Prerequisites

### 1. Start Backend Server (if testing locally)

```bash
cd C:\Users\ludmi\OneDrive\Desktop\Codes\ludmilportifolio
python manage.py runserver
```

Backend should run on: `http://localhost:8000`

**OR** use production backend: `https://ludmil.pythonanywhere.com`

### 2. Start Frontend Server

```bash
cd C:\Users\ludmi\OneDrive\Desktop\Codes\portifolio
yarn dev
```

Frontend should run on: `http://localhost:3000`

---

## 🧪 Test Scenarios

### Test 1: ✅ Valid Admin Login

**Steps:**
1. Open browser and go to: `http://localhost:3000/admin-login`
2. Enter username: `ludmil`
3. Enter password: `Maitland@2026`
4. Click "Sign In"

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to `/dashboard`
- ✅ No error messages displayed
- ✅ User is authenticated (can see admin dashboard)

**Verification:**
- Check browser console (F12) - no errors
- Check localStorage - should have `authToken` and `userData`
- URL should change to `/dashboard`

---

### Test 2: ❌ Invalid Username (Does Not Exist)

**Steps:**
1. Go to: `http://localhost:3000/admin-login`
2. Enter username: `nonexistent_user_12345`
3. Enter password: `AnyPassword123!`
4. Click "Sign In"

**Expected Result:**
- ❌ Login fails
- ✅ Red error alert appears
- ✅ Error message: **"Username or email does not exist. Please check your credentials."**
- ✅ Stays on login page (no redirect)
- ✅ Form fields remain filled (username stays)

**Verification:**
- Error message is clear and specific
- No generic "Invalid credentials" message
- User knows exactly what's wrong

---

### Test 3: ❌ Valid Username but Wrong Password

**Steps:**
1. Go to: `http://localhost:3000/admin-login`
2. Enter username: `ludmil`
3. Enter password: `WrongPassword123!`
4. Click "Sign In"

**Expected Result:**
- ❌ Login fails
- ✅ Red error alert appears
- ✅ Error message: **"Incorrect password. Please try again or use 'Forgot password' to reset it."**
- ✅ Stays on login page
- ✅ Password field is cleared (security)
- ✅ Username field remains filled

**Verification:**
- Error message clearly states it's a password issue
- Suggests using "Forgot password" link
- User understands the problem

---

### Test 4: ✅ Valid Client Login

**Steps:**
1. Go to: `http://localhost:3000/client-login`
2. Enter email: `client1@example.com`
3. Enter password: `Client123!`
4. Click "Access Dashboard"

**Expected Result:**
- ✅ Login succeeds
- ✅ Redirects to `/dashboard/client`
- ✅ No error messages
- ✅ Client dashboard is displayed

---

### Test 5: ❌ Invalid Client Email

**Steps:**
1. Go to: `http://localhost:3000/client-login`
2. Enter email: `nonexistent@example.com`
3. Enter password: `AnyPassword123!`
4. Click "Access Dashboard"

**Expected Result:**
- ❌ Login fails
- ✅ Error message: **"Email does not exist. Please check your email or contact support."**
- ✅ Clear, specific error message

---

### Test 6: ❌ Valid Client Email but Wrong Password

**Steps:**
1. Go to: `http://localhost:3000/client-login`
2. Enter email: `client1@example.com`
3. Enter password: `WrongPassword123!`
4. Click "Access Dashboard"

**Expected Result:**
- ❌ Login fails
- ✅ Error message: **"Incorrect password. Please try again or use 'Forgot password' to reset it."**
- ✅ Clear guidance provided

---

## 🔍 What to Check

### Error Messages

✅ **Good Error Messages:**
- Specific: "Username or email does not exist" (not "Invalid credentials")
- Actionable: "Use 'Forgot password' to reset it"
- Clear: User knows exactly what went wrong

❌ **Bad Error Messages:**
- Generic: "Login failed" or "Invalid credentials"
- Vague: "Something went wrong"
- No guidance: Doesn't tell user what to do

### Visual Feedback

✅ **What to Verify:**
- Error messages appear in red/error-styled alert box
- Error messages are readable (proper font size, contrast)
- Error messages don't disappear immediately (user can read them)
- Loading spinner shows during login attempt
- Buttons are disabled during login (prevent double-submit)

### User Experience

✅ **UX Checks:**
- Password field is cleared after wrong password (security)
- Username field stays filled (convenience)
- "Forgot password" link is visible and clickable
- Form validation works (can't submit empty fields)
- Back navigation works (can go back to home page)

---

## 📱 Browser Console Checks

Open Developer Tools (F12) and check:

1. **No JavaScript Errors:**
   - Console should be clean (no red errors)
   - Network tab should show successful API calls (status 200/401, not 500)

2. **API Request/Response:**
   - Open Network tab → Filter "graphql"
   - Click "Sign In"
   - Check the request payload: `{type: 'login', data: {username, password}}`
   - Check the response:
     - Success: `{success: true, data: {token, user}}`
     - Failure: `{success: false, error: "...", error_code: "..."}`

3. **Storage:**
   - Application tab → Local Storage
   - After successful login: Should have `authToken` and `userData`
   - After failed login: Should NOT have these tokens

---

## 🐛 Troubleshooting

### Issue: No error message appears

**Check:**
- Open browser console (F12) for JavaScript errors
- Check Network tab - is API call being made?
- Verify error is being returned from backend

### Issue: Generic error message

**Check:**
- Backend is returning `error_code` in response
- Frontend is checking `errorCode` correctly
- Error message mapping is correct in login pages

### Issue: Can't login even with correct credentials

**Check:**
- Backend server is running
- Database has the user (run `python setup_users.py`)
- User is active (not disabled)
- CORS is configured correctly

---

## ✅ Success Criteria

All tests pass if:

1. ✅ Valid login works correctly
2. ✅ Invalid username shows "does not exist" message
3. ✅ Wrong password shows "incorrect password" message
4. ✅ Error messages are clear and specific
5. ✅ Error messages are user-friendly
6. ✅ No JavaScript errors in console
7. ✅ Proper redirects after successful login
8. ✅ No redirects after failed login
9. ✅ Loading states work correctly
10. ✅ Form validation works

---

## 🚀 Automated Testing

Run automated tests:

```bash
cd C:\Users\ludmi\OneDrive\Desktop\Codes\portifolio
node test_login_flow.js
```

This will test:
- Backend API directly
- Frontend API route
- All error scenarios
- Error code verification

---

## 📝 Test Checklist

- [ ] Test 1: Valid admin login
- [ ] Test 2: Invalid username
- [ ] Test 3: Wrong password
- [ ] Test 4: Valid client login
- [ ] Test 5: Invalid client email
- [ ] Test 6: Wrong client password
- [ ] Check error message clarity
- [ ] Check visual feedback
- [ ] Check browser console
- [ ] Check network requests
- [ ] Check localStorage
- [ ] Test on different browsers (Chrome, Firefox, Safari)

---

**Happy Testing! 🎉**

