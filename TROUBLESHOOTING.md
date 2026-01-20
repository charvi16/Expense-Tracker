# Troubleshooting Guide - Authentication & Database Issues

## Problem Summary
- "User already exists" on signup despite first login attempt
- "Invalid credentials" on login
- Dashboard not opening
- No documents in MongoDB Compass User collection

## Root Causes Fixed ✅

### 1. **Database Name Mismatch**
- **Problem**: `.env` had `expenseTRacker` (wrong case)
- **Solution**: Changed to `expensetrackerai` (lowercase, consistent)
- **File**: `backend/.env`

### 2. **Missing User Model Fields**
- **Problem**: User model was missing `image` and `income` fields that the profile page expects
- **Solution**: Added these fields to User schema with proper defaults
- **File**: `backend/src/models/User.js`

### 3. **Profile Controller Bug**
- **Problem**: `income` was being saved to `monthlyIncome` but profile page expects `income`
- **Solution**: Updated to save to both `income` and `monthlyIncome`
- **File**: `backend/src/controllers/profileController.js`

## Step-by-Step Fix Instructions

### Step 1: Ensure MongoDB is Running
```powershell
# Check if MongoDB is running
mongosh --version

# If not installed, install MongoDB Community Edition
# Or use MongoDB Atlas (cloud)
```

### Step 2: Clear Old Test Data (Optional but Recommended)
```powershell
# Open MongoDB Compass
# Connect to: mongodb://127.0.0.1:27017
# Delete the 'expensetrackerai' database to start fresh
# Or drop the 'users' collection
```

### Step 3: Restart Backend Server
```powershell
cd C:\Users\kruti\my-project\Expense-Tracker\backend
npm install  # Ensure all dependencies are installed
npm start    # This will use the updated .env file
```

### Step 4: Create New Account
- Go to http://localhost:5173
- Click "Sign Up"
- Enter: Name, Email, Password
- Click "Create Account"
- You should now be logged in and redirected to Dashboard

### Step 5: Verify in MongoDB Compass
- Open MongoDB Compass
- Connect to: `mongodb://127.0.0.1:27017`
- Navigate to: `expensetrackerai` → `users`
- You should see your new user document with:
  - `_id`, `name`, `email`, `password` (hashed), `image`, `currency`, `income`, `monthlyBudget`

## What Was Changed

### `.env` File
```diff
- MONGO_URI=mongodb://127.0.0.1:27017/expenseTRacker
+ MONGO_URI=mongodb://127.0.0.1:27017/expensetrackerai
+ DB_NAME=expensetrackerai
+ PORT=5000
+ GROQ_API_KEY=your_groq_api_key_here
```

### User Model (`backend/src/models/User.js`)
```javascript
// Added missing fields:
image: { type: String, default: "/default-profile.png" },
income: { type: Number, default: 0 },

// Kept existing fields for backward compatibility:
monthlyIncome: { type: Number, default: 0 },
```

### Profile Controller (`backend/src/controllers/profileController.js`)
```javascript
// Now correctly saves income to both fields:
req.user.income = income ?? req.user.income;
req.user.monthlyIncome = income ?? req.user.monthlyIncome;
```

## Testing the Flow

### Sign Up Test
1. **Frontend**: Enter new email and password
2. **Backend**: Creates user with hashed password
3. **Database**: User appears in MongoDB
4. **Response**: Returns JWT token, logs in automatically

### Login Test
1. **Frontend**: Enter registered email and password
2. **Backend**: Finds user, compares password hash
3. **Database**: Password comparison should succeed
4. **Response**: Returns JWT token, opens Dashboard

### Profile Test
1. **Dashboard**: Click on Profile
2. **API Call**: GET `/api/profile` with JWT token
3. **Database**: Retrieves user data
4. **UI**: Shows name, currency, income, budget with all new fields

## Common Issues & Solutions

### Issue: Still getting "User already exists"
**Solution**: Delete the old database in MongoDB Compass and sign up with new email/password

### Issue: "Invalid credentials" on correct password
**Solution**: 
1. Delete the database
2. Restart backend server
3. Create fresh account

### Issue: MongoDB connection error
**Solution**:
1. Check if MongoDB is running: `mongosh`
2. Verify `.env` has correct `MONGO_URI`
3. Check firewall isn't blocking port 27017

### Issue: Dashboard still doesn't open
**Solution**:
1. Check browser console for errors (F12 → Console)
2. Check terminal for backend errors
3. Verify JWT token is being sent in requests

## Files Modified
- ✅ `backend/.env` - Fixed database name
- ✅ `backend/src/models/User.js` - Added missing fields
- ✅ `backend/src/controllers/profileController.js` - Fixed field mapping
- ✅ `frontend/src/pages/Profile/Profile.jsx` - Enhanced UI (previous task)
- ✅ `frontend/src/pages/Profile/Profile.css` - Enhanced styling (previous task)
- ✅ `frontend/package.json` - Added start script

## Next Steps
If issues persist:
1. Check backend console logs for specific errors
2. Open browser Developer Tools (F12) → Network tab
3. Check API responses for error messages
4. Verify all dependencies installed: `npm install`
5. Try clearing browser cache and localStorage
