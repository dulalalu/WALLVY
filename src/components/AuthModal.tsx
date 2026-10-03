import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, KeyRound, ArrowRight, 
  CheckCircle2, RefreshCw, Sparkles, ShieldCheck, AlertCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  signUpWithEmail, verifyEmailOtp, signInWithEmail, 
  signInWithGoogle, requestPasswordReset, confirmPasswordReset, 
  resendOtp 
} from '../services/supabaseAuth';
import { BRANDING } from '../config/branding';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'login' | 'signup';
}

type AuthMode = 'login' | 'signup' | 'otp_verify' | 'forgot_password' | 'reset_confirm';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [simulatedOtpNotice, setSimulatedOtpNotice] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      setSimulatedOtpNotice(null);
    }
  }, [isOpen, initialMode]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Listen for simulated OTP event
  useEffect(() => {
    const handleOtpSent = (e: any) => {
      if (e.detail?.code) {
        setSimulatedOtpNotice(e.detail.code);
      }
    };
    window.addEventListener('wallvy_otp_sent', handleOtpSent);
    return () => window.removeEventListener('wallvy_otp_sent', handleOtpSent);
  }, []);

  if (!isOpen) return null;

  // Handle Signup
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUpWithEmail(fullName, email, password);
      if (res.success) {
        setSuccessMessage(res.message);
        if (res.otpCode) setSimulatedOtpNotice(res.otpCode);
        setResendCooldown(30);
        setMode('otp_verify');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the full 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyEmailOtp(email, otpCode);
      if (res.success) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setSuccessMessage(res.message);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 1500);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await signInWithEmail(email, password);
      if (res.success) {
        setSuccessMessage('Logged in successfully!');
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        onSuccess?.();
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in error.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Request Password Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your registered email.');
      return;
    }

    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      if (res.success) {
        setSuccessMessage(res.message);
        if (res.resetOtp) setSimulatedOtpNotice(res.resetOtp);
        setMode('reset_confirm');
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Confirm Reset
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setErrorMessage('Please enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage('New password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await confirmPasswordReset(email, otpCode, newPassword);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setMode('login');
          setSuccessMessage('Password reset! Please log in with your new password.');
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Password update failed.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend Code
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    try {
      const res = await resendOtp(email);
      if (res.success) {
        setSuccessMessage(res.message);
        if (res.otpCode) setSimulatedOtpNotice(res.otpCode);
        setResendCooldown(30);
      } else {
        setErrorMessage(res.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0c0e24] border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 p-1 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <img src={BRANDING.logoUrl} alt={BRANDING.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                  {BRANDING.name}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Auth</span>
              </div>
              <p className="text-xs text-slate-400">
                {mode === 'signup' && 'Create your free account'}
                {mode === 'otp_verify' && 'Verify your email address'}
                {mode === 'login' && 'Sign in to your account'}
                {mode === 'forgot_password' && 'Reset your password'}
                {mode === 'reset_confirm' && 'Enter reset code & new password'}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Quick OTP Helper Banner for Test Users */}
          {simulatedOtpNotice && (mode === 'otp_verify' || mode === 'reset_confirm') && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-xs text-cyan-200 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Simulated Email OTP: <strong className="text-white text-sm font-mono tracking-widest">{simulatedOtpNotice}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setOtpCode(simulatedOtpNotice)}
                className="px-2.5 py-1 rounded-lg bg-cyan-400 text-slate-950 font-bold text-[10px] hover:bg-cyan-300 transition"
              >
                Auto-fill
              </button>
            </div>
          )}

          {/* 1. SIGNUP VIEW */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/30 border border-cyan-800/30 flex items-center gap-2.5 text-[11px] text-cyan-300">
                <ShieldCheck className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>You'll get an instant 6-digit email OTP + 50 free bonus coins on signup!</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Send Verification OTP</span>
              </button>
            </form>
          )}

          {/* 2. OTP VERIFICATION VIEW */}
          {mode === 'otp_verify' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5 text-center">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
                <KeyRound className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">Enter 6-Digit OTP</h4>
                <p className="text-xs text-slate-400">
                  We sent a confirmation code to <span className="text-cyan-300 font-semibold">{email}</span>
                </p>
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="• • • • • •"
                  className="w-full tracking-[0.5em] text-center text-xl font-mono py-3 rounded-2xl bg-white/[0.05] border border-cyan-500/40 text-cyan-300 placeholder-slate-600 focus:border-cyan-400 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Verify & Claim 50 Coins Bonus</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="hover:text-white transition"
                >
                  Change Email
                </button>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || loading}
                  onClick={handleResend}
                  className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition font-medium"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          )}

          {/* 3. LOGIN VIEW */}
          {mode === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@wallvy.app"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Password</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot_password')}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                  <span>Sign In</span>
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500">
                  <span className="bg-[#0c0e24] px-3">Or continue with</span>
                </div>
              </div>

              {/* Google Sign-in Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-white font-semibold text-xs transition flex items-center justify-center gap-3 hover:border-cyan-500/40"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* 4. FORGOT PASSWORD VIEW */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Registered Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white placeholder-slate-500 text-xs outline-none transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>Send Password Reset Code</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-white transition"
              >
                Back to Sign In
              </button>
            </form>
          )}

          {/* 5. CONFIRM PASSWORD RESET VIEW */}
          {mode === 'reset_confirm' && (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">6-Digit Reset Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full tracking-widest text-center text-lg font-mono py-2.5 rounded-2xl bg-white/[0.05] border border-cyan-500/40 text-cyan-300 outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/10 focus:border-cyan-400 text-white text-xs outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </form>
          )}

        </div>

        {/* Modal Bottom Switcher */}
        <div className="p-4 border-t border-white/10 bg-[#070919] text-center text-xs text-slate-400">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign up free
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-cyan-400 font-bold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          {(mode === 'otp_verify' || mode === 'forgot_password' || mode === 'reset_confirm') && (
            <button
              type="button"
              onClick={() => setMode('login')}
              className="text-slate-400 hover:text-white transition font-medium"
            >
              Return to Login
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
