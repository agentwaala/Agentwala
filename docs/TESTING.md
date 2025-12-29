# Testing Guide

## Overview

This document covers how to test all features of the Agentwaala platform.

---

## Pre-requisites

### 1. Set Up Google OAuth

Before testing authentication:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Configure in Lovable Cloud → Authentication → Providers → Google
4. Add redirect URL: `https://[your-project].supabase.co/auth/v1/callback`

### 2. Create Test Accounts

You'll need at least 3 Google accounts to test all roles:
- **Customer Test Account** (e.g., customer.test@gmail.com)
- **Agent Test Account** (e.g., agent.test@gmail.com)
- **Admin Test Account** (e.g., admin.test@gmail.com)

---

## Test Scenarios

### 1. Authentication Flow

#### Test 1.1: New User Signup
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open app, click "Get Started" | Redirected to /auth page |
| 2 | Click "Continue with Google" | Google OAuth popup appears |
| 3 | Complete Google sign-in | Redirected to /select-role |
| 4 | Select "Customer" | Redirected to /customer-dashboard |

#### Test 1.2: Returning User Login
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Log in" | Redirected to /auth |
| 2 | Sign in with existing Google account | Redirected to appropriate dashboard |

#### Test 1.3: Sign Out
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click avatar in navbar | Dropdown menu appears |
| 2 | Click "Sign out" | Signed out, redirected to homepage |
| 3 | Click "Log in" | Can sign in again |

---

### 2. Customer Features

#### Test 2.1: Browse Agents
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to /agents | Agent listing page loads |
| 2 | Use search box | Results filter by name |
| 3 | Select domain filter | Results filter by category |
| 4 | Clear filters | All agents shown |

#### Test 2.2: Location Filtering (Homepage)
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Scroll to "Near You" section | Location filters visible |
| 2 | Select a State | Districts populate |
| 3 | Select a District | Localities populate |
| 4 | Click "Auto-detect My Location" | GPS permission requested |
| 5 | Allow permission | Location auto-fills |
| 6 | Deny permission | Error message shown |

#### Test 2.3: Customer Dashboard
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Login as Customer | Dashboard loads |
| 2 | Check "Call History" | Empty state if no calls |
| 3 | Check "Saved Agents" | Empty state if none saved |
| 4 | Select location preference | Preference saved |

---

### 3. Agent Features

#### Test 3.1: Agent Signup
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign up with new Google account | /select-role page |
| 2 | Select "Agent" | Redirected to /agent-dashboard |
| 3 | Check profile status | "Complete your profile" warning shown |

#### Test 3.2: Complete Agent Profile
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click "Edit Profile" | Form becomes editable |
| 2 | Fill in Full Name | Required field |
| 3 | Fill in Phone Number | Required field |
| 4 | Select State | District dropdown populates |
| 5 | Select City | Required field |
| 6 | Select Category | Required field |
| 7 | Add Bio (optional) | Textarea accepts input |
| 8 | Click "Save Changes" | Profile saved, success toast |
| 9 | Check warning banner | Should disappear if complete |

#### Test 3.3: Availability Toggle
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | With incomplete profile | Toggle is disabled |
| 2 | Complete profile first | Toggle becomes enabled |
| 3 | Toggle ON | Status shows "Available Now" |
| 4 | Toggle OFF | Status shows "Currently Unavailable" |

#### Test 3.4: Agent Dashboard Stats
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Check Statistics section | Shows Total Calls, Reviews, Avg Rating |
| 2 | Check Recent Leads | Shows call history or empty state |
| 3 | Check Verification Status | Shows Pending or Verified |
| 4 | Check Premium Status | Shows "Free for now" |

---

### 4. Admin Features

#### Test 4.1: Create Admin Account
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Sign up normally as Customer/Agent | Account created |
| 2 | Run SQL in database: | |
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('<your-user-id>', 'admin');
```
| 3 | Sign out and sign in again | Redirected to /admin |

#### Test 4.2: Admin Dashboard Overview
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Access /admin | Dashboard loads |
| 2 | Check stats cards | Shows Total Users, Agents, Active, Customers |
| 3 | Click "Approvals" tab | Shows pending agents |
| 4 | Click "All Agents" tab | Shows all registered agents |

#### Test 4.3: Verify an Agent
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Create test agent with complete profile | Agent appears in Approvals |
| 2 | Click "Verify" button | Agent marked as verified |
| 3 | Check agent profile | Blue verification badge visible |

#### Test 4.4: Grant Premium Status
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Find agent in All Agents tab | Agent row visible |
| 2 | Click Crown (Premium) button | Premium status granted |
| 3 | Check agent profile | Gold premium badge visible |

---

### 5. Protected Routes

#### Test 5.1: Unauthenticated Access
| URL | Expected Behavior |
|-----|-------------------|
| /customer-dashboard | Redirect to /auth |
| /agent-dashboard | Redirect to /auth |
| /admin | Redirect to /auth |

#### Test 5.2: Wrong Role Access
| User Role | Tries to Access | Expected Behavior |
|-----------|-----------------|-------------------|
| Customer | /agent-dashboard | Redirect to /customer-dashboard |
| Customer | /admin | Redirect to /customer-dashboard |
| Agent | /customer-dashboard | Redirect to /agent-dashboard |
| Agent | /admin | Redirect to /agent-dashboard |
| Admin | /customer-dashboard | Redirect to /admin |
| Admin | /agent-dashboard | Redirect to /admin |

---

### 6. Review System

#### Test 6.1: Submit Review
| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | As Customer, go to Dashboard | Call history visible |
| 2 | Find unrated call | "Rate" button visible |
| 3 | Click "Rate" | Star selector appears |
| 4 | Click on 4th star | 4-star rating submitted |
| 5 | Check rating display | Shows 4 filled stars |

#### Test 6.2: Review Restrictions
| Scenario | Expected Behavior |
|----------|-------------------|
| Agent tries to review | No review option available |
| Customer reviews twice | Only one review per agent allowed |
| Submit without clicking stars | Nothing happens |

---

### 7. Responsive Design

Test on different screen sizes:

| Breakpoint | Width | Components to Check |
|------------|-------|---------------------|
| Mobile | 375px | Hamburger menu, stacked cards |
| Tablet | 768px | 2-column layouts |
| Desktop | 1280px | Full layout, sidebar visible |

---

### 8. Dark/Light Mode

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Click theme toggle in navbar | Theme switches |
| 2 | Check all pages | Colors adapt correctly |
| 3 | Check contrast | Text remains readable |
| 4 | Refresh page | Theme persists |

---

## Database Testing

### Check RLS Policies

```sql
-- Test as authenticated user
SELECT * FROM agents; -- Should only see own or public agents

-- Test reviews policy
INSERT INTO reviews (customer_id, agent_id, stars)
VALUES (auth.uid(), '<agent-id>', 5);
-- Should work only for customers
```

### Verify Triggers

```sql
-- Create user and check profile auto-creation
-- Check updated_at timestamps change on update
```

---

## Common Issues & Debugging

### Auth Not Working
- Check Google OAuth configuration
- Verify redirect URLs
- Check browser console for errors

### Agents Not Showing
- Verify `profile_complete` is true
- Check RLS policies
- Ensure at least one agent exists

### Location Detection Fails
- Ensure HTTPS (required for Geolocation API)
- Check if location is within India bounds
- Verify browser permissions

### Dashboard Redirecting Incorrectly
- Check `user_roles` table for correct role
- Clear browser cache/cookies
- Sign out and back in

---

## Test Checklist

```
[ ] Authentication
    [ ] Google OAuth signup
    [ ] Google OAuth login
    [ ] Sign out
    [ ] Session persistence

[ ] Customer Features
    [ ] Browse agents
    [ ] Filter agents
    [ ] Save agents
    [ ] View dashboard
    [ ] Submit ratings

[ ] Agent Features
    [ ] Complete profile
    [ ] Toggle availability
    [ ] View call history
    [ ] Edit profile

[ ] Admin Features
    [ ] View overview stats
    [ ] Approve agents
    [ ] Grant verification
    [ ] Grant premium status

[ ] Protected Routes
    [ ] Auth redirect
    [ ] Role-based access

[ ] UI/UX
    [ ] Responsive design
    [ ] Dark/Light mode
    [ ] Loading states
    [ ] Error handling
    [ ] Toast notifications
```
