import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './AlertNotification.css';

/**
 * AlertNotification Component
 * Displays alert/notification messages with yellow background
 * Auto-dismisses after specified duration
 */
function AlertNotification({ 
  variant = 'warning', 
  message, 
  duration = 3000,
  onDismiss,
  show = true 
}) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    setVisible(show);
  }, [show]);

  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <Alert 
      variant={variant} 
      className="cms-alert-notification"
      dismissible
      onClose={() => {
        setVisible(false);
        if (onDismiss) {
          onDismiss();
        }
      }}
    >
      {message}
    </Alert>
  );
}

export default AlertNotification;

