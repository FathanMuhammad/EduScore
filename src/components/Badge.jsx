import React from 'react';

export default function Badge({ status }) {
  const isLulus = status === 'Lulus' || status === true || status === 'Ya';
  
  if (isLulus) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 transition-all duration-300 hover:scale-105">
        <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        Lulus
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 transition-all duration-300 hover:scale-105">
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-rose-500 animate-pulse"></span>
      Tidak Lulus
    </span>
  );
}
