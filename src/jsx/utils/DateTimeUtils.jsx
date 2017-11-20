import moment from 'moment';

class DateTimeUtils {

  static getTimeSlotIndex(slots, now) {
    let minIndex = 0;
    slots.forEach((item) => {
      const timeSlot = moment(now);
      timeSlot.hour(parseInt(item.substring(0, 2), 10));
      timeSlot.minute(0);
      if (!timeSlot.isAfter(now)) {
        minIndex += 1;
      }
    }, this);

    return minIndex;
  }

  static formatBulshitDate(dateString) {
    const bits = dateString.split('/');
    return new Date(bits[2], bits[1] - 1, bits[0]);
  }
}

export default DateTimeUtils;
