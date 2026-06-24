import { useState, useEffect } from "react";
import { useAuth } from "../AuthContext";
import { useRouter, Link } from "../RouterContext";
import { cn } from "../utils/cn";

// ─── Icons ───────────────────────────────────────────
const Icons = {
  mail: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  lock: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  google: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  ),
  apple: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  ),
  microsoft: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="2" width="9.5" height="9.5" />
      <rect x="12.5" y="2" width="9.5" height="9.5" />
      <rect x="2" y="12.5" width="9.5" height="9.5" />
      <rect x="12.5" y="12.5" width="9.5" height="9.5" />
    </svg>
  ),
  eye: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  eyeOff: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  arrowLeft: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  spinner: (
    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  gift: (
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
    </svg>
  ),
  home: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
};

// ─── Input Field ─────────────────────────────────────
function InputField({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>
        <input
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm outline-none transition-all duration-200",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-red-50/50"
              : "border-gray-200 focus:border-gift-400 focus:ring-4 focus:ring-gift-100 bg-white"
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? Icons.eyeOff : Icons.eye}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}

export default function SignIn() {
  const { signIn, signUp, isLoading, error, clearError, isAuthenticated, user } = useAuth();
  const { path, navigate } = useRouter();
  
  const isSignUpMode = path === "/signup";

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Clean errors when toggling modes
  useEffect(() => {
    clearError();
    setLocalErrors({});
  }, [path, clearError]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (isSignUpMode) {
      if (!name.trim()) errs.name = "Name is required";
      if (!email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = "Please enter a valid email";
      if (!password) errs.password = "Password is required";
      else if (password.length < 6)
        errs.password = "At least 6 characters required";
      if (password !== confirmPassword)
        errs.confirmPassword = "Passwords do not match";
      if (!agreeTerms) errs.terms = "You must agree to the terms";
    } else {
      if (!email.trim()) errs.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        errs.email = "Please enter a valid email";
      if (!password) errs.password = "Password is required";
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (!isSignUpMode) {
      await signIn(email, password);
    } else {
      await signUp(name, email, password);
    }
  };

  const handleSocialSignIn = async (provider: string) => {
    if (isSignUpMode) {
      setName("Demo User");
      const providerEmail = `${provider.toLowerCase()}@giftpin.com`;
      setEmail(providerEmail);
      setPassword("social123");
      // Short delay to let local states update before signing up
      setTimeout(() => {
        signUp("Demo User", providerEmail, "social123");
      }, 100);
    } else {
      await signIn("admin@giftpin.com", "admin123");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
      
      {/* Back to Home floating button */}
      <div className="absolute top-6 left-6 z-50">
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-100 rounded-full shadow-sm text-sm font-medium text-gray-700 transition-all hover:scale-105"
        >
          {Icons.home}
          Back to Home
        </Link>
      </div>

      {/* Left visual column */}
      <div className="lg:w-1/2 bg-gradient-to-br from-gift-600 via-gift-500 to-pin-600 relative overflow-hidden flex flex-col justify-between p-12 lg:p-20 text-white min-h-[300px] lg:min-h-screen">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-300/30 to-blue-300/30 blur-3xl" />
          <div className="absolute top-1/3 left-10 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-white/20 to-blue-200/20 blur-3xl" />
        </div>

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 z-10 self-start group">
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
            {Icons.gift}
          </div>
          <span className="text-2xl font-bold tracking-tight">GiftPin</span>
        </Link>

        {/* Promotional content */}
        <div className="my-auto max-w-lg z-10 space-y-6 pt-10 pb-6 lg:py-0">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Connecting Hearts Across Borders.
          </h1>
          <p className="text-white/80 text-base lg:text-lg leading-relaxed">
            Register your gifts, monitor their live locations, and craft unforgettable surprise unboxing experiences for your loved ones anywhere in the world.
          </p>
          <div className="pt-6 space-y-4">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-gift-500/20 flex items-center justify-center text-gift-300">
                🛡️
              </div>
              <div>
                <h4 className="font-semibold text-sm">Secure and Protected</h4>
                <p className="text-xs text-white/70">Optional transit insurance covers every gift sent.</p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-pin-500/20 flex items-center justify-center text-pin-300">
                📍
              </div>
              <div>
                <h4 className="font-semibold text-sm">Emotional PIN Tracking</h4>
                <p className="text-xs text-white/70">Journey timeline updates you and your recipient in real time.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-white/60 text-xs hidden lg:block">
          &copy; {new Date().getFullYear()} GiftPin. All rights reserved. Secure SSL encryption activated.
        </div>
      </div>

      {/* Right form column */}
      <div className="lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 relative">
        
        {/* Background blobs for right side */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-gift-200/10 to-pin-200/10 blur-3xl" />
        </div>

        <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-3xl p-8 sm:p-10 relative z-10 animate-slide-up">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">
              {isSignUpMode ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              {isSignUpMode
                ? "Join GiftPin to start sending emotional gifts today."
                : "Sign in to monitor your packages and send new ones."}
            </p>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <button
              onClick={() => handleSocialSignIn("Google")}
              className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-xs text-gray-700"
              title="Google Log In"
            >
              {Icons.google}
            </button>
            <button
              onClick={() => handleSocialSignIn("Apple")}
              className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-xs text-gray-700"
              title="Apple Log In"
            >
              {Icons.apple}
            </button>
            <button
              onClick={() => handleSocialSignIn("Microsoft")}
              className="flex items-center justify-center py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-medium text-xs text-gray-700"
              title="Microsoft Log In"
            >
              {Icons.microsoft}
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Or continue with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUpMode && (
              <InputField
                icon={Icons.user}
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="John Doe"
                error={localErrors.name}
              />
            )}

            <InputField
              icon={Icons.mail}
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="john@example.com"
              error={localErrors.email}
            />

            <InputField
              icon={Icons.lock}
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder={isSignUpMode ? "Choose password (6+ chars)" : "Enter your password"}
              error={localErrors.password}
            />

            {isSignUpMode && (
              <InputField
                icon={Icons.lock}
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirm your password"
                error={localErrors.confirmPassword}
              />
            )}

            {/* Remember Me / Forgot Password */}
            {!isSignUpMode && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-gift-600 focus:ring-gift-500"
                  />
                  <span className="text-xs text-gray-500 font-medium">Remember me</span>
                </label>
                <button type="button" className="text-xs font-semibold text-gift-600 hover:text-gift-700 transition-colors">
                  Forgot password?
                </button>
              </div>
            )}

            {/* Terms checkbox */}
            {isSignUpMode && (
              <div>
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-gift-600 focus:ring-gift-500 mt-0.5"
                  />
                  <span className="text-xs text-gray-500 leading-normal">
                    I agree to the{" "}
                    <a href="#" className="text-gift-600 hover:underline font-semibold">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-gift-600 hover:underline font-semibold">Privacy Policy</a>.
                  </span>
                </label>
                {localErrors.terms && (
                  <p className="text-xs text-red-500 mt-1">{localErrors.terms}</p>
                )}
              </div>
            )}

            {/* Server Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gift-500 to-pin-600 text-white font-bold rounded-xl px-6 py-4 shadow-lg shadow-gift-200 hover:shadow-xl hover:shadow-gift-300 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  {Icons.spinner}
                  {isSignUpMode ? "Creating Account..." : "Signing In..."}
                </>
              ) : isSignUpMode ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Demo Hint Card */}
          <div className="mt-6 bg-gift-50/50 border border-gift-100 rounded-2xl p-4 space-y-1">
            <h5 className="text-xs font-bold text-gift-800 flex items-center gap-1.5">
              <span>💡</span> Developer Demo Credentials
            </h5>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              <span className="font-semibold">User:</span> <code className="bg-white px-1.5 py-0.5 border border-gift-100 rounded text-gift-700 font-mono">john@example.com</code> / <code className="bg-white px-1.5 py-0.5 border border-gift-100 rounded text-gift-700 font-mono">password123</code>
              <br />
              <span className="font-semibold">Admin:</span> <code className="bg-white px-1.5 py-0.5 border border-gift-100 rounded text-gift-700 font-mono">admin@giftpin.com</code> / <code className="bg-white px-1.5 py-0.5 border border-gift-100 rounded text-gift-700 font-mono">admin123</code>
            </p>
          </div>

          {/* Toggle login/signup mode */}
          <div className="text-center mt-6 pt-6 border-t border-gray-50">
            <p className="text-sm text-gray-500">
              {isSignUpMode ? "Already have an account?" : "New to GiftPin?"}{" "}
              <button
                type="button"
                onClick={() => navigate(isSignUpMode ? "/signin" : "/signup")}
                className="font-bold text-gift-600 hover:text-gift-700 transition-colors"
              >
                {isSignUpMode ? "Sign In" : "Create Account"}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
