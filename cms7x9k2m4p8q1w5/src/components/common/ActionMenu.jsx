import React from 'react';
import { Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ThreeDotsVertical } from 'react-bootstrap-icons';

/**
 * ActionMenu Component
 * A space-efficient dropdown menu for table row actions
 * 
 * Smart behavior:
 * - 1-2 actions: Show as icon buttons with tooltips
 * - 3+ actions: Show 2 primary actions + dropdown for rest
 * 
 * @param {Array} actions - Array of action objects: [{ label, icon, onClick, variant, disabled, primary }]
 * @param {Number} maxVisible - Maximum number of actions to show before using dropdown (default: 2)
 */
function ActionMenu({ actions = [], maxVisible = 2 }) {
  if (!actions || actions.length === 0) {
    return null;
  }

  // Sort actions: primary first, then by order
  const sortedActions = [...actions].sort((a, b) => {
    if (a.primary && !b.primary) return -1;
    if (!a.primary && b.primary) return 1;
    return 0;
  });

  const visibleActions = sortedActions.slice(0, maxVisible);
  const hiddenActions = sortedActions.slice(maxVisible);

  return (
    <div className="d-flex gap-1 align-items-center">
      {/* Show primary actions as icon buttons */}
      {visibleActions.map((action, index) => {
        const Icon = action.icon;
        const isDanger = action.variant === 'danger';
        return (
          <OverlayTrigger
            key={index}
            placement="top"
            overlay={<Tooltip>{action.label}</Tooltip>}
          >
            <button
              className="btn btn-sm btn-cms-outline d-flex align-items-center justify-content-center"
              onClick={action.onClick}
              disabled={action.disabled}
              style={{ 
                width: '32px', 
                height: '32px', 
                padding: 0,
                borderColor: isDanger ? '#dc3545' : 'var(--cms-primary)',
                borderRadius: 'var(--cms-radius-md)'
              }}
              aria-label={action.label}
            >
              {Icon && <Icon size={16} style={{ color: isDanger ? '#dc3545' : 'var(--cms-primary)' }} />}
            </button>
          </OverlayTrigger>
        );
      })}

      {/* Show dropdown for additional actions */}
      {hiddenActions.length > 0 && (
        <Dropdown align="end" drop="down">
          <Dropdown.Toggle
            variant="outline-secondary"
            size="sm"
            className="btn-cms-outline d-flex align-items-center justify-content-center"
            style={{ 
              width: '32px', 
              height: '32px', 
              padding: 0,
              border: '1px solid var(--cms-gray-300)',
              borderRadius: 'var(--cms-radius-md)'
            }}
            id={`action-menu-${Math.random().toString(36).substr(2, 9)}`}
            aria-label="More actions"
          >
            <ThreeDotsVertical size={16} />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {hiddenActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Dropdown.Item
                  key={index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className="d-flex align-items-center gap-2"
                >
                  {Icon && <Icon size={16} />}
                  <span>{action.label}</span>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default ActionMenu;
