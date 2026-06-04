import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  error = '',
  required = false,
  disabled = false,
  className = '',
  min,
  max,
  step,
  ...props
}) {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-navy-800 flex items-center">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          required={required}
          className={`
            w-full px-3.5 py-2 text-sm rounded-lg border bg-white text-navy-900 transition-all duration-200 outline-none
            focus:ring-2 focus:ring-offset-0
            ${error 
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' 
              : 'border-navy-200 focus:border-navy-500 focus:ring-navy-100'}
            ${disabled ? 'bg-navy-50 text-navy-400 cursor-not-allowed border-navy-150' : 'hover:border-navy-300'}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs font-medium text-rose-500 animate-slide-down">
          {error}
        </span>
      )}
    </div>
  );
}
