import React from 'react';

export const Alert = ({ children, type = 'info' }) => {
  const alertStyles = {
    base: 'p-4 rounded-md shadow-md flex items-start',
    types: {
      info: 'bg-blue-50 text-blue-800 border-blue-300',
      success: 'bg-green-50 text-green-800 border-green-300',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-300',
      error: 'bg-red-50 text-red-800 border-red-300',
    },
  };

  const typeClass = alertStyles.types[type] || alertStyles.types.info;

  return (
    <div className={`${alertStyles.base} ${typeClass}`}>
      {children}
    </div>
  );
};

export const AlertTitle = ({ children }) => (
  <h4 className="font-bold text-lg mb-1">{children}</h4>
);

export const AlertDescription = ({ children }) => (
  <p className="text-sm">{children}</p>
);
