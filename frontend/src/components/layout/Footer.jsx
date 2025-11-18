import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { imgPath, baseUrl } from '../../utils/paths';

function Footer() {
  return (
    <>
      {/* Modal - Will be converted to React component later */}
      <div className="modal fade custom-modal" id="popupModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="row g-0">
              <div className="col-lg-12 form-section">
                <button type="button" className="btn-close p-2" data-bs-dismiss="modal" aria-label="Close"></button>
                <h3>Help us know you better</h3>
                <p className="fw-semibold">How do you want to contribute?</p>
                <form>
                  <input type="text" className="form-control" placeholder="Name" />
                  <input type="text" className="form-control" placeholder="Company Name" />
                  <input type="text" className="form-control" placeholder="Contact Number" />
                  <input type="email" className="form-control" placeholder="Business Email" />
                  <p className="fw-semibold mt-3">In which area do you want to create impact?</p>
                  <div className="impact-options">
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="entrepreneurship" />
                      <label className="form-check-label small" htmlFor="entrepreneurship">Entrepreneurship</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="skillDev" />
                      <label className="form-check-label small" htmlFor="skillDev">Skill Development</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="womenEmp" />
                      <label className="form-check-label small" htmlFor="womenEmp">Women Empowerment</label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input className="form-check-input" type="checkbox" id="education" />
                      <label className="form-check-label small" htmlFor="education">Education</label>
                    </div>
                  </div>
                  <a href="#" className="rounded-btn">Submit <span className="arrow"><i className="bi bi-arrow-right"></i></span></a>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container-fluid footer mb-6 mb-0 py-6 wow fadeIn" data-wow-delay="0.1s">
        <Container>
          <Row className="g-3">
            <Col xs={12} sm={12} md={4} className="me-0 me-md-5">
              <h2 className="text-primary mb-4 footer-title">
                Unnatva Foundation
                <br />
                <small>
                  A non-profit arm of{' '}
                  <a 
                    href="https://udyogwardhini.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dark"
                  >
                    Udyogwardhini
                  </a>
                </small>
              </h2>
              <p className="my-2 d-flex align-items-start" style={{ maxWidth: '85%' }}>
                <img 
                  className="img-fluid me-2" 
                  src={imgPath('footer-location.png')} 
                  alt="Location"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                Head office: 3, Nirman Inspire, Kanherewadi, Opp. Old CBS, Nashik
              </p>
              <p className="mb-2 d-flex align-items-center">
                <a href="mailto:hello@unnatva.org" className="text-dark text-decoration-none">
                  <img 
                    className="img-fluid me-2" 
                    src={imgPath('footer-email.png')} 
                    alt="Email"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  Email: hello@unnatva.org
                </a>
              </p>
            </Col>
            
            <Col xs={12} sm={6} md={3} className="me-0 me-md-5">
              <Row>
                <Col xs={6} md={6} className="p-md-0">
                  <Link to="/" className="btn btn-link text-dark">Home</Link>
                  <Link to="/about" className="btn btn-link text-dark">About Us</Link>
                  <Link to="/impact" className="btn btn-link text-dark">Impact</Link>
                  <Link to="/" className="btn btn-link text-dark">Annual Report</Link>
                </Col>
                <Col xs={6} md={6} className="p-md-0">
                  <Link to="/about#nationalAwards" className="btn btn-link text-dark">Awards</Link>
                  <Link to="/about#ourTeam" className="btn btn-link text-dark">Our Team</Link>
                  <Link to="/about#careers" className="btn btn-link text-dark">Careers</Link>
                </Col>
              </Row>
            </Col>
            
            <Col xs={12} sm={6} md={2}>
              <Link to="/media" className="btn btn-link text-dark">Media</Link>
              <a 
                href="https://www.linkedin.com/company/unnatva-foundation/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-link text-dark"
              >
                LinkedIN
              </a>
              <Link to="/privacy-policy" className="btn btn-link text-dark">Privacy Policy</Link>
            </Col>
            
            <Col md={12} className="mt-4">
              <div className="social-links d-flex">
                <Link 
                  to="/contact" 
                  className="rounded-btn social-btn me-1"
                >
                  <span>Contact Us</span>{' '}
                  <span className="arrow">
                    <i className="bi bi-arrow-right"></i>
                  </span>
                </Link>
                <a 
                  href="https://www.instagram.com/unnatva_foundation?igsh=OXA1cHB1dmwwMmoz" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn social-btn me-1"
                >
                  <i className="fab fa-instagram"></i>
                </a>
                <a 
                  href="https://www.linkedin.com/company/unnatva-foundation/" 
                  className="btn social-btn me-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61570081064824" 
                  className="btn social-btn me-1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a 
                  href="https://youtube.com/@unnatvafoundation?si=r5bL30awDIv8pt2W" 
                  className="btn social-btn me-0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube"></i>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Copyright */}
      <div className="container-fluid copyright text-light py-1 wow fadeIn" data-wow-delay="0.1s">
        <Container>
          <Row>
            <Col md={12} className="text-end mb-3 mb-md-0">
              &nbsp;
            </Col>
          </Row>
        </Container>
      </div>

      {/* Back to Top */}
      <a href="#" className="btn btn-lg btn-primary btn-lg-square back-to-top">
        <i className="bi bi-arrow-up"></i>
      </a>
    </>
  );
}

export default Footer;
