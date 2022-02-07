import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

library.add(faCheck);

function Tick(props) {
  const { status } = props;
  return (
    <div className={`tick${status ? ` ${status}` : ''}`}>
      <FontAwesomeIcon icon={['fas', 'check']} />
    </div>
  );
}

Tick.propTypes = {
  status: PropTypes.string.isRequired,
};

export default Tick;
