import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table, Badge } from 'react-bootstrap';
import { Plus, Pencil, Trash, X, Check, XCircle } from 'react-bootstrap-icons';
import { mediaCategoriesAPI } from '../../services/api';
import AlertNotification from '../common/AlertNotification';

function CategoryManager({ show, onHide }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });
  const [showForm, setShowForm] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (show) {
      loadCategories();
      setShowForm(false);
      setEditingCategory(null);
      setFormData({ name: '' });
    }
  }, [show]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const result = await mediaCategoriesAPI.list();
      if (result && result.data) {
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to load categories',
        variant: 'danger'
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      if (editingCategory) {
        await mediaCategoriesAPI.update(editingCategory.id, formData);
        setNotification({
          message: 'Category updated successfully',
          variant: 'success'
        });
      } else {
        await mediaCategoriesAPI.create(formData);
        setNotification({
          message: 'Category created successfully',
          variant: 'success'
        });
      }
      setEditingCategory(null);
      setFormData({ name: '' });
      setShowForm(false);
      loadCategories();
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to save category',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      setLoading(true);
      await mediaCategoriesAPI.delete(id);
      setNotification({
        message: 'Category deleted successfully',
        variant: 'success'
      });
      loadCategories();
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to delete category',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      setLoading(true);
      await mediaCategoriesAPI.toggleActive(id);
      loadCategories();
    } catch (err) {
      setNotification({
        message: err.message || 'Failed to update category status',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Manage Categories</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {notification && (
          <AlertNotification
            variant={notification.variant}
            message={notification.message}
            duration={5000}
            onDismiss={() => setNotification(null)}
          />
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Categories</h5>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAdd}
            disabled={loading || showForm}
          >
            <Plus className="me-2" size={16} />
            Add Category
          </Button>
        </div>

        {!showForm ? (
          <>
            {loading && categories.length === 0 ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-4 text-muted">
                No categories found. Click "Add Category" to create one.
              </div>
            ) : (
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th style={{ width: '150px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>
                        <Badge bg={category.is_active ? 'success' : 'secondary'}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEdit(category)}
                            disabled={loading}
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant={category.is_active ? 'outline-warning' : 'outline-success'}
                            size="sm"
                            onClick={() => handleToggleActive(category.id)}
                            disabled={loading}
                            title={category.is_active ? 'Deactivate' : 'Activate'}
                          >
                            {category.is_active ? <XCircle size={14} /> : <Check size={14} />}
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            disabled={loading}
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ name: e.target.value })}
                placeholder="Enter category name"
                required
                autoFocus
              />
            </Form.Group>
            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="outline-secondary"
                onClick={handleCancel}
                disabled={loading}
              >
                <X className="me-2" size={16} />
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !formData.name.trim()}
              >
                {loading ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CategoryManager;

