import React, { useState, useEffect, useRef } from 'react';
import PageContent from '../components/pages/PageContent';
import JobApplicationForm from '../components/JobApplicationForm';

function AboutPage() {
  console.log('AboutPage: Component rendering');
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState({ id: null, title: '' });
  const contentRef = useRef(null);
  
  console.log('AboutPage: Current state - showForm:', showForm, 'selectedJob:', selectedJob);

  useEffect(() => {
    console.log('AboutPage: useEffect running, setting up event listeners');
    
    // Function to attach event listeners to Apply Now buttons
    const attachListeners = () => {
      const buttons = document.querySelectorAll('.apply-now-btn');
      console.log('AboutPage: Found', buttons.length, 'Apply Now buttons');
      
      if (buttons.length === 0) {
        console.warn('AboutPage: No Apply Now buttons found in DOM');
        return;
      }
      
      buttons.forEach((button, index) => {
        // Check if listener already attached
        if (button.dataset.listenerAttached === 'true') {
          console.log('AboutPage: Button', index, 'already has listener');
          return;
        }
        
        // Mark as attached
        button.dataset.listenerAttached = 'true';
        console.log('AboutPage: Attaching listener to button', index, {
          jobId: button.getAttribute('data-job-id'),
          jobTitle: button.getAttribute('data-job-title')
        });
        
        // Add click listener
        const handleClick = (e) => {
          console.log('AboutPage: Button clicked!', e);
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const jobId = button.getAttribute('data-job-id');
          const jobTitle = button.getAttribute('data-job-title');
          console.log('AboutPage: Apply Now clicked:', { jobId, jobTitle });
          if (jobId && jobTitle) {
            console.log('AboutPage: Setting form to show with job:', { id: jobId, title: jobTitle });
            setSelectedJob({ id: jobId, title: jobTitle });
            setShowForm(true);
            console.log('AboutPage: Form should now be visible, showForm set to true');
          } else {
            console.warn('AboutPage: Missing jobId or jobTitle:', { jobId, jobTitle });
          }
          return false;
        };
        
        // Use capture phase and also try bubble phase
        button.addEventListener('click', handleClick, true);
        button.addEventListener('click', handleClick, false);
      });
    };

    // Initial attachment after a short delay to ensure content is loaded
    const timeoutId1 = setTimeout(() => {
      console.log('AboutPage: Initial attachListeners timeout fired');
      attachListeners();
    }, 100);
    
    // Also try immediately
    console.log('AboutPage: Attempting immediate attachListeners');
    attachListeners();
    
    // Global click handler as fallback - catches ALL clicks on the page
    const globalClickHandler = (e) => {
      // Check if clicked element or its parent has the apply-now-btn class
      const target = e.target.closest('.apply-now-btn');
      if (target) {
        console.log('AboutPage: Global click handler caught Apply Now button click!', target);
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const jobId = target.getAttribute('data-job-id');
        const jobTitle = target.getAttribute('data-job-title');
        console.log('AboutPage: Global handler - Apply Now clicked:', { jobId, jobTitle });
        if (jobId && jobTitle) {
          console.log('AboutPage: Global handler - Setting form to show');
          setSelectedJob({ id: jobId, title: jobTitle });
          setShowForm(true);
          console.log('AboutPage: Global handler - Form should now be visible');
        }
        return false;
      }
    };
    
    // Use capture phase to catch it early
    document.addEventListener('click', globalClickHandler, true);
    console.log('AboutPage: Added global click handler');

    // Listen for pageContentLoaded event from PageContent component
    const handleContentLoaded = () => {
      console.log('AboutPage: pageContentLoaded event received');
      setTimeout(() => {
        console.log('AboutPage: pageContentLoaded timeout fired, attaching listeners');
        attachListeners();
      }, 200);
    };
    window.addEventListener('pageContentLoaded', handleContentLoaded);
    console.log('AboutPage: Added pageContentLoaded event listener');

    // Use MutationObserver to watch for new content
    const observer = new MutationObserver((mutations) => {
      let shouldReattach = false;
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          // Check if any added nodes contain apply-now-btn
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) { // Element node
              if (node.classList?.contains('apply-now-btn') || 
                  node.querySelector?.('.apply-now-btn')) {
                shouldReattach = true;
              }
            }
          });
        }
      });
          if (shouldReattach) {
            console.log('AboutPage: MutationObserver detected new buttons, reattaching listeners');
            setTimeout(attachListeners, 100);
          }
    });

    // Observe the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('pageContentLoaded', handleContentLoaded);
      document.removeEventListener('click', globalClickHandler, true);
      clearTimeout(timeoutId1);
    };
  }, []);

  return (
    <>
      <PageContent
        apiEndpoint="/api/pages/about"
        title="About Us - UNNATVA Foundation"
        description="Learn about UNNATVA Foundation, a registered NGO empowering underserved communities across India through sustainable livelihood initiatives, entrepreneurship development, and skill training programs."
        keywords="UNNATVA Foundation, NGO India, about us, community development, skill training, entrepreneurship"
      />
      <JobApplicationForm
        show={showForm}
        onHide={() => {
          console.log('Closing form');
          setShowForm(false);
        }}
        jobTitle={selectedJob.title}
        jobId={selectedJob.id}
      />
    </>
  );
}

export default AboutPage;

