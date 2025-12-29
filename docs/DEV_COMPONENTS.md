# Developer Documentation - Components

## Component Architecture

```
components/
├── home/           # Homepage sections (page-specific)
├── layout/         # Layout components (global)
├── ui/             # shadcn/ui primitives
├── NavLink.tsx     # Navigation helper
└── ProtectedRoute.tsx  # Auth wrapper
```

---

## Custom Components

### ProtectedRoute

Wraps pages that require authentication and specific roles.

```typescript
interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'agent' | 'customer')[];
}
```

**Usage:**
```tsx
// Any authenticated user
<ProtectedRoute>
  <SomePage />
</ProtectedRoute>

// Specific roles only
<ProtectedRoute allowedRoles={['admin']}>
  <AdminDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['agent']}>
  <AgentDashboard />
</ProtectedRoute>

<ProtectedRoute allowedRoles={['customer']}>
  <CustomerDashboard />
</ProtectedRoute>
```

**Behavior:**
- Shows loading spinner while checking auth
- Redirects to `/auth` if not logged in
- Redirects to `/select-role` if role not set
- Redirects to correct dashboard if wrong role

---

### Navbar

Global navigation component with auth state awareness.

**Features:**
- Sticky header with backdrop blur
- Mobile responsive hamburger menu
- User avatar dropdown when logged in
- Theme toggle
- Dynamic CTA based on auth state

**Key Props:** None (uses hooks internally)

**Auth States:**
```tsx
// Not logged in:
<Button>Log in</Button>
<Button>Get Started</Button>

// Logged in:
<Avatar>
  <DropdownMenu>
    <DropdownMenuItem>Dashboard</DropdownMenuItem>
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenu>
</Avatar>
```

---

### NearYouSection

Location-based agent discovery with GPS support.

**Features:**
- Cascading location dropdowns (State → District → Locality)
- GPS auto-detection with India boundary validation
- Sort options (Nearest, Rated, Verified, Available)
- Distance badges
- Agent cards with availability indicators

**State:**
```typescript
const [selectedState, setSelectedState] = useState('');
const [selectedDistrict, setSelectedDistrict] = useState('');
const [selectedLocality, setSelectedLocality] = useState('');
const [sortBy, setSortBy] = useState('nearest');
const [isDetecting, setIsDetecting] = useState(false);
const [locationError, setLocationError] = useState('');
```

---

## shadcn/ui Components

All UI primitives come from shadcn/ui. Key components used:

### Layout
- `Card`, `CardHeader`, `CardContent`, `CardTitle`
- `Separator`
- `ScrollArea`

### Forms
- `Button` - Multiple variants (default, outline, ghost, destructive)
- `Input` - Text inputs
- `Textarea` - Multi-line inputs
- `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`
- `Switch` - Toggle switches
- `Checkbox`
- `Label`

### Feedback
- `Toast` / `useToast` - Notifications
- `Badge` - Status indicators
- `Skeleton` - Loading placeholders

### Overlay
- `Dialog`, `DialogTrigger`, `DialogContent`
- `DropdownMenu`, `DropdownMenuItem`
- `Tooltip`
- `Popover`

### Navigation
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Breadcrumb`

---

## Component Best Practices

### 1. Use Design Tokens

```tsx
// ✓ CORRECT - Use semantic tokens
<div className="bg-card text-foreground border-border">
<Button className="text-primary-foreground">

// ✗ WRONG - Direct colors
<div className="bg-white text-black border-gray-200">
<Button className="text-white">
```

### 2. Responsive Design

```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="p-4 sm:p-6 lg:p-8">
<div className="hidden lg:flex">
```

### 3. Loading States

```tsx
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
```

### 4. Empty States

```tsx
{items.length === 0 ? (
  <div className="text-center py-8 text-muted-foreground">
    <Icon className="h-8 w-8 mx-auto mb-2 opacity-50" />
    <p>No items found</p>
    <Button variant="link">Add first item</Button>
  </div>
) : (
  <ItemList items={items} />
)}
```

### 5. Error Handling

```tsx
const { toast } = useToast();

try {
  await someOperation();
  toast({ title: 'Success!' });
} catch (error) {
  toast({
    title: 'Error',
    description: 'Something went wrong',
    variant: 'destructive',
  });
}
```

---

## Creating New Components

### Step 1: Create file
```bash
touch src/components/MyComponent.tsx
```

### Step 2: Basic structure
```tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  const [isActive, setIsActive] = useState(false);
  
  return (
    <div className="p-4 bg-card rounded-2xl border border-border/50">
      <h3 className="font-semibold text-lg">{title}</h3>
      <Button onClick={onAction}>
        Action
      </Button>
    </div>
  );
};
```

### Step 3: Use component
```tsx
import { MyComponent } from '@/components/MyComponent';

<MyComponent 
  title="Hello" 
  onAction={() => console.log('clicked')} 
/>
```

---

## Icon Usage

Using Lucide React icons:

```tsx
import { 
  Star, 
  MapPin, 
  Phone, 
  BadgeCheck, 
  Crown,
  Loader2,
  Check,
  X 
} from 'lucide-react';

// Usage
<Star className="h-4 w-4 text-primary" />
<Star className="h-4 w-4 fill-primary text-primary" /> // Filled
<Loader2 className="h-4 w-4 animate-spin" />
```

Common icons in this project:
- `BadgeCheck` - Verification badge
- `Crown` - Premium badge
- `Star` - Ratings
- `MapPin` - Location
- `Phone` - Calls
- `Circle` - Online status
- `Edit`, `Save` - Actions
- `Loader2` - Loading spinner
