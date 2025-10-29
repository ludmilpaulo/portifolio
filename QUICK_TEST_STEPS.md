# Quick Test Steps - Live User Testing

## 🚀 Quick Start

### Step 1: Start Servers

**Terminal 1 - Backend:**
```bash
cd C:\Users\ludmi\OneDrive\Desktop\Codes\ludmilportifolio
python manage.py runserver
```
✅ Should show: "Starting development server at http://127.0.0.1:8000/"

**Terminal 2 - Frontend:**
```bash
cd C:\Users\ludmi\OneDrive\Desktop\Codes\portifolio
yarn dev
```
✅ Should show: "Ready on http://localhost:3000"

---

## 📝 Test Checklist - Run These in Order

### ✅ Test 1: Valid Admin Login

1. Open browser: http://localhost:3000/admin-login
2. Enter Username: `ludmil`
3. Enter Password: `Maitland@2026`
4. Click "Sign In"

**Expected:**
- ✅ Redirects to `/dashboard`
- ✅ No error message
- ✅ Can see admin dashboard

**If it works:** ✅ Test 1 PASSED

---

### ❌ Test 2: User Does Not Exist

1. Go to: http://localhost:3000/admin-login
2. Enter Username: `fakeuser12345`
3. Enter Password: `AnyPassword123!`
4. Click "Sign In"

**Expected:**
- ❌ Red error box appears
- ✅ Message: **"Username or email does not exist. Please check your credentials."**
- ✅ Stays on login page
- ✅ Username field still has value

**If message is correct:** ✅ Test 2 PASSED

---

### ❌ Test 3: Wrong Password

1. Go to: http://localhost:3000/admin-login
2. Enter Username: `ludmil`
3. Enter Password: `WrongPassword123!`
4. Click "Sign In"

**Expected:**
- ❌ Red error box appears
- ✅ Message: **"Incorrect password. Please try again or use 'Forgot password' to reset it."**
- ✅ Stays on login page
- ✅ Password field is cleared (empty)
- ✅ Username field still has value

**If message is correct:** ✅ Test 3 PASSED

---

### ✅ Test 4: Valid Client Login

1. Go to: http://localhost:3000/client-login
2. Enter Email: `client1@example.com`
3. Enter Password: `Client123!`
4. Click "Access Dashboard"

**Expected:**
- ✅ Redirects to `/dashboard/client`
- ✅ No error message
- ✅ Can see client dashboard

**If it works:** ✅ Test 4 PASSED

---

### ❌ Test 5: Client Email Does Not Exist

1. Go to: http://localhost:3000/client-login
2. Enter Email: `fakeemail@example.com`
3. Enter Password: `AnyPassword123!`
4. Click "Access Dashboard"

**Expected:**
- ❌ Red error box appears
- ✅ Message: **"Email does not exist. Please check your email or contact support."**

**If message is correct:** ✅ Test 5 PASSED

---

### ❌ Test 6: Client Wrong Password

1. Go to: http://localhost:3000/client-login
2. Enter Email: `client1@example.com`
3. Enter Password: `WrongPassword123!`
4. Click "Access Dashboard"

**Expected:**
- ❌ Red error box appears
- ✅ Message: **"Incorrect password. Please try again or use 'Forgot password' to reset it."**

**If message is correct:** ✅ Test 6 PASSED

---

## 🔍 What to Look For

### Error Messages Quality

✅ **Good:**
- Specific: "Username or email does not exist"
- Clear: "Incorrect password"
- Helpful: "Use 'Forgot password' to reset it"

❌ **Bad:**
- Generic: "Invalid credentials" or "Login failed"
- Vague: "Something went wrong"

### Visual Feedback

✅ **Check:**
- Error appears in red/error-styled box
- Error stays visible (doesn't disappear immediately)
- Loading spinner shows while processing
- Button is disabled during login (can't click twice)
- Password field clears after wrong password
- Username stays filled (convenience)

---

## 🐛 If Tests Fail

### Test 1 Fails (Can't login with correct credentials)

**Check:**
1. Backend running? (http://localhost:8000)
2. User exists? Run: `python setup_users.py` in backend folder
3. Open browser console (F12) - any errors?

### Test 2 or 3 Fail (Wrong error message)

**Check:**
1. Open browser console (F12)
2. Check Network tab → Click "Sign In"
3. Look at response from `/api/graphql`
4. Should have `error_code` field
5. Check if frontend is reading it correctly

### No Error Message Shows

**Check:**
1. Browser console (F12) - JavaScript errors?
2. Network tab - is API call being made?
3. Does error appear for a split second then disappear?

---

## ✅ All Tests Pass?

If all 6 tests pass, your login system is working perfectly! 🎉

You can now:
- Deploy to production
- Share with users
- Be confident in the error handling

---

## 📸 Screenshots to Take

For documentation, take screenshots of:
1. ✅ Successful login (dashboard visible)
2. ❌ "User does not exist" error message
3. ❌ "Wrong password" error message
4. Loading state (spinner while processing)

---

**Happy Testing! 🚀**

