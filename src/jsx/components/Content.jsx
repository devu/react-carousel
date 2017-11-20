// Dependencies
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DateTimeUtils from '../utils/DateTimeUtils.jsx';
import Carousel from './Carousel.jsx';

class Content extends React.Component {
  constructor(props) {
    super(props);
    this.onDayChanged = this.onDayChanged.bind(this);
    this.onTimeChanged = this.onTimeChanged.bind(this);
    this.validateTime = this.validateTime.bind(this);
    this.selectedDay = this.props.days[0];

    this.state = {
      dayCarouselIndex: 0,
      timeCarouselIndex: this.validateTime()
    };
  }

  onDayChanged(index) {
    this.selectedDay = this.props.days[index];
    this.setState({
      dayCarouselIndex: index,
      timeCarouselIndex: this.validateTime()
    });
  }

  onTimeChanged(index) {
    console.log('parent onTimeChanged', index);
    this.setState({
      timeCarouselIndex: index
    });
  }

  validateTime(i) {
    let timeIndex = 0;
    if (moment(this.selectedDay.day).isSame(this.props.serverDate, 'day')) {
      timeIndex = DateTimeUtils.getTimeSlotIndex(this.props.timeSlots, this.props.serverDate);
    } else {
      timeIndex = 0;
    }

    return timeIndex;
  }

  renderDays() {
    return this.props.days.map((item, i) =>
      <div className="item" style={{ width: '400px' }}>{item.formatted}</div>
    );
  }

  renderTimeSlots() {
    return this.props.timeSlots.map((item, i) =>
      <div className="item" style={{ width: '250px' }}>{item}</div>
    );
  }

  render() {
    const optionsA = {
      padding: 20,
      speed: 0.5,
      loop: false,
      responsive: {
        0: {
          items: 1,
          offset: 0
        }
      }
    };

    const optionsB = {
      padding: 20,
      speed: 0.5,
      loop: true,
      responsive: {
        0: {
          items: 1,
          offset: 0
        },
        1000: {
          items: 3,
          offset: 1
        }
      }
    };

    return (
      <div className="content-wrapper">
        <div className="content">
          <Carousel
            className="day-carousel"
            index={this.state.dayCarouselIndex}
            items={this.renderDays()}
            options={optionsA}
            onChanged={this.onDayChanged}
          />
          <Carousel
            className="time-carousel"
            index={this.state.timeCarouselIndex}
            items={this.renderTimeSlots()}
            options={optionsB}
            onChanged={this.onTimeChanged}
          />
        </div>
        <div className="cta-button">
          Select
        </div>
      </div>
    );
  }
}

Content.propTypes = {
  days: PropTypes.array,
  timeSlots: PropTypes.array,
  serverDate: PropTypes.object
};

export default Content;
