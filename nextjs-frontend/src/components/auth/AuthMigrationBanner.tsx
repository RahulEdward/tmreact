"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { AlertCircle, ArrowRight, X, Shield } from "lucide-react";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";

interface AuthMigrationBannerProps {
  className?: string;
}

export function AuthMigrationBanner({ className = "" }: AuthMigrationBannerProps) {
  const { authType, isAuthenticated } = useUnifiedAuth();
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show for legacy auth users
  if (!isAuthenticated || authType !== "legacy" || isDismissed) {
    return null;
  }

  return (
    <div className={`bg-gradient-to-r from-violet-500/10 to-cyan-500/10 border border-violet-500/20 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <Shield className="h-5 w-5 text-violet-400 mt-0.5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">
                Upgrade to Enhanced Security
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Switch to our new authentication system for improved security, better session management, and enhanced features.
              </p>
              
              <div className="mt-3 flex items-center space-x-3">
                <Link href="/new-register">
                  <Button size="sm" variant="gradient" className="text-xs">
                    Create New Account
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
                
                <Link href="/new-login">
                  <Button size="sm" variant="outline" className="text-xs">
                    Already have new account?
                  </Button>
                </Link>
              </div>
            </div>
            
            <button
              onClick={() => setIsDismissed(true)}
              className="flex-shrink-0 ml-4 text-slate-400 hover:text-slate-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Full-page migration prompt for critical pages
 */
export function AuthMigrationModal() {
  const { authType, isAuthenticated, logout } = useUnifiedAuth();
  const [isVisible, setIsVisible] = useState(true);

  // Only show for legacy auth users
  if (!isAuthenticated || authType !== "legacy" || !isVisible) {
    return null;
  }

  const handleLogoutAndRedirect = async () => {
    await logout();
    // User will be redirected to new login by the logout function
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Security Upgrade Available</h2>
            <p className="text-sm text-slate-400">Enhanced authentication system</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-white mb-2">New Features:</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Enhanced security with modern encryption</li>
              <li>• Better session management</li>
              <li>• Improved user experience</li>
              <li>• Multi-device support</li>
            </ul>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-200">
                You're currently using our legacy authentication system. 
                We recommend upgrading for better security.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Link href="/new-register" className="block">
            <Button className="w-full" variant="gradient">
              Create New Account
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>

          <div className="flex space-x-3">
            <Link href="/new-login" className="flex-1">
              <Button className="w-full" variant="outline">
                I have new account
              </Button>
            </Link>
            
            <Button
              onClick={() => setIsVisible(false)}
              variant="ghost"
              className="flex-1"
            >
              Maybe later
            </Button>
          </div>

          <button
            onClick={handleLogoutAndRedirect}
            className="w-full text-center text-sm text-slate-400 hover:text-slate-300 transition-colors"
          >
            Logout and switch to new system
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact migration notice for navigation bars
 */
export function AuthMigrationNotice() {
  const { authType, isAuthenticated } = useUnifiedAuth();

  if (!isAuthenticated || authType !== "legacy") {
    return null;
  }

  return (
    <div className="bg-violet-500/10 border border-violet-500/20 rounded-md px-3 py-2">
      <div className="flex items-center space-x-2">
        <Shield className="h-4 w-4 text-violet-400" />
        <span className="text-sm text-violet-200">Legacy Auth</span>
        <Link href="/new-register">
          <Button size="sm" variant="ghost" className="text-xs text-violet-300 hover:text-violet-200">
            Upgrade
          </Button>
        </Link>
      </div>
    </div>
  );
}