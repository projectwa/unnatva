/**
 * Impact Counters Component
 * Standalone component that can be embedded in CI4 views
 */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Container, Row, Col } from 'react-bootstrap';
import { imgPath } from '../../utils/paths';

function ImpactCounters({ stats = [] }) {
  useEffect(() => {
    // Initialize WOW.js if available
    if (window.WOW) {
      new window.WOW().init();
    }

    // Counter animation (if using counterup library)
    if (window.counterUp) {
      const counters = document.querySelectorAll('[data-toggle="counter-up"]');
      counters.forEach(counter => {
        window.counterUp(counter);
      });
    }
  }, []);

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid py-6" id="counter-sec">
      <Container>
        <Row className="gx-3 gy-2 mx-0 px-0 align-items-center">
          <Col lg={5} className="wow fadeInUp" data-wow-delay="0.1s">
            <h2 className="mb-4 text-white">
              Our Impact, <span style={{ color: '#A1A1A1' }}>Numbers from <br />2024-2025</span>
            </h2>
            <div className="row gx-3 gy-3 mt-3 mb-5 px-0">
              {stats.map((stat, index) => (
                <div key={index} className="col-12 wow fadeIn" data-wow-delay={`${0.1 + index * 0.1}s`}>
                  <div className="counter-bg">
                    <img src={imgPath(stat.bg)} className="img-fluid" alt="" />
                    <div className="d-flex flex-row align-items-center">
                      <div>
                        <h4 className="text-center">
                          <span className="counterNo" data-toggle="counter-up">{stat.value}</span>
                          <span className="counterNo">{stat.suffix}</span>{' '}
                          <span className="text-dark fw-normal counterText">{stat.text}</span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <a href="#" className="rounded-btn" data-bs-toggle="modal" data-bs-target="#popupModal">
              Create Change <span className="arrow"><i className="bi bi-arrow-right"></i></span>
            </a>
          </Col>
          <Col lg={7} className="wow fadeInUp" data-wow-delay="0.2s">
            {/* India map is displayed via background image in #counter-sec */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Component is mounted via entry point, no auto-mount needed here

export default ImpactCounters;

