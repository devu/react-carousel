// Dependencies
import React from 'react';
import Carousel from './Carousel.jsx';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.state = {
      input: 'World'
    };
  }

  handleInputChange(e) {
    this.setState({ input: e.target.value });
  }

  render() {
    const items = [
      <div className="item">Item 1</div>,
      <div className="item">Item 2</div>,
      <div className="item">Item 3</div>,
      <div className="item">Item 4</div>,
      <div className="item">Item 5</div>,
      <div className="item">Item 6</div>,
      <div className="item">Item 7</div>
    ];

    const optionsA = {
      index: 2,
      speed: 0.1,
      loop: false,
      responsive: {
        0: { items: 1 }
      }
    };

    const optionsB = {
      index: 1,
      speed: 1,
      loop: true,
      responsive: {
        0: { items: 1 },
        1000: { items: 3 }
      }
    };

    return (
      <div className="content">
        <div className="content">
          <Carousel items={items} options={optionsA} />
          <Carousel items={items} options={optionsB} />
          <input
            type="text"
            value={this.state.input}
            onChange={this.handleInputChange}
          />
          <span>Welcome {this.state.input}</span>
        </div>
      </div>
    );
  }
}

export default Content;
