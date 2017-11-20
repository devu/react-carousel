// Dependencies
import React from 'react';

import moment from 'moment';
import DateTimeUtils from '../utils/DateTimeUtils.jsx';
import Query from '../utils/Query.jsx';

// Components
import Header from './Header.jsx';
import Content from './Content.jsx';
import Footer from './Footer.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.getDayItems = this.getDayItems.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onDayUpdate = this.onDayUpdate.bind(this);

    // simulate store
    this.promoStore = {
      startDate: '01/01/2017',
      serverEpoch: new Date().setTime('1511196619000')
    };

    // simulate querry params
    const query = new Query();
    query.readQueryString();
    this.dayTime = query.getParam('prevTime').split(':');
    this.serverDate = moment(this.promoStore.serverEpoch);
    this.serverDate.hour(parseInt(this.dayTime[0], 10));
    this.serverDate.minute(parseInt(this.dayTime[1], 10));
    this.startDate = moment(DateTimeUtils.formatBulshitDate(this.promoStore.startDate));
    this.weekIndex = this.serverDate.diff(this.startDate, 'weeks') + 1;
    this.timeIndex = 0;
    this.dayIndex = 0;

    this.state = {
      timeSlots: [
        '00:00 - 02:00',
        '02:00 - 04:00',
        '04:00 - 06:00',
        '06:00 - 08:00',
        '08:00 - 10:00',
        '10:00 - 12:00',
        '12:00 - 14:00',
        '14:00 - 16:00',
        '16:00 - 18:00',
        '18:00 - 20:00',
        '20:00 - 22:00',
        '22:00 - 00:00'
      ],
      activeDays: []
    };
  }

  onTimeUpdate(index) {
    this.timeIndex = index;
  }

  onDayUpdate(index) {
    this.dayIndex = index;
  }

  /**
  * Get array of days to populate based on given logic and conditions
  */
  getDayItems() {
    let days = [];
    this.timeIndex = DateTimeUtils.getTimeSlotIndex(this.state.timeSlots, this.serverDate);
    const day = moment(this.serverDate);
    this.dayIndex = day.weekday();
    let cIndex = this.state.dayCarouselIndex;

    console.log('getDayItems', this.dayIndex, this.timeIndex);

    // if today is Sunday
    if (this.dayIndex === 0) {
        // check against last slot of the day, if that's the case move into following week
      if (this.timeIndex === 12) {
        day.add(1, 'days');
        day.hour(0);
        day.minute(0);
        days = this.populateDays(this.dayIndex, 7);
        this.setState({
          dayCarouselIndex: cIndex += 1
        });
      } else {
        // otherwise display only that Sunday
        days.push(day.format('dddd Do MMMM'));
      }
    } else {
      // if any other day of the week iterate up to 8 days to make sure you to include Sunday
      days = this.populateDays(this.dayIndex, 8);
    }

    return days;
  }

  /**
  * populate range of days in array
  * @mmin - minimum index of the day to start from (0 Sunday, 1 Monday and so on...)
  * @mmax - maximum number of the days
  */
  populateDays(min, max) {
    const activeDays = [];
    const day = moment(this.serverDate);

    let index = 0;
    for (let i = min; i < max; i += 1) {
      const now = moment(day);
      now.add(index, 'days');
      activeDays.push({ day: now, formatted: now.format('dddd Do MMMM') });
      index += 1;
    }

    return activeDays;
  }

  render() {
    const days = this.getDayItems();
    return (
      <div className="site-wrapper">
        <Header />
        <Content
          timeSlots={this.state.timeSlots}
          timeIndex={this.timeIndex}
          onTimeUpdate={this.onTimeUpdate}
          days={days}
          dayIndex={this.dayIndex}
          onDayUpdate={this.onDayUpdate}
          serverDate={this.serverDate}
        />
        <Footer />
      </div>
    );
  }
}

export default App;
