import React from 'react';
import { Link } from 'react-router-dom';
import Tick from './Tick';

function getProgressStatus(percentage) {
  if (percentage === 100) {
    return 'done';
  }
  if (percentage > 0) {
    return 'inprogress';
  }
  return 'none';
}

class Progress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValues: ''
    };
    this.getValues = this.getValues.bind(this);
  }

  componentDidMount() {
    this.getValues();
  }

  componentWillReceiveProps() {
    this.getValues();
  }

  getValues() {
    fetch('/api/calc/category-percentage', {
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw response;
        }
        return response.json();
      })
      .then((data) => {
        this.setState({
          currentValues: data.currentValues
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  render() {
    const {
      currentValues
    } = this.state;
    return (
      <>
        <h3>My Progress</h3>
        <ul className="list-group">
          {Object.values(currentValues).map(item => (
            <Link to="/calculator" key={item[0]}>
              <li className="list-group-item">
                <Tick
                  status={getProgressStatus(item[1])}
                />
                {item[0]}
                <span
                  className={`percentage${item[1] === 100 ? ' done' : ''}
                ${item[1] > 0 && item[1] < 100 ? 'inprogress' : ''}`}
                >
                  {item[1]}
                  %
                </span>
              </li>
            </Link>
          ))}
        </ul>
      </>
    );
  }
}

export default Progress;
