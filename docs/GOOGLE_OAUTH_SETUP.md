# Google OAuth Setup Guide

Complete step-by-step guide to enable Google Sign-In for Agentwaala.

---

## Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │────▶│   Google     │────▶│   Lovable    │
│  clicks      │     │   OAuth      │     │   Cloud      │
│  "Sign in"   │     │   Consent    │     │   Callback   │
└──────────────┘     └──────────────┘     └──────────────┘
```

---

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click **"New Project"**
4. Enter project name: `Agentwaala` (or your preferred name)
5. Click **"Create"**
6. Wait for project to be created, then select it

---

## Step 2: Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services → OAuth consent screen**
2. Select **"External"** user type (unless you have Google Workspace)
3. Click **"Create"**

### Fill in the form:

| Field | Value |
|-------|-------|
| App name | `Agentwaala` |
| User support email | Your email |
| App logo | Optional (can add later) |
| App domain | Your app URL (e.g., `your-project.lovable.app`) |
| Developer contact | Your email |

4. Click **"Save and Continue"**

### Scopes:
1. Click **"Add or Remove Scopes"**
2. Select these scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
3. Click **"Update"**
4. Click **"Save and Continue"**

### Test Users (for development):
1. Click **"Add Users"**
2. Add your test email addresses
3. Click **"Save and Continue"**

---

## Step 3: Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **"+ Create Credentials"**
3. Select **"OAuth client ID"**

### Configure:

| Field | Value |
|-------|-------|
| Application type | **Web application** |
| Name | `Agentwaala Web Client` |

### Authorized JavaScript Origins:
Add these URLs:
```
https://your-project.lovable.app
http://localhost:5173
http://localhost:8080
```

### Authorized Redirect URIs:
Add this URL (replace with your project ID):
```
https://zkanukerjmhlrrhpzsti.supabase.co/auth/v1/callback
```

> **Your Supabase Project ID:** `zkanukerjmhlrrhpzsti`

4. Click **"Create"**

### Save Your Credentials:
You'll see a popup with:
- **Client ID**: `xxxxxxxxx.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-xxxxxxxxx`

⚠️ **Copy both values now!** You'll need them in the next step.

---

## Step 4: Configure in Lovable Cloud

### Option A: Using Lovable UI

1. In Lovable, click the **"Cloud"** tab (database icon)
2. Go to **Authentication → Providers**
3. Find **Google** and click to expand
4. Toggle **"Enable Google"** ON
5. Enter your credentials:
   - **Client ID**: Paste from Google
   - **Client Secret**: Paste from Google
6. Click **"Save"**

### Option B: Direct Dashboard Access

1. Go to your Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/zkanukerjmhlrrhpzsti/auth/providers
   ```
2. Find Google provider
3. Enable and enter credentials
4. Save

---

## Step 5: Configure Redirect URLs in Supabase

1. In Supabase Dashboard, go to **Authentication → URL Configuration**
2. Set these values:

| Setting | Value |
|---------|-------|
| Site URL | `https://your-project.lovable.app` |
| Redirect URLs | `https://your-project.lovable.app/**` |

Add additional redirect URLs:
```
https://your-project.lovable.app/auth/callback
http://localhost:5173/**
http://localhost:5173/auth/callback
```

3. Click **"Save"**

---

## Step 6: Test the Integration

1. Open your app
2. Click **"Get Started"** or **"Log in"**
3. Click **"Continue with Google"**
4. Select your Google account
5. Grant permissions
6. You should be redirected to `/select-role` (for new users) or your dashboard

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

**Cause:** The callback URL doesn't match what's configured in Google.

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth client
3. Add the exact redirect URI:
   ```
   https://zkanukerjmhlrrhpzsti.supabase.co/auth/v1/callback
   ```

### Error: "Access blocked: This app's request is invalid"

**Cause:** OAuth consent screen not configured properly.

**Fix:**
1. Go to OAuth consent screen
2. Make sure app is in "Testing" or "Published" status
3. Add your email to Test Users

### Error: "requested path is invalid"

**Cause:** Site URL not configured in Supabase.

**Fix:**
1. Go to Supabase → Authentication → URL Configuration
2. Set the Site URL to your app's URL

### Stuck on Google Sign-in popup

**Cause:** Popup blocked or JavaScript origins missing.

**Fix:**
1. Allow popups for your site
2. Add your site URL to Authorized JavaScript Origins in Google Console

### User signs in but gets redirected to wrong page

**Cause:** Session not being read correctly.

**Fix:**
1. Check that AuthProvider wraps your app
2. Verify the auth callback handler is working
3. Clear browser cache and try again

---

## Security Checklist

- [ ] Client Secret is NOT exposed in frontend code
- [ ] Redirect URLs are HTTPS in production
- [ ] Only necessary scopes are requested
- [ ] Test users are limited during development
- [ ] OAuth consent screen has privacy policy (for production)

---

## Production Checklist

Before going live:

1. **Publish OAuth App**
   - Go to OAuth consent screen
   - Click "Publish App"
   - Complete verification if needed

2. **Update URLs**
   - Replace localhost URLs with production URLs
   - Update Site URL in Supabase

3. **Add Privacy Policy**
   - Required for published OAuth apps
   - Add URL to consent screen

4. **Domain Verification** (optional but recommended)
   - Verify your domain in Google Search Console
   - Add to authorized domains

---

## Quick Reference

### Your Project Details

| Item | Value |
|------|-------|
| Supabase Project ID | `zkanukerjmhlrrhpzsti` |
| Callback URL | `https://zkanukerjmhlrrhpzsti.supabase.co/auth/v1/callback` |
| App Redirect | `https://your-app.lovable.app/auth/callback` |

### Required Google Console URLs

```
# Authorized JavaScript Origins
https://your-project.lovable.app

# Authorized Redirect URIs  
https://zkanukerjmhlrrhpzsti.supabase.co/auth/v1/callback
```

### Code Reference

The auth code is already implemented in your project:

```typescript
// src/hooks/useAuth.tsx
const signInWithGoogle = async () => {
  const redirectUrl = `${window.location.origin}/auth/callback`;
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  });
};
```

---

## Need Help?

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)
- [Lovable Docs](https://docs.lovable.dev)
