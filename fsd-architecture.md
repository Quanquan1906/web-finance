# Feature Sliced Design (FSD) Architecture

Architectural methodology for scalable, maintainable frontend projects with clear separation of concerns.

---

## Layer Structure

```
src/
├── app/                    # Application layer
│   ├── providers/          # Global providers (QueryClient, Theme)
│   ├── router/             # Routing configuration
│   └── styles/             # Global styles, Tailwind config
│
├── pages/                  # Pages layer
│   ├── home/
│   │   ├── ui/             # Page UI components
│   │   └── index.ts        # Public API
│   └── users/
│       └── [id]/           # Dynamic routes
│
├── widgets/                # Widgets layer
│   ├── header/
│   │   ├── ui/
│   │   └── index.ts
│   └── sidebar/
│
├── features/               # Features layer
│   ├── auth/
│   │   ├── api/            # Feature API calls
│   │   ├── model/          # Feature state (Zustand), types
│   │   ├── ui/             # Feature UI components
│   │   └── index.ts        # Public API
│   └── posts/
│       ├── create-post/
│       ├── edit-post/
│       └── delete-post/
│
├── entities/               # Entities layer
│   ├── user/
│   │   ├── api/            # Entity CRUD
│   │   ├── model/          # Types, stores
│   │   ├── ui/             # UserCard, UserAvatar
│   │   └── index.ts
│   └── post/
│
└── shared/                 # Shared layer
    ├── api/                # API client, interceptors
    ├── config/             # Environment config
    ├── lib/                # Utilities (cn, formatDate)
    ├── store/              # Global Zustand stores
    ├── ui/                 # UI kit (shadcn/ui components)
    └── types/              # Shared TypeScript types
```

---

## Core Principles

### 1. Unidirectional Dependencies

```
app → pages → widgets → features → entities → shared
```

Each layer can only import from layers below:

```tsx
// ✅ ALLOWED
// features/auth can import from entities/user
import { UserCard } from '@/entities/user';

// ✅ ALLOWED
// entities/user can import from shared
import { apiClient } from '@/shared/api';
import { cn } from '@/shared/lib/utils';

// ❌ FORBIDDEN
// entities/user cannot import from features
import { useAuth } from '@/features/auth'; // WRONG!

// ❌ FORBIDDEN
// shared cannot import from any other layer
import { User } from '@/entities/user'; // WRONG!
```

### 2. Slice Structure

Every slice follows consistent structure:

```
feature-name/
├── api/                    # API interactions
│   └── featureApi.ts
├── model/                  # Business logic, state
│   ├── types.ts            # TypeScript types
│   ├── store.ts            # Zustand store (if needed)
│   └── hooks.ts            # Custom hooks
├── ui/                     # UI components
│   ├── FeatureComponent.tsx
│   └── FeatureForm.tsx
├── lib/                    # Slice-specific utilities
│   └── helpers.ts
└── index.ts                # Public API exports
```

### 3. Public API Pattern

Expose only what's needed via `index.ts`:

```tsx
// features/auth/index.ts

// ✅ Export public components and hooks
export { LoginForm } from './ui/LoginForm';
export { useAuth } from './model/hooks';
export { useAuthStore } from './model/store';
export type { User, AuthState } from './model/types';

// ❌ Don't expose internal implementation
// export { validatePassword } from './lib/validation';
// export { authReducer } from './model/store';
```

---

## Layer Responsibilities

### app/ - Application Layer
- Application initialization
- Global providers setup (QueryClient, Theme)
- Router configuration
- Global error boundaries
- Global styles and Tailwind setup

### pages/ - Pages Layer
- Route-level components
- Page layouts
- Compose widgets and features
- Route-specific data loading

### widgets/ - Widgets Layer
- Self-contained UI blocks
- Header, Footer, Sidebar
- Can compose multiple features
- No business logic of their own

### features/ - Features Layer
- User interactions
- Business features
- Form handling
- Feature-specific Zustand stores

### entities/ - Entities Layer
- Business domain objects
- Entity CRUD operations
- Entity UI representations
- Shared across features

### shared/ - Shared Layer
- shadcn/ui components
- Utility functions (cn, formatDate)
- API client (axios instance)
- Global Zustand stores
- Shared types

---

## Implementation Examples

### Entity: User

```tsx
// entities/user/model/types.ts
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// entities/user/api/userApi.ts
import { apiClient } from '@/shared/api';
import type { User } from '../model/types';

export const userApi = {
  getUser: (id: string) => apiClient.get<User>(`/users/${id}`),
  getUsers: () => apiClient.get<User[]>('/users'),
};

// entities/user/ui/UserCard.tsx
import { cn } from '@/shared/lib/utils';
import { Card, CardContent } from '@/shared/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar';
import type { User } from '../model/types';

interface UserCardProps {
  user: User;
  onClick?: () => void;
  className?: string;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onClick, className }) => (
  <Card
    className={cn('cursor-pointer hover:bg-accent transition-colors', className)}
    onClick={onClick}
  >
    <CardContent className="flex items-center gap-4 p-4">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium">{user.username}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
    </CardContent>
  </Card>
);

// entities/user/index.ts
export { UserCard } from './ui/UserCard';
export { userApi } from './api/userApi';
export type { User } from './model/types';
```

### Feature: Authentication

```tsx
// features/auth/model/types.ts
import type { User } from '@/entities/user';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// features/auth/model/store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import type { User, LoginCredentials } from './types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { user, token } = await authApi.login(credentials);
          localStorage.setItem('token', token);
          set({ user, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        await authApi.logout();
        localStorage.removeItem('token');
        set({ user: null });
      },
    }),
    { name: 'auth-storage', partialize: (state) => ({ user: state.user }) }
  )
);

// features/auth/ui/LoginForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/form';
import { useAuthStore } from '../model/store';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuthStore();
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    await login(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </Form>
  );
};

// features/auth/index.ts
export { LoginForm } from './ui/LoginForm';
export { useAuthStore } from './model/store';
export type { AuthState, LoginCredentials } from './model/types';
```

### Page: Users

```tsx
// pages/users/ui/UsersPage.tsx
import { SuspenseLoader } from '@/shared/ui/suspense-loader';
import { UserList } from '@/widgets/user-list';
import { CreateUserButton } from '@/features/users/create-user';

export const UsersPage: React.FC = () => (
  <div className="container py-8">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Users</h1>
      <CreateUserButton />
    </div>
    <SuspenseLoader>
      <UserList />
    </SuspenseLoader>
  </div>
);

// pages/users/index.ts
export { UsersPage } from './ui/UsersPage';
```

---

## Import Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/app/*": ["src/app/*"],
      "@/pages/*": ["src/pages/*"],
      "@/widgets/*": ["src/widgets/*"],
      "@/features/*": ["src/features/*"],
      "@/entities/*": ["src/entities/*"],
      "@/shared/*": ["src/shared/*"]
    }
  }
}
```

---

## FSD vs Traditional Structure

| Traditional | FSD | Benefit |
|-------------|-----|---------|
| `components/` | `shared/ui/`, `entities/*/ui/`, `features/*/ui/` | Clear ownership |
| `services/` | `shared/api/`, `entities/*/api/` | Scoped responsibility |
| `hooks/` | `features/*/model/`, `entities/*/model/` | Feature-bound logic |
| `utils/` | `shared/lib/` | Single source |
| `types/` | `*/model/types.ts` | Co-located types |
| `store/` | `shared/store/`, `features/*/model/` | Scoped state |

---

## When to Use Each Layer

| Need | Layer | Example |
|------|-------|---------|
| App-wide setup | app/ | Theme provider, QueryClient |
| Route component | pages/ | HomePage, UserDetailPage |
| Reusable UI block | widgets/ | Header, Sidebar |
| User action | features/ | LoginForm, CreatePost |
| Domain object | entities/ | User, Post, Comment |
| Utility | shared/ | Button, cn(), formatDate |

---

## FSD Checklist

- [ ] Layers organized correctly
- [ ] Dependencies flow downward only
- [ ] Public API via index.ts
- [ ] Types co-located with logic
- [ ] shadcn/ui components in shared/ui/
- [ ] Global stores in shared/store/
- [ ] Feature stores in features/*/model/
