import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Router from './Router';
import { AppProvider } from './providers';

function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <BrowserRouter basename="/">
          <Router />
        </BrowserRouter>
      </AppProvider>
    </HelmetProvider>
  );
}

export default App;

