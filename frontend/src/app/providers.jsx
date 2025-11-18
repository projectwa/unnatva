import React from 'react';

// App-wide providers (Context, Theme, etc.)
export function AppProvider({ children }) {
  return (
    <>
      {children}
    </>
  );
}

