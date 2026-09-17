import React from 'react';

export default function LoadingSpinner({ message = 'Loading Executive Data...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-3"></div>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
