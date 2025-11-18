import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Save, Key } from 'react-bootstrap-icons';
import { settingsAPI, authAPI } from '../services/api';
import AlertNotification from '../components/common/AlertNotification';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState([]);
  const [groupedSettings, setGroupedSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const result = await settingsAPI.list();
      setSettings(result.data || []);
      setGroupedSettings(result.grouped || {});
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load settings',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (id, field, value) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, [field]: value } : setting
    ));
    
    setGroupedSettings(prev => {
      const newGrouped = { ...prev };
      Object.keys(newGrouped).forEach(group => {
        newGrouped[group] = newGrouped[group].map(setting =>
          setting.id === id ? { ...setting, [field]: value } : setting
        );
      });
      return newGrouped;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setNotification(null);

    try {
      const settingsToUpdate = settings.map(setting => ({
        id: setting.id,
        value: setting.value,
        type: setting.type,
        group: setting.group,
        description: setting.description,
      }));

      await settingsAPI.bulkUpdate(settingsToUpdate);
      setNotification({
        message: 'Settings saved successfully!',
        variant: 'success'
      });
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save settings',
        variant: 'danger'
      });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    setNotification(null);

    try {
      if (passwordData.new_password !== passwordData.confirm_password) {
        setNotification({
          message: 'New password and confirm password do not match',
          variant: 'danger'
        });
        setChangingPassword(false);
        return;
      }

      if (passwordData.new_password.length < 8) {
        setNotification({
          message: 'New password must be at least 8 characters long',
          variant: 'danger'
        });
        setChangingPassword(false);
        return;
      }

      await authAPI.changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );

      setNotification({
        message: 'Password changed successfully!',
        variant: 'success'
      });

      // Reset form
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowPasswordForm(false);
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to change password',
        variant: 'danger'
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const renderSettingField = (setting) => {
    const handleValueChange = (e) => {
      handleChange(setting.id, 'value', e.target.value);
    };

    switch (setting.type) {
      case 'boolean':
        return (
          <Form.Check
            type="switch"
            id={`setting-${setting.id}`}
            label={setting.description || setting.key}
            checked={setting.value === '1' || setting.value === 'true' || setting.value === true}
            onChange={(e) => handleChange(setting.id, 'value', e.target.checked ? '1' : '0')}
          />
        );
      case 'textarea':
        return (
          <Form.Control
            as="textarea"
            rows={4}
            value={setting.value || ''}
            onChange={handleValueChange}
            className="form-control-cms"
            placeholder={setting.description}
          />
        );
      case 'number':
      case 'integer':
        return (
          <Form.Control
            type="number"
            value={setting.value || ''}
            onChange={handleValueChange}
            className="form-control-cms"
            placeholder={setting.description}
          />
        );
      default:
        return (
          <Form.Control
            type="text"
            value={setting.value || ''}
            onChange={handleValueChange}
            className="form-control-cms"
            placeholder={setting.description}
          />
        );
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="cms-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {notification && (
        <AlertNotification
          variant={notification.variant}
          message={notification.message}
          duration={5000}
          onDismiss={() => setNotification(null)}
        />
      )}

      <div className="mb-4">
        <h1 className="h3 mb-2">Settings</h1>
        <p className="text-muted small">Manage application settings</p>
      </div>

      {/* Password Change Card */}
      <Card className="card-cms mb-3">
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <Key className="me-2" size={18} />
              Change Password
            </h5>
            <Button
              variant="outline"
              size="sm"
              className="btn-cms-outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
        </Card.Header>
        {showPasswordForm && (
          <Card.Body>
            <Form onSubmit={handlePasswordSubmit}>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      required
                      className="form-control-cms"
                      placeholder="Enter current password"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="form-control-cms"
                      placeholder="Enter new password (min 8 chars)"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password *</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      required
                      minLength={8}
                      className="form-control-cms"
                      placeholder="Confirm new password"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  className="btn-cms-primary"
                  disabled={changingPassword}
                >
                  <Key className="me-2" size={18} />
                  {changingPassword ? 'Changing...' : 'Change Password'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        )}
      </Card>

      <Form onSubmit={handleSubmit}>
        {Object.keys(groupedSettings).length === 0 ? (
          <Card className="card-cms">
            <Card.Body>
              <p className="text-muted">No settings found. Create settings using the API or database.</p>
            </Card.Body>
          </Card>
        ) : (
          Object.keys(groupedSettings).map((group) => (
            <Card key={group} className="card-cms mb-3">
              <Card.Header>
                <h5 className="mb-0">
                  {group.charAt(0).toUpperCase() + group.slice(1)} Settings
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  {groupedSettings[group].map((setting) => (
                    <Col key={setting.id} md={6} className="mb-3">
                      <Form.Group>
                        <Form.Label>
                          {setting.key}
                          {setting.description && (
                            <Form.Text className="d-block text-muted small">
                              {setting.description}
                            </Form.Text>
                          )}
                        </Form.Label>
                        {renderSettingField(setting)}
                      </Form.Group>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          ))
        )}

        <div className="d-flex justify-content-end">
          <Button
            type="submit"
            className="btn-cms-primary"
            disabled={saving || settings.length === 0}
          >
            <Save className="me-2" size={18} />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default Settings;
