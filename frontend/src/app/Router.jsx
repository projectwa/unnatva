import { Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import ImpactPage from '../pages/ImpactPage';
import InitiativesPage from '../pages/InitiativesPage';
import SuccessStoriesPage from '../pages/SuccessStoriesPage';
import MediaPage from '../pages/MediaPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="entrepreneurship-development" element={<InitiativesPage type="entrepreneurship" />} />
        <Route path="skill-development" element={<InitiativesPage type="skill" />} />
        <Route path="education" element={<InitiativesPage type="education" />} />
        <Route path="women-empowerment" element={<InitiativesPage type="women" />} />
        <Route path="success-stories" element={<SuccessStoriesPage />} />
        <Route path="media" element={<MediaPage />} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
      </Route>
    </Routes>
  );
}

export default Router;

