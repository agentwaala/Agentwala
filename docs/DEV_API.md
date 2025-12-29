# Developer Documentation - API Reference

## Supabase Client Usage

```typescript
import { supabase } from '@/integrations/supabase/client';
```

**⚠️ Never edit the client.ts or types.ts files** - they are auto-generated.

---

## Authentication API

### Sign in with Google
```typescript
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
});
```

### Sign out
```typescript
const { error } = await supabase.auth.signOut();
```

### Get current session
```typescript
const { data: { session }, error } = await supabase.auth.getSession();
```

### Listen to auth changes
```typescript
const { data: { subscription } } = supabase.auth.onAuthStateChange(
  (event, session) => {
    // Handle auth state change
  }
);

// Cleanup
subscription.unsubscribe();
```

---

## Database Operations

### Profiles

**Get user profile**
```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle();
```

**Update profile**
```typescript
const { error } = await supabase
  .from('profiles')
  .update({ full_name: 'New Name' })
  .eq('user_id', userId);
```

---

### User Roles

**Get user role**
```typescript
const { data, error } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .maybeSingle();
```

**Set user role (on first login)**
```typescript
const { error } = await supabase
  .from('user_roles')
  .insert({ user_id: userId, role: 'customer' });
```

---

### Agents

**Get all visible agents**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('profile_complete', true)
  .order('verified', { ascending: false });
```

**Get agent by ID**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('id', agentId)
  .single();
```

**Get agent by user ID**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('user_id', userId)
  .maybeSingle();
```

**Create agent profile**
```typescript
const { error } = await supabase
  .from('agents')
  .insert({
    user_id: userId,
    full_name: 'Agent Name',
    available: false,
    profile_complete: false,
  });
```

**Update agent profile**
```typescript
const { error } = await supabase
  .from('agents')
  .update({
    full_name: 'Updated Name',
    phone: '+91 98765 43210',
    state: 'Maharashtra',
    city: 'Mumbai',
    categories: ['Real Estate'],
    description: 'Bio here',
    profile_complete: true,
  })
  .eq('id', agentId);
```

**Toggle availability**
```typescript
const { error } = await supabase
  .from('agents')
  .update({ available: !currentStatus })
  .eq('id', agentId);
```

**Filter agents by location**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('profile_complete', true)
  .eq('state', 'Maharashtra')
  .eq('city', 'Mumbai')
  .eq('available', true);
```

**Filter agents by category**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('profile_complete', true)
  .contains('categories', ['Real Estate']);
```

---

### Reviews

**Get agent reviews**
```typescript
const { data, error } = await supabase
  .from('reviews')
  .select('stars')
  .eq('agent_id', agentId);

// Calculate average
const avgRating = data.reduce((sum, r) => sum + r.stars, 0) / data.length;
```

**Submit review**
```typescript
const { error } = await supabase
  .from('reviews')
  .upsert({
    customer_id: userId,
    agent_id: agentId,
    stars: 5,
  });
```

**Check if already reviewed**
```typescript
const { data, error } = await supabase
  .from('reviews')
  .select('id')
  .eq('customer_id', userId)
  .eq('agent_id', agentId)
  .maybeSingle();

const hasReviewed = !!data;
```

---

### Calls

**Get customer's call history**
```typescript
const { data, error } = await supabase
  .from('calls')
  .select(`
    *,
    agents (
      full_name,
      avatar_url,
      categories
    )
  `)
  .eq('customer_id', userId)
  .order('created_at', { ascending: false })
  .limit(10);
```

**Get agent's call history**
```typescript
const { data, error } = await supabase
  .from('calls')
  .select('*')
  .eq('agent_id', agentId)
  .order('created_at', { ascending: false });
```

**Create call record**
```typescript
const { error } = await supabase
  .from('calls')
  .insert({
    customer_id: userId,
    agent_id: agentId,
    category: 'Real Estate',
    duration_seconds: 300, // 5 minutes
  });
```

---

### Saved Agents

**Get saved agents**
```typescript
const { data, error } = await supabase
  .from('saved_agents')
  .select(`
    *,
    agents (
      id,
      full_name,
      avatar_url,
      categories,
      city,
      available,
      verified,
      premium
    )
  `)
  .eq('customer_id', userId);
```

**Save an agent**
```typescript
const { error } = await supabase
  .from('saved_agents')
  .insert({
    customer_id: userId,
    agent_id: agentId,
  });
```

**Unsave an agent**
```typescript
const { error } = await supabase
  .from('saved_agents')
  .delete()
  .eq('customer_id', userId)
  .eq('agent_id', agentId);
```

**Check if saved**
```typescript
const { data, error } = await supabase
  .from('saved_agents')
  .select('id')
  .eq('customer_id', userId)
  .eq('agent_id', agentId)
  .maybeSingle();

const isSaved = !!data;
```

---

## Admin Operations

**Verify agent**
```typescript
const { error } = await supabase
  .from('agents')
  .update({ verified: true })
  .eq('id', agentId);
```

**Set premium status**
```typescript
const { error } = await supabase
  .from('agents')
  .update({ premium: true })
  .eq('id', agentId);
```

**Get pending approvals**
```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*')
  .eq('verified', false)
  .eq('profile_complete', true);
```

**Get platform stats**
```typescript
// Total profiles
const { count: profileCount } = await supabase
  .from('profiles')
  .select('*', { count: 'exact', head: true });

// Total agents
const { count: agentCount } = await supabase
  .from('agents')
  .select('*', { count: 'exact', head: true });

// Active agents
const { count: activeCount } = await supabase
  .from('agents')
  .select('*', { count: 'exact', head: true })
  .eq('available', true);
```

---

## Error Handling

```typescript
const { data, error } = await supabase
  .from('agents')
  .select('*');

if (error) {
  console.error('Database error:', error.message);
  toast({
    title: 'Error',
    description: 'Failed to load data',
    variant: 'destructive',
  });
  return;
}

// Use data safely
console.log(data);
```

---

## TypeScript Types

Types are auto-generated in `src/integrations/supabase/types.ts`.

```typescript
// Import generated types
import { Database } from '@/integrations/supabase/types';

type Agent = Database['public']['Tables']['agents']['Row'];
type AgentInsert = Database['public']['Tables']['agents']['Insert'];
type AgentUpdate = Database['public']['Tables']['agents']['Update'];
```
