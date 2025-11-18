/**
 * Home Carousel Component
 * Standalone component that can be embedded in CI4 views
 */

import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
import { imgPath } from '../../utils/paths';

function HomeCarousel({ slides = [] }) {
  useEffect(() => {
    // Initialize WOW.js if available
    if (window.WOW) {
      new window.WOW().init();
    }
  }, []);

  const renderHeading = (heading, highlightedWords) => {
    const words = heading.split(' ');
    return words.map((word, i) => {
      const cleanWord = word.replace(/[.,!?'"]/g, '');
      if (highlightedWords.includes(cleanWord)) {
        return <React.Fragment key={i}><span>{word}</span> </React.Fragment>;
      }
      return <React.Fragment key={i}>{word} </React.Fragment>;
    });
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="container-fluid p-0 wow fadeIn" data-wow-delay="0.1s">
      <Carousel id="header-carousel" indicators controls={false}>
        {slides.map((slide, index) => (
          <Carousel.Item key={index}>
            <img className="img-fluid arrow-img" src={imgPath('banner-green-arrow.png')} alt="" />
            <Container>
              <Row className="g-5 align-items-center">
                <Col lg={5} className="text-center text-lg-start order-2 order-lg-1">
                  <h1 className="m-0 mb-lg-5 ms-lg-5 pb-0 pb-lg-4 slideInDown">
                    {renderHeading(slide.heading, slide.highlightedWords || [])}
                  </h1>
                </Col>
                <Col lg={7} className="position-relative order-1 order-lg-2">
                  <img className="img-fluid banner-img" src={imgPath(slide.image)} alt="" />
                </Col>
              </Row>
            </Container>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

// Component is mounted via entry point, no auto-mount needed here

export default HomeCarousel;

