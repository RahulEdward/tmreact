"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireNewAuth?: boolean;
  requireLegacyAuth?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo,
  requireNewAuth = false,
  requireLegacyAuth = false,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authType } = useUnifiedAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not authenticated at all
        const defaultRedirect = authType === "legacy" ? "/login" : "/new-login";
        router.push(redirectTo || defaultRedirect);
        return;
      }

      if (requireNewAuth && authType !== "new") {
        // Requires new auth but user is using legacy auth
        router.push("/new-login");
        return;
      }

      if (requireLegacyAuth && authType !== "legacy") {
        // Requires legacy auth but user is using new auth
        router.push("/login");
        return;
      }
    }
  }, [isAuthenticated, isLoading, authType, router, redirectTo, requireNewAuth, requireLegacyAuth]);

  // Show loading state
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </div>
      )
    );
  }

  // Show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Check specific auth type requirements
  if (requireNewAuth && authType !== "new") {
    return null;
  }

  if (requireLegacyAuth && authType !== "legacy") {
    return null;
  }

  // User is authenticated and meets requirements
  return <>{children}</>;
}

/**
 * Higher-order component for protecting pages
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    redirectTo?: string;
    requireNewAuth?: boolean;
    requireLegacyAuth?: boolean;
    fallback?: React.ReactNode;
  }
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

/**
 * Component for showing different content based on auth status
 */
interface AuthGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  requireNewAuth?: boolean;
  requireLegacyAuth?: boolean;
}

export function AuthGate({
  children,
  fallback,
  loadingFallback,
  requireNewAuth = false,
  requireLegacyAuth = false,
}: AuthGateProps) {
  const { isAuthenticated, isLoading, authType } = useUnifiedAuth();

  if (isLoading) {
    return (
      loadingFallback || (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return fallback || null;
  }

  if (requireNewAuth && authType !== "new") {
    return fallback || null;
  }

  if (requireLegacyAuth && authType !== "legacy") {
    return fallback || null;
  }

  return <>{children}</>;
}

/**
 * Component for showing content only to unauthenticated users
 */
interface GuestOnlyProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function GuestOnly({ children, redirectTo }: GuestOnlyProps) {
  const { isAuthenticated, isLoading, authType } = useUnifiedAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const defaultRedirect = authType === "new" ? "/dashboard" : "/dashboard";
      router.push(redirectTo || defaultRedirect);
    }
  }, [isAuthenticated, isLoading, authType, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}