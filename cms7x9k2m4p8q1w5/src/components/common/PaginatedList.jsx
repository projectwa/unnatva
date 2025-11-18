import React, { useState, useEffect } from 'react';
import { Table, Pagination, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Filter } from 'react-bootstrap-icons';
import './PaginatedList.css';

/**
 * PaginatedList Component
 * Displays paginated data with filtering and lazy loading
 * 
 * @param {Array} data - Full dataset (will be paginated)
 * @param {Function} renderRow - Function to render each row: (item, index) => JSX
 * @param {Array} columns - Column definitions: [{ key, label, sortable }]
 * @param {Number} itemsPerPage - Number of items per page (default: 10)
 * @param {Function} onFilter - Optional filter function: (searchTerm) => filteredData
 * @param {Boolean} showSearch - Show search input (default: true)
 * @param {Boolean} showPagination - Show pagination controls (default: true)
 */
function PaginatedList({
  data = [],
  renderRow,
  columns = [],
  itemsPerPage = 10,
  onFilter,
  showSearch = true,
  showPagination = true,
  emptyMessage = 'No records found',
  loading = false
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Filter data when search term changes
  useEffect(() => {
    if (onFilter) {
      const filtered = onFilter(searchTerm);
      setFilteredData(filtered);
    } else {
      // Default filtering - search in all string fields
      const filtered = data.filter(item => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return Object.values(item).some(value => 
          value && value.toString().toLowerCase().includes(searchLower)
        );
      });
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page on filter
  }, [searchTerm, data, onFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    
    const sorted = [...filteredData].sort((a, b) => {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      if (typeof aVal === 'string') {
        return direction === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      
      return direction === 'asc' ? aVal - bVal : bVal - aVal;
    });
    
    setFilteredData(sorted);
  };

  // Pagination items
  const paginationItems = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === currentPage}
        onClick={() => setCurrentPage(i)}
        className="cms-pagination-item"
      >
        {i}
      </Pagination.Item>
    );
  }

  if (loading) {
    return (
      <div className="cms-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cms-paginated-list">
      {/* Search/Filter Bar */}
      {showSearch && (
        <div className="cms-list-filters mb-3">
          <InputGroup>
            <InputGroup.Text>
              <Search className="cms-icon-primary" />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control-cms"
            />
          </InputGroup>
        </div>
      )}

      {/* Table */}
      {columns.length > 0 && (
        <Table responsive className="table-cms">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => column.sortable && handleSort(column.key)}
                  style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                >
                  {column.label}
                  {sortConfig.key === column.key && (
                    <span className="ms-2">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-4">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={item.id || index}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.render 
                        ? column.render(item[column.key], item)
                        : item[column.key] || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </Table>
      )}

      {/* Custom Row Rendering */}
      {renderRow && currentData.length > 0 && (
        <div className="cms-custom-rows">
          {currentData.map((item, index) => renderRow(item, startIndex + index))}
        </div>
      )}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="cms-pagination-wrapper">
          <div className="cms-pagination-info">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} records
          </div>
          <Pagination className="cms-pagination">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            />
            {paginationItems}
            <Pagination.Next
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
}

export default PaginatedList;

