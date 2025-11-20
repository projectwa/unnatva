import React, { createContext, useContext, useState, useEffect } from 'react';
import EnquiryForm from './EnquiryForm';

const EnquiryFormContext = createContext();

export const useEnquiryForm = () => {
  const context = useContext(EnquiryFormContext);
  if (!context) {
    throw new Error('useEnquiryForm must be used within EnquiryFormProvider');
  }
  return context;
};

export function EnquiryFormProvider({ children }) {
  const [show, setShow] = useState(false);
  const [sourcePage, setSourcePage] = useState('');

  useEffect(() => {
    const handleOpenEnquiryForm = (event) => {
      console.log('EnquiryFormProvider: Received openEnquiryForm event', event.detail);
      const page = event.detail?.sourcePage || '';
      setSourcePage(page);
      setShow(true);
      console.log('EnquiryFormProvider: Setting show to true');
    };

    // Set up listener immediately - use capture phase to catch events early
    // This ensures the listener is ready before any buttons are clicked
    window.addEventListener('openEnquiryForm', handleOpenEnquiryForm, true);
    
    console.log('EnquiryFormProvider: Event listener attached');
    
    return () => {
      window.removeEventListener('openEnquiryForm', handleOpenEnquiryForm, true);
    };
  }, []);

  const openEnquiryForm = (page = '') => {
    setSourcePage(page);
    setShow(true);
  };

  const closeEnquiryForm = () => {
    setShow(false);
    setSourcePage('');
  };

  return (
    <EnquiryFormContext.Provider value={{ openEnquiryForm }}>
      {children}
      <EnquiryForm 
        show={show} 
        onHide={closeEnquiryForm}
        sourcePage={sourcePage}
      />
    </EnquiryFormContext.Provider>
  );
}

