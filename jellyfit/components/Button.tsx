import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  className = '',
  ...props 
}) => {
  // Classy look: slightly less rounded than full pill (rounded-lg), serif font for elegance
  const baseStyles = "flex items-center justify-center rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-navy-900 text-white hover:bg-navy-800 focus:ring-navy-500 shadow-md shadow-navy-900/10",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-200 shadow-sm",
    danger: "bg-red-50 text-red-700 border border-red-100 hover:bg-red-100 focus:ring-red-200",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-200",
    gold: "bg-gold-600 text-white hover:bg-gold-700 focus:ring-gold-500 shadow-md"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs tracking-wide uppercase",
    md: "px-5 py-2.5 text-sm tracking-wide",
    lg: "px-7 py-3.5 text-base tracking-wide font-serif"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};