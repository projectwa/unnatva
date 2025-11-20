import React from 'react';
import { EnquiryFormProvider } from '../components/EnquiryFormProvider';

// App-wide providers (Context, Theme, etc.)
export function AppProvider({ children }) {
  return (
    <EnquiryFormProvider>
      {children}
    </EnquiryFormProvider>
  );
}

