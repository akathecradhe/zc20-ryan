import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { BrowserRouter, Route } from 'react-router-dom';
import { Router } from './router';

// Bootstrap customisation styles
import './css/custom.scss';
// Rest of styles
import './css/app.scss';

const App = () => (

  <BrowserRouter>
    <div>
      <CookieConsent
        location="bottom"
        cookieName="consent"
        buttonText="Got it!"
        expires={999}
      >
        Our website uses cookies to ensure you get the best experience.
        By continuing to use our website, you consent to our use of cookies.
      </CookieConsent>
      <Route component={Router} />
    </div>
  </BrowserRouter>

);

export default App;
