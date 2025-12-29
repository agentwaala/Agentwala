# Admin User Guide

## Accessing Admin Dashboard

Admin accounts are created manually in the database. Regular users cannot select "Admin" role during signup.

### Creating an Admin Account

1. User signs up normally (as Customer or Agent)
2. Database admin runs SQL:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<user-uuid>', 'admin');
```
3. User can now access `/admin` route

---

## Dashboard Overview

The Admin Dashboard has three main tabs:

### 1. Overview Tab

**Statistics Cards:**
- **Total Users**: All registered profiles
- **Total Agents**: Registered agent accounts
- **Active Agents**: Agents with availability ON
- **Customers**: Users with customer role

**Platform Status:**
- Shows current platform state
- "Free for now" - no payment integration active

---

### 2. Approvals Tab

Manage pending agent verifications.

**Agent Approval Queue** shows:
- Agent name and avatar
- Category/Domain
- Location
- Application date

**Actions:**

| Button | Action |
|--------|--------|
| **Verify** (✓) | Grants blue verification badge |
| **Premium** (👑) | Grants gold premium badge |
| **Reject** (✗) | Denies verification (no action currently) |

**Approval Criteria:**
- Profile is complete
- Information appears legitimate
- Category matches expertise
- Location is valid Indian location

---

### 3. All Agents Tab

Search and manage all registered agents.

**Filters:**
- **Search**: By agent name
- **Category**: Filter by domain

**Agent Table Columns:**
- Agent (name + badges)
- Category
- Location
- Status (Active/Inactive)
- Actions

**Quick Actions:**
- **Badge Toggle** (✓): Toggle verification status
- **Crown Toggle** (👑): Toggle premium status

---

## Managing Verification

### Verification Badge (Blue Tick)

**Purpose:**
- Indicates identity verified
- Increases user trust
- Higher search ranking

**How to Grant:**
1. Go to Approvals or All Agents tab
2. Find the agent
3. Click Verify button (✓)
4. Badge appears immediately on agent profile

**How to Revoke:**
1. Go to All Agents tab
2. Find the verified agent
3. Click the highlighted Verify button
4. Badge is removed

### Premium Badge (Gold Crown)

**Purpose:**
- Priority in search results
- Enhanced visibility
- Premium indicator for customers

**How to Grant:**
1. Find agent in Approvals or All Agents
2. Click Premium button (👑)
3. Gold badge appears on profile

**When to Grant:**
- High-performing agents
- Agents who pay premium fee (future)
- Top-rated agents
- Strategic categories/locations

---

## Monitoring Platform Health

### Key Metrics to Watch

1. **Active Agent Ratio**
   - Active Agents / Total Agents
   - Target: > 50%
   - Low ratio = engagement problem

2. **Pending Approvals**
   - Check daily
   - Process within 24-48 hours
   - Shown in header badge

3. **Category Distribution**
   - Ensure all categories have agents
   - Identify underserved categories
   - Focus recruitment efforts

4. **Geographic Coverage**
   - Check agents across major cities
   - Identify underserved regions

---

## Admin Workflows

### Daily Tasks
- [ ] Check pending approvals
- [ ] Verify new agents
- [ ] Review flagged content (future)

### Weekly Tasks
- [ ] Review platform statistics
- [ ] Identify top performers for Premium
- [ ] Check category distribution

### Monthly Tasks
- [ ] Generate reports (future)
- [ ] Review overall growth
- [ ] Plan expansion strategies

---

## Database Operations

### Direct SQL Queries

**View all agents:**
```sql
SELECT full_name, city, state, verified, premium, available 
FROM agents 
ORDER BY created_at DESC;
```

**Count by verification:**
```sql
SELECT verified, COUNT(*) 
FROM agents 
GROUP BY verified;
```

**Find agents by city:**
```sql
SELECT * FROM agents 
WHERE city = 'Mumbai' 
AND profile_complete = true;
```

**Grant admin role:**
```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('<uuid>', 'admin');
```

---

## Troubleshooting

**Q: Agent not appearing after verification?**
- Check `profile_complete` is true
- Ensure all required fields filled
- Clear any browser caches

**Q: Cannot access admin dashboard?**
- Verify user has admin role in `user_roles` table
- Check RLS policies are correct
- Try signing out and back in

**Q: Stats showing incorrect numbers?**
- Refresh the page
- Check database directly for accurate counts
- May be caching issue

---

## Security Notes

⚠️ **Important Security Practices:**

1. Never share admin credentials
2. Don't grant admin access liberally
3. Regularly audit admin actions
4. Keep database access logs
5. Review RLS policies periodically
