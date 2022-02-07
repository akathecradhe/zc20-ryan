import React from 'react';
import { Link } from 'react-router-dom';
import Tick from './Tick';

const HowItWorks = () => (
  <>
    <h3>How It Works</h3>
    <ul className="list-group">
      <Link to="/resources">
        <li className="list-group-item">
          <Tick status="none" />
          Learning & Education Resources
        </li>
      </Link>
      <Link to="/calculator">
        <li className="list-group-item">
          <Tick status="none" />
          Carbon Calculator
        </li>
      </Link>
      <Link to="/buy-offset">
        <li className="list-group-item">
          <Tick status="none" />
          Buy Your Offset
        </li>
      </Link>
      <Link to="/about">
        <li className="list-group-item">
          <Tick status="none" />
          Zero Carbon & Climate Change
        </li>
      </Link>
      <Link to="/registry">
        <li className="list-group-item">
          <Tick status="none" />
          Carbon Registry for Wales
        </li>
      </Link>
      <Link to="/projects">
        <li className="list-group-item">
          <Tick status="none" />
          Projects
        </li>
      </Link>
    </ul>
  </>
);

export default HowItWorks;
