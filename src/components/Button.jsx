import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-navy-800 text-white hover:bg-navy-900 active:bg-navy-950 focus:ring-navy-500 border border-transparent shadow-sm',
    secondary: 'bg-white text-navy-800 hover:bg-navy-50 border border-navy-200 focus:ring-navy-500 shadow-sm',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:ring-rose-500 border border-transparent shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500 border border-transparent shadow-sm',
    warning: 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 focus:ring-amber-400 border border-transparent shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed transform-none';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles} 
        ${variants[variant] || variants.primary} 
        ${sizes[size] || sizes.md} 
        ${(disabled || loading) ? disabledStyles : 'hover:scale-[1.02] active:scale-[0.98]'} 
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className={`mr-2 ${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
      {children}
    </button>
  );
}
