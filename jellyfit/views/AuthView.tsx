
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { authService } from '../services/authService';

interface AuthViewProps {
  onSuccess: (user: any) => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await authService.login(formData.email, formData.password);
        onSuccess(user);
      } else {
        if (!formData.name) throw new Error("Name is required");
        const user = await authService.signup(formData.name, formData.email, formData.password);
        onSuccess(user);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await authService.mockGoogleLogin();
      onSuccess(user);
    } catch (err) {
      setError("Google sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-64 bg-navy-900 rounded-b-[3rem] z-0"></div>
      
      <div className="z-10 w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center mb-8">
          <h1 className="font-serif font-bold text-3xl text-navy-900 tracking-tight">JellyFit</h1>
          <p className="text-slate-400 text-sm font-medium mt-2">Train smarter, not harder.</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl mb-8 relative">
          <div 
            className={`absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${isLogin ? 'left-1' : 'left-[calc(50%-4px)] translate-x-1'}`}
          ></div>
          <button 
            onClick={() => { setIsLogin(true); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold text-center relative z-10 transition-colors ${isLogin ? 'text-navy-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setIsLogin(false); setError(null); }}
            className={`flex-1 py-2 text-sm font-bold text-center relative z-10 transition-colors ${!isLogin ? 'text-navy-900' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-navy-500 transition-colors" size={20} />
              <input 
                name="name"
                type="text" 
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-navy-500 transition-colors" size={20} />
            <input 
              name="email"
              type="email" 
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-3.5 text-slate-300 group-focus-within:text-navy-500 transition-colors" size={20} />
            <input 
              name="password"
              type="password" 
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-4 text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-navy-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg flex items-center">
              <AlertCircle size={14} className="mr-2" /> {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full shadow-lg shadow-navy-900/20 mt-2"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-slate-100"></div>
          <span className="px-4 text-xs text-slate-300 font-bold uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-slate-100"></div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            By continuing, you agree to JellyFit's <a href="#" className="underline hover:text-navy-600">Terms</a> & <a href="#" className="underline hover:text-navy-600">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};
