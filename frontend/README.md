# React TanStack Boilerplate

A modern, opinionated, and production-ready frontend boilerplate designed for scalability and performance. Built with **React 19**, **Vite 7**, and the **TanStack** ecosystem.

## 1. Technology Stack & Versions

This boilerplate is built on the latest stable versions of the following core technologies (as of 2026):

1.  **Core Framework**
    1.  **React**: v19.2.4
    2.  **React DOM**: v19.2.4
    3.  **Vite**: v7.2.4
    4.  **TypeScript**: v5.9.3

2.  **State Management & Data Fetching**
    1.  **TanStack Router**: v1.145.7 (File-based routing)
    2.  **TanStack Query**: v5.90.16 (Server state)
    3.  **Zustand**: v5.0.9 (Client state)

3.  **Styling & UI**
    1.  **Tailwind CSS**: v4.1.18
    2.  **Radix UI**: Latest primitives (Dialog, Popover, Dropdown, etc.)
    3.  **Framer Motion**: v12.24.7
    4.  **Lucide React**: v0.562.0

4.  **Forms & Validation**
    1.  **React Hook Form**: v7.70.0
    2.  **Zod**: v4.3.5

5.  **Testing & Quality Assurance**
    1.  **Jest**: v30.2.0
    2.  **Vitest**: v4.0.16
    3.  **React Testing Library**: v16.3.1
    4.  **MSW (Mock Service Worker)**: v2.12.7

6.  **Tooling**
    1.  **pnpm**: v10.26.2
    2.  **ESLint**: v9.39.1 (Flat Config)
    3.  **Prettier**: v3.7.4
    4.  **Husky**: v9.1.7
    5.  **React Compiler**: v1.0

## 2. Prerequisites

Ensure your development environment meets the following requirements:

1.  **Node.js**: v20.x or higher.
2.  **pnpm**: v10.x or higher (Strictly required as the package manager).

## 3. Getting Started

Follow these steps to set up the project locally:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/your-username/boilerplate-frontend-tanstack.git](https://github.com/your-username/boilerplate-frontend-tanstack.git)
    cd boilerplate-frontend-tanstack
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Setup Environment Variables**
    Copy the example environment file:
    ```bash
    cp .env.example .env
    ```

4.  **Start the development server**
    ```bash
    pnpm dev
    ```
    The application will launch at `http://localhost:5173`.

## 4. Scripts & Commands

The following scripts are available in `package.json`:

1.  **Development**
    1.  `pnpm dev`: Starts the Vite development server with HMR.
    2.  `pnpm preview`: Serves the built application locally for testing.

2.  **Build**
    1.  `pnpm build`: Runs TypeScript compiler (`tsc -b`) and builds the application for production using Vite.

3.  **Code Quality**
    1.  `pnpm lint`: Runs ESLint to catch code errors.
    2.  `pnpm format`: Formats code using Prettier.
    3.  `pnpm check-format`: Verifies if code is correctly formatted.

4.  **Testing**
    1.  `pnpm test`: Runs unit tests in watch mode using Jest.
    2.  `pnpm test:ci`: Runs tests in CI mode with coverage reports.

5.  **Git Hooks**
    1.  `pnpm prepare`: Installs Husky hooks (runs automatically after install).

## 5. Project Structure

The project follows a modular structure with **Atomic Design** principles applied to components:

1.  `src/assets`: Static assets (images, fonts).
2.  `src/components`: UI components organized by Atomic Design methodology.
    1.  `atoms`: Basic building blocks (buttons, inputs, labels).
    2.  `molecules`: Simple groups of UI elements (search bars, form fields).
    3.  `organisms`: Complex UI sections (headers, footers, sidebars).
    4.  `templates`: Page-level layouts without specific content.
    5.  `ui`: Base/Headless UI primitives (Radix UI wrappers, shadcn/ui components).
3.  `src/features`: Feature-specific modules (auth, dashboard, etc.).
4.  `src/hooks`: Custom React hooks.
5.  `src/lib`: Configuration for third-party libraries (Axios, QueryClient).
6.  `src/mocks`: MSW handlers and browser worker setup.
7.  `src/provider`: Global app providers.
8.  `src/routes`: File-based routes for TanStack Router.
9.  `src/store`: Global state definitions (Zustand).
10. `src/types`: Global TypeScript type definitions.
11. `src/utils`: Helper functions.
12. `src/main.tsx`: Application entry point.

## 6. Component Architecture (Atomic Design)

This boilerplate enforces **Atomic Design** to ensure reusability and scalability. The `src/components` directory is structured as follows:

1.  **Atoms (`src/components/atoms`)**
    The smallest possible components, such as buttons, inputs, labels, and icons. These cannot be broken down further without losing their functional meaning.

2.  **Molecules (`src/components/molecules`)**
    Groups of atoms functioning together as a unit. Example: A `SearchForm` (Input atom + Button atom) or a `UserCard` (Avatar atom + Label atom).

3.  **Organisms (`src/components/organisms`)**
    Complex components composed of groups of molecules and/or atoms. These usually form distinct sections of an interface. Example: `Navbar`, `Sidebar`, `Footer`, or a `ProductGrid`.

4.  **Templates (`src/components/templates`)**
    Page-level layout components that place organisms into a proper structure. They define the "skeleton" of a page but do not contain actual content.

5.  **UI Primitives (`src/components/ui`)**
    Contains low-level, unstyled, or library-specific components (often from libraries like Radix UI or shadcn/ui). These serve as the foundation for building Atoms.

## 7. Development Guidelines

1.  **API Mocking**
    This boilerplate uses **MSW** to intercept network requests during development.
    1.  Handlers are located in `src/mocks/handlers.ts`.
    2.  To enable/disable, toggle `VITE_API_MOCKING` in your `.env`.

2.  **Commit Convention**
    We strictly enforce **Conventional Commits** via Commitlint.
    1.  `feat`: New feature (e.g., `feat: add login page`)
    2.  `fix`: Bug fix (e.g., `fix: handle null user state`)
    3.  `chore`: Tooling changes (e.g., `chore: update tailwind`)
    4.  `refactor`: Code restructuring without API changes
    5.  `style`: Formatting changes

3.  **Component Strategy**
    Prefer a "Co-location" strategy. If a component is only used within a specific feature, keep it inside `src/features/<FeatureName>`. Only promote to `src/components` if it is truly generic.

## 8. Troubleshooting

1.  **TypeScript Error: `Cannot find module './index.css'`**
    1.  **Cause**: TypeScript does not recognize CSS imports by default.
    2.  **Fix**: Ensure `src/vite-env.d.ts` exists and includes `/// <reference types="vite/client" />`.

2.  **Build Error with `tsc -b`**
    1.  **Cause**: Missing Vite types in the TypeScript configuration.
    2.  **Fix**: Add `"types": ["vite/client"]` to the `compilerOptions` in your `tsconfig.json`.

## 9. License

This project is licensed under the MIT License.