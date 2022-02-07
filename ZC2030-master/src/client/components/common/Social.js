import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faFacebookF, faInstagram, faTwitter, faLinkedin, faResearchgate
}
  from '@fortawesome/free-brands-svg-icons';

library.add(faFacebookF, faInstagram, faTwitter, faLinkedin, faResearchgate);

const Social = () => (
  <div className="social">
    <a
      target="_blank"
      rel="noreferrer"
      className="icon facebook"
      href="https://facebook.com"
    >
      <FontAwesomeIcon icon={['fab', 'facebook-f']} />
    </a>
    <a
      target="_blank"
      rel="noreferrer"
      className="icon twitter"
      href="https://twitter.com"
    >
      <FontAwesomeIcon icon={['fab', 'twitter']} />
    </a>
    <a
      target="_blank"
      rel="noreferrer"
      className="icon instagram"
      href="https://instagram.com"
    >
      <FontAwesomeIcon icon={['fab', 'instagram']} />
    </a>
    <a
      target="_blank"
      rel="noreferrer"
      className="icon linkedin"
      href="https://linkedin.com"
    >
      <FontAwesomeIcon icon={['fab', 'linkedin']} />
    </a>
    <a
      target="_blank"
      rel="noreferrer"
      className="icon researchgate"
      href="https://researchgate.net"
    >
      <FontAwesomeIcon icon={['fab', 'researchgate']} />
    </a>
  </div>
);

export default Social;
