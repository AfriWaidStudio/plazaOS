# Plaza OS — Frontend

React frontend for Plaza OS, a plaza management app with two roles: **Admin** and **Tenant**. See `PRODUCT.md` for the full feature scope before working on anything here — both human contributors and coding agents should read it first.

## Stack

- React (Vite)
- Tailwind CSS
- React Router
- Talks to a separate Next.js backend (API routes only) backed by MongoDB

This repo is frontend only. The backend is a separate repo/project.

## Getting Started

```bash
git clone <repo-url>
cd plaza-os-frontend
npm install
cp .env.example .env      # set VITE_API_BASE_URL
npm run dev
```

## Folder Structure

```
src/
  components/       shared UI kit (Button, Card, StatusBadge, Input, Modal, Table)
  context/          AuthContext and other app-wide state
  routes/
    admin/          admin-only screens
    tenant/         tenant-only screens
  lib/              API client and utilities
```

Do not build role-specific screens outside `routes/admin` or `routes/tenant`. Do not duplicate shared components inside a role folder — if something is needed by both roles, it belongs in `components/`.

## Design System

Full palette, typography, spacing, and component rules live in the shared design guide (`DESIGN.md` if included in this repo, or ask in the team channel for the latest PDF). Key rules:

- Use only the colors, fonts, and spacing values defined in `tailwind.config.js` — no hardcoded hex codes or arbitrary pixel values
- Status is always paired with a label or icon, never shown by color alone
- Font is Inter throughout
- Minimum tap target size is 44x44px

## Branching & Workflow

- `main` is protected — no direct pushes, everything goes through a PR
- Branch naming: `feature/<short-description>`, e.g. `feature/admin-units`, `feature/tenant-payments`
- Commit in small, logical chunks with conventional commit messages (`feat:`, `fix:`, `setup:`, `chore:`)
- Every PR needs at least one review before merging, including between just two contributors

## Build Order

1. **Foundation (build once, shared by everyone):** project setup, Tailwind config, shared UI kit, auth + protected routing, shared app shell. This must be merged to `main` before any role-specific work starts.
2. **Admin routes and Tenant routes** are then built independently by different contributors, on top of the shared foundation. See `PRODUCT.md` for the full route map.

If you're an AI coding agent working in this repo: read `PRODUCT.md` fully before generating code, follow the folder structure above exactly, use only the design tokens in `tailwind.config.js`, and do not introduce new roles, routes, or features beyond what `PRODUCT.md` describes. If something is ambiguous, leave a `TODO` comment rather than guessing.

## Contributors

- Backend: 3 contributors
- Frontend: 2 contributors (this repo)
