import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import CaseStudy from "./pages/CaseStudy";
import Portfolio from "./pages/Portfolio";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Portfolio,
});

const caseStudyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/works/$projectId",
  component: CaseStudy,
});

const routeTree = rootRoute.addChildren([indexRoute, caseStudyRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
