import React from 'react';

export default function Card({
  title,
  subtitle,
  children,
  action,
  className = '',
  bodyClassName = '',
  hoverEffect = false
}) {
  return (
    <div className={`
      bg-white rounded-xl border border-navy-100 shadow-sm overflow-hidden transition-all duration-300
      ${hoverEffect ? 'hover:shadow-md hover:border-navy-200 hover:-translate-y-0.5' : ''}
      ${className}
    `}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-navy-50 flex items-center justify-between bg-navy-50/10">
          <div>
            {title && <h3 className="text-sm font-bold text-navy-900">{title}</h3>}
            {subtitle && <p className="text-xs text-navy-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className={`px-6 py-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
}
