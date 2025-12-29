# Developer Documentation - Database Schema

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  auth.users │       │  profiles   │       │ user_roles  │
│─────────────│       │─────────────│       │─────────────│
│ id (PK)     │◄──────│ user_id (FK)│       │ id (PK)     │
│ email       │       │ full_name   │       │ user_id (FK)│──┐
│ ...         │       │ email       │       │ role        │  │
└─────────────┘       │ avatar_url  │       │ created_at  │  │
       │              │ phone       │       └─────────────┘  │
       │              └─────────────┘                        │
       │                                                     │
       │              ┌─────────────┐                        │
       │              │   agents    │                        │
       ├──────────────│─────────────│◄───────────────────────┘
       │              │ id (PK)     │
       │              │ user_id (FK)│
       │              │ full_name   │
       │              │ phone       │
       │              │ categories[]│
       │              │ state       │
       │              │ city        │
       │              │ area        │
       │              │ pincode     │
       │              │ description │
       │              │ offers      │
       │              │ available   │
       │              │ verified    │
       │              │ premium     │
       │              │ profile_complete│
       │              └──────┬──────┘
       │                     │
       │    ┌────────────────┼────────────────┐
       │    │                │                │
       │    ▼                ▼                ▼
       │ ┌─────────┐  ┌─────────────┐  ┌─────────────┐
       │ │ reviews │  │    calls    │  │saved_agents │
       │ │─────────│  │─────────────│  │─────────────│
       │ │ id (PK) │  │ id (PK)     │  │ id (PK)     │
       └─│customer_│  │ customer_id │  │ customer_id │
         │  id(FK) │  │ agent_id(FK)│  │ agent_id(FK)│
         │agent_id │  │ duration    │  │ created_at  │
         │ stars   │  │ category    │  └─────────────┘
         │created_at│ │ created_at  │
         └─────────┘  └─────────────┘
```

---

## Table Definitions

### user_roles
Stores user role assignments. Separate from profiles for security.

```sql
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'agent', 'customer');
```

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| role | app_role | 'admin', 'agent', or 'customer' |
| created_at | TIMESTAMPTZ | When role was assigned |

---

### profiles
User profile information. Auto-created on signup via trigger.

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users (unique) |
| full_name | TEXT | Display name |
| email | TEXT | Email address |
| avatar_url | TEXT | Profile picture URL |
| phone | TEXT | Phone number |

---

### agents
Agent-specific profile data. Created when user selects "Agent" role.

```sql
CREATE TABLE public.agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    categories TEXT[] DEFAULT '{}',
    state TEXT,
    city TEXT,
    area TEXT,
    pincode TEXT,
    description TEXT,
    offers TEXT,
    available BOOLEAN DEFAULT false,
    verified BOOLEAN DEFAULT false,
    premium BOOLEAN DEFAULT false,
    profile_complete BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Reference to auth.users |
| full_name | TEXT | Agent's display name |
| phone | TEXT | Contact number |
| avatar_url | TEXT | Profile photo URL |
| categories | TEXT[] | Array of service categories |
| state | TEXT | Indian state |
| city | TEXT | City/District |
| area | TEXT | Locality/Area |
| pincode | TEXT | Postal code |
| description | TEXT | Agent bio |
| offers | TEXT | Current offers/discounts |
| available | BOOLEAN | Online/Offline toggle |
| verified | BOOLEAN | Admin-approved verification |
| premium | BOOLEAN | Premium badge status |
| profile_complete | BOOLEAN | All required fields filled |

---

### reviews
Star ratings from customers to agents.

```sql
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (customer_id, agent_id)
);
```

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| customer_id | UUID | Reviewing customer |
| agent_id | UUID | Reviewed agent |
| stars | INTEGER | 1-5 star rating |

**Constraints:**
- Stars must be 1-5
- One review per customer-agent pair

---

### calls
Call/interaction history between customers and agents.

```sql
CREATE TABLE public.calls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    duration_seconds INTEGER,
    category TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
```

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| customer_id | UUID | Customer who initiated |
| agent_id | UUID | Agent contacted |
| duration_seconds | INTEGER | Call duration |
| category | TEXT | Inquiry category |

---

### saved_agents
Customer's saved/favorite agents.

```sql
CREATE TABLE public.saved_agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    agent_id UUID REFERENCES public.agents(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (customer_id, agent_id)
);
```

---

## Row Level Security (RLS) Policies

### Security Definer Function

```sql
-- Used to check roles without recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
```

### Policy Summary

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| user_roles | Own + Admin | Own | - | - |
| profiles | Own + Admin | Own | Own | - |
| agents | Public (if complete) | Own | Own | Own |
| reviews | Public | Customers only | - | - |
| calls | Own + Agent's own | Customers | - | - |
| saved_agents | Own | Own | Own | Own |

---

## Triggers

### Auto-create profile on signup
```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Update timestamps
```sql
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agents_updated_at
BEFORE UPDATE ON public.agents
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

---

## Common Queries

### Get agent with average rating
```sql
SELECT 
  a.*,
  COALESCE(AVG(r.stars), 0) as avg_rating,
  COUNT(r.id) as review_count
FROM agents a
LEFT JOIN reviews r ON r.agent_id = a.id
WHERE a.profile_complete = true
GROUP BY a.id;
```

### Get customer's call history with agent info
```sql
SELECT 
  c.*,
  a.full_name as agent_name,
  a.categories
FROM calls c
JOIN agents a ON a.id = c.agent_id
WHERE c.customer_id = '<user-id>'
ORDER BY c.created_at DESC;
```

### Count agents by city
```sql
SELECT city, COUNT(*) as agent_count
FROM agents
WHERE profile_complete = true
GROUP BY city
ORDER BY agent_count DESC;
```
