import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/feed(.*)",
  "/messages(.*)",
  "/communities(.*)",
  "/jobs(.*)",
  "/profile(.*)",
  "/companies(.*)",
  "/placement(.*)",
  "/events(.*)",
  "/resources(.*)",
  "/settings(.*)",
  "/admin(.*)",
  "/setup-profile(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|.*\\..*).*)",
    "/(api|trpc)(.*)",
  ],
};
