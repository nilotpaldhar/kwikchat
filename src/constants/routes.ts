/**
 * An array of routes that are accessible to public
 * These routes do not require authentication
 */
export const PUBLIC_ROUTES = ["/", "/verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 */
export const AUTH_ROUTES = ["/sign-in", "/sign-up"];

/**
 * The prefix for api authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 */
export const API_AUTH_PREFIX = "/api/auth" as const;

/**
 * The default redirect path after logging in
 */
export const DEFAULT_LOGIN_REDIRECT = "/messenger" as const;
