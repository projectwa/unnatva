import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { imgPath, baseUrl } from '../../utils/paths';

function Header() {
  const location = useLocation();

  // Helper to check if route is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="container-fluid p-0 shadow-sm">
      <div className="container">
        <Navbar 
          expand="lg" 
          bg="white" 
          className="navbar-light sticky-top p-0"
          style={{ zIndex: 999 }}
        >
          <Container fluid className="px-0">
            <Navbar.Brand 
              as={Link} 
              to="/" 
              className="d-flex align-items-center px-3 px-md-4 px-xxl-5"
            >
              <img 
                src={imgPath('logo.svg')} 
                className="img-fluid logo" 
                alt="UNNATVA Foundation" 
              />
            </Navbar.Brand>
            <Navbar.Toggle 
              aria-controls="navbarCollapse" 
              className="me-4"
            />
            <Navbar.Collapse id="navbarCollapse">
              <Nav className="ms-auto p-4 p-lg-0">
                <Nav.Link 
                  as={Link} 
                  to="/about" 
                  className={`nav-item nav-link ${isActive('/about') ? 'act_about' : ''}`}
                >
                  About us
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/impact" 
                  className={`nav-item nav-link ${isActive('/impact') ? 'act_impact' : ''}`}
                >
                  Our Impact
                </Nav.Link>
                <NavDropdown 
                  title="Our Initiatives" 
                  id="initiatives-dropdown"
                  className={`nav-item dropdown ${isActive('/entrepreneurship-development') || 
                    isActive('/skill-development') || 
                    isActive('/education') || 
                    isActive('/women-empowerment') ? 'act_ourInitiatives' : ''}`}
                  menuVariant="light"
                >
                  <NavDropdown.Item 
                    as={Link} 
                    to="/entrepreneurship-development"
                    className="dropdown-item"
                  >
                    Entrepreneurship Development
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/skill-development"
                    className="dropdown-item"
                  >
                    Skill Development
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/education"
                    className="dropdown-item"
                  >
                    Education
                  </NavDropdown.Item>
                  <NavDropdown.Item 
                    as={Link} 
                    to="/women-empowerment"
                    className="dropdown-item"
                  >
                    Women Empowerment
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link 
                  as={Link} 
                  to="/success-stories" 
                  className={`nav-item nav-link ${isActive('/success-stories') ? 'act_successStory' : ''}`}
                >
                  Success Story
                </Nav.Link>
                <Nav.Link 
                  as={Link} 
                  to="/contact" 
                  className={`nav-item nav-link ${isActive('/contact') ? 'act_contact' : ''}`}
                >
                  Contact Us
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </div>
    </div>
  );
}

export default Header;
