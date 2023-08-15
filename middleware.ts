// Protect routes

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    // Protects all of the users routes
    "/users/:path*",
    "/conversations/:path*",
  ],
};
