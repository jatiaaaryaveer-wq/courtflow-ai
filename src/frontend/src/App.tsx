import { Layout } from "@/components/Layout";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import React from "react";

// Lazy-loaded page components
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const CourtsPage = React.lazy(() => import("@/pages/CourtsPage"));
const MatchesPage = React.lazy(() => import("@/pages/MatchesPage"));
const PlayersPage = React.lazy(() => import("@/pages/PlayersPage"));
const CategoriesPage = React.lazy(() => import("@/pages/CategoriesPage"));
const SettingsPage = React.lazy(() => import("@/pages/SettingsPage"));
const DrawsPage = React.lazy(() => import("@/pages/DrawsPage"));

// ─── Root route ──────────────────────────────────────────────────────────────

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

// ─── Route tree ────────────────────────────────────────────────────────────────

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const courtsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/courts",
  component: CourtsPage,
});

const matchesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/matches",
  component: MatchesPage,
});

const playersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/players",
  component: PlayersPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories",
  component: CategoriesPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const drawsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/draws",
  component: DrawsPage,
});

const routeTree = rootRoute.addChildren([
  dashboardRoute,
  courtsRoute,
  matchesRoute,
  drawsRoute,
  playersRoute,
  categoriesRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
