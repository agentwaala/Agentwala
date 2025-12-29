# Agentwaala - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [User Guides](#user-guides)
6. [Developer Documentation](#developer-documentation)
7. [Testing Guide](#testing-guide)

---

## Project Overview

**Agentwaala** is a multi-category agent marketplace connecting verified agents (middlemen) with customers and wholesalers across India. The platform covers sectors like Real Estate, Textiles, Agriculture, Medicine, Travel, and more.

### Key Concepts

- **Agents**: Verified professionals who offer services in specific categories
- **Customers**: Users who browse and connect with agents
- **Admins**: Platform administrators who verify agents and manage the marketplace

### Business Model

- Currently **FREE** for all users
- No payment integration (future-ready schema)
- Verification fee for agents (₹1,000 - to be implemented)

---

## Features

### For Customers
- Browse verified agents by category and location
- GPS-based "Near You" discovery
- Save favorite agents
- Star-based rating system (1-5 stars, no text)
- Call history tracking
- Location preferences (India only)

### For Agents
- Profile management with availability toggle
- Category-based listing
- Location settings (State → City → Area → Pincode)
- Verification status tracking
- Call/lead history
- Offers and discounts section

### For Admins
- Agent approval queue
- Verify/reject agents
- Assign Premium badges
- Platform analytics dashboard
- Search and filter all agents

### Location System
- **India only** - restricted to Indian states and districts
- Cascading dropdowns: State → District → Locality
- GPS-based auto-detection with India boundary validation
- Distance badges (Within 2km, 5km, 10km)

### Review System
- Star-only ratings (1-5 stars)
- No text reviews allowed
- One review per call/interaction
- Only customers can review agents

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Routing | React Router v6 |
| State | React Query (TanStack Query) |
| Backend | Lovable Cloud (Supabase) |
| Database | PostgreSQL |
| Auth | Google OAuth |
| Build | Vite |

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or bun package manager
- Google Cloud Console access (for OAuth setup)

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

The following are automatically configured by Lovable Cloud:
- `VITE_SUPABASE_URL` - Database URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Public API key
- `VITE_SUPABASE_PROJECT_ID` - Project identifier

### Setting Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services → Credentials**
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URI: `https://[PROJECT_ID].supabase.co/auth/v1/callback`
6. Configure in Lovable Cloud → Authentication → Providers → Google

---

## User Guides

See separate documentation:
- [Customer Guide](./USER_GUIDE_CUSTOMER.md)
- [Agent Guide](./USER_GUIDE_AGENT.md)
- [Admin Guide](./USER_GUIDE_ADMIN.md)

---

## Developer Documentation

See separate documentation:
- [Architecture](./DEV_ARCHITECTURE.md)
- [Database Schema](./DEV_DATABASE.md)
- [API Reference](./DEV_API.md)
- [Components](./DEV_COMPONENTS.md)

---

## Testing Guide

See [Testing Documentation](./TESTING.md)

---

## Support

- Documentation: [docs.lovable.dev](https://docs.lovable.dev)
- Community: [Lovable Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)
