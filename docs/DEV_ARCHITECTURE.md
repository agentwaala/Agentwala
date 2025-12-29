# Developer Documentation - Architecture

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── home/            # Homepage sections
│   │   ├── CTASection.tsx
│   │   ├── DomainsSection.tsx
│   │   ├── FeaturedAgents.tsx
│   │   ├── HeroSection.tsx
│   │   └── NearYouSection.tsx
│   ├── layout/          # Layout components
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── ui/              # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ... (50+ components)
│   ├── NavLink.tsx
│   └── ProtectedRoute.tsx
├── data/                # Static data
│   └── indiaLocations.ts
├── hooks/               # Custom React hooks
│   ├── use-mobile.tsx
│   ├── use-toast.ts
│   └── useAuth.tsx
├── integrations/        # External service integrations
│   └── supabase/
│       ├── client.ts    # Auto-generated, DO NOT EDIT
│       └── types.ts     # Auto-generated, DO NOT EDIT
├── lib/                 # Utilities
│   └── utils.ts
├── pages/               # Route pages
│   ├── AdminDashboard.tsx
│   ├── AgentDashboard.tsx
│   ├── AgentProfile.tsx
│   ├── Agents.tsx
│   ├── Auth.tsx
│   ├── AuthCallback.tsx
│   ├── BecomeAgent.tsx
│   ├── CustomerDashboard.tsx
│   ├── Domains.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   └── SelectRole.tsx
├── App.tsx              # Main app with routes
├── App.css              # Global styles
├── index.css            # Tailwind + design tokens
└── main.tsx             # Entry point
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │Components│  │  Hooks   │              │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘              │
│       │             │             │                      │
│       └─────────────┼─────────────┘                      │
│                     │                                    │
│              ┌──────┴──────┐                            │
│              │ React Query │ (Data fetching/caching)    │
│              └──────┬──────┘                            │
│                     │                                    │
│              ┌──────┴──────┐                            │
│              │  Supabase   │ (Client SDK)               │
│              │   Client    │                            │
│              └──────┬──────┘                            │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTPS
┌─────────────────────┼───────────────────────────────────┐
│                     ▼                                    │
│            LOVABLE CLOUD (Supabase)                     │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │     Auth     │  │   Database   │  │   Storage    │  │
│  │ (Google OAuth)│  │ (PostgreSQL) │  │   (Files)    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                           │                              │
│                    ┌──────┴──────┐                      │
│                    │ RLS Policies│ (Row Level Security) │
│                    └─────────────┘                      │
└─────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│  /auth  │────▶│ Google  │────▶│Callback │
│ clicks  │     │  page   │     │  OAuth  │     │  /auth/ │
│ login   │     │         │     │         │     │callback │
└─────────┘     └─────────┘     └─────────┘     └────┬────┘
                                                      │
                     ┌────────────────────────────────┘
                     ▼
              ┌──────────────┐
              │ Check if user│
              │  has role    │
              └──────┬───────┘
                     │
         ┌───────────┼───────────┐
         ▼           ▼           ▼
    ┌─────────┐ ┌─────────┐ ┌─────────┐
    │No Role  │ │Customer │ │ Agent/  │
    │/select- │ │Dashboard│ │ Admin   │
    │  role   │ │         │ │Dashboard│
    └─────────┘ └─────────┘ └─────────┘
```

---

## Route Protection

```typescript
// ProtectedRoute component wraps protected pages

<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>

// Behavior:
// 1. If not logged in → redirect to /auth
// 2. If no role set → redirect to /select-role
// 3. If wrong role → redirect to user's correct dashboard
// 4. If correct role → render children
```

---

## State Management

### Global State: Auth Context

```typescript
// useAuth hook provides:
{
  user: User | null,        // Supabase user object
  session: Session | null,  // Auth session with tokens
  role: 'admin' | 'agent' | 'customer' | null,
  loading: boolean,
  signInWithGoogle: () => Promise<void>,
  signOut: () => Promise<void>,
  setUserRole: (role) => Promise<void>,
}
```

### Server State: React Query

```typescript
// Used for data fetching and caching
const queryClient = new QueryClient();

// Queries auto-cache and dedupe requests
// Mutations invalidate related queries
```

---

## Key Design Patterns

### 1. Compound Components
```typescript
// shadcn/ui pattern
<Select>
  <SelectTrigger>
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
  </SelectContent>
</Select>
```

### 2. Custom Hooks
```typescript
// Encapsulate complex logic
const { user, role, signOut } = useAuth();
const { toast } = useToast();
```

### 3. Semantic Design Tokens
```css
/* Use semantic tokens, not direct colors */
✓ text-primary
✓ bg-card
✓ border-border

✗ text-blue-500
✗ bg-white
✗ border-gray-200
```

### 4. Component Composition
```typescript
// Build complex UIs from simple components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content here
  </CardContent>
</Card>
```

---

## Performance Optimizations

1. **Code Splitting**: React Router lazy loading (can be added)
2. **Query Caching**: React Query caches API responses
3. **Optimistic Updates**: UI updates before server confirms
4. **Debounced Search**: Prevents excessive API calls
5. **Skeleton Loading**: Shows placeholders during load

---

## Security Considerations

### Frontend
- No sensitive data in localStorage
- Auth tokens handled by Supabase SDK
- Role checks in ProtectedRoute

### Backend (RLS)
- All tables have Row Level Security enabled
- Users can only access their own data
- Admin access via `has_role()` function
- Security definer functions prevent recursion
