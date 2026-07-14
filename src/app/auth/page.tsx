"use client";
// src/app/auth/page.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/infrastructure/services/authService";
import { Radar, Eye, EyeOff, Mail, Lock, User, ArrowRight, Shield } from "lucide-react";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!isLogin && fullName.trim().length === 0) {
      setError("Full name is required.");
      return;
    }
    if (!isLogin && fullName.trim().length > 100) {
      setError("Full name must be at most 100 characters.");
      return;
    }
    if (!isLogin && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await authService.signIn(email, password);
        router.push("/");
      } else {
        await authService.signUp(email, password, fullName);
        setSuccess(
          "Account created! Check your email to confirm, then sign in."
        );
        setIsLogin(true);
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,212,170,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,212,170,0.1) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-1/2 h-48 blur-3xl pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at bottom, rgba(14,165,233,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4 animate-fade-in">
        <div className="bg-surface-1 border border-border-default rounded-3xl p-8 shadow-panel">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-accent-muted flex items-center justify-center mb-4 shadow-card-glow">
              <Radar size={26} className="text-accent-primary" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Urban Density Monitor
            </h1>
            <p className="text-sm text-text-muted mt-1.5">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          {/* Error / Success banners */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 bg-status-danger/10 border border-status-danger/20 text-status-danger p-3.5 rounded-xl text-sm animate-slide-up">
              <span className="w-1.5 h-1.5 rounded-full bg-status-danger flex-shrink-0 mt-1.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 flex items-start gap-2.5 bg-status-success/10 border border-status-success/20 text-status-success p-3.5 rounded-xl text-sm animate-slide-up">
              <span className="w-1.5 h-1.5 rounded-full bg-status-success flex-shrink-0 mt-1.5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (register only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                  />
                  <input
                    id="auth-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    maxLength={100}
                    className="w-full bg-surface-2 border border-border-default rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-surface-3 transition-all duration-200"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-surface-2 border border-border-default rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-surface-3 transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
                />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLogin ? "••••••••" : "Min. 8 characters"}
                  minLength={isLogin ? 6 : 8}
                  className="w-full bg-surface-2 border border-border-default rounded-xl pl-10 pr-10 py-2.5 text-sm text-text-primary placeholder-text-muted/50 focus:outline-none focus:border-accent-primary/50 focus:bg-surface-3 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-accent-gradient hover:opacity-90 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2 group shadow-card-glow"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Please wait…
                </>
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center text-sm text-text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="text-accent-primary hover:text-accent-hover font-semibold transition-colors"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-muted/40 mt-4">
          Urban Density Monitor · ML Vision Dashboard · v3.0
        </p>
      </div>
    </div>
  );
}
