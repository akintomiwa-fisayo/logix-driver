export const getWeekDay = (day) => {
  const weekdays = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return isNaN(day) ? false : weekdays[day];
};

export const getMonth = (month) => {
  const months = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ];
  return isNaN(month) ? false : months[month];
};

exports.getRelativeTime = (timestamp, relative = true, format = 'fullText') => {
  const d1 = new Date();
  const d2 = new Date(timestamp);
  let relativeTime = '';

  const Year = d2.getFullYear();
  const year = d1.getFullYear() === Year ? '' : `${Year}`;
  const month = exports.getMonth(d2.getMonth());
  let hour = d2.getHours();
  const hourPref = hour >= 12 ? 'pm' : 'am';
  if (hour === 0) {
    hour = 12;
  } else {
    hour = hour > 12 ? hour - 12 : hour;
  }
  const date = d2.getDate() + 1;
  const minutes = d2.getMinutes();
  let minutesDbl = `${minutes}`;
  minutesDbl = minutesDbl.length === 1 ? `0${minutesDbl}` : minutesDbl;
  const day = exports.getWeekDay(d2.getDay());
  if (relative) {
    const diffInMilliseconds = d1 - d2;
    const diffInSec = Math.floor(diffInMilliseconds / 1000);
    if (diffInSec >= 60) { // 60 seconds make a minute
      const diffInMinutes = Math.floor(diffInSec / 60);
      if (diffInMinutes >= 60) { // 60 minutes make in an hour
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours >= 24) { // 24 hours make in a day
          const diffInDays = Math.floor(diffInHours / 24);
          if (diffInDays >= 7) { // 7 day make in a week
            if (format === 'fullText') {
              relativeTime = `${day}, ${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
            } else if (format === 'text') {
              relativeTime = `${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
            } else if (format === 'number-without-time') {
              relativeTime = `${date}/${d2.getMonth()}/${year}`;
            } else {
              // its number
              relativeTime = `${date}/${d2.getMonth()}/${year} at ${hour}:${minutesDbl} ${hourPref}`;
            }
          } else if (diffInDays === 1) {
            if (format === 'number-without-time') {
              relativeTime = 'yesterday';
            } else {
              relativeTime = `yesterday at ${hour}:${minutesDbl} ${hourPref}`;
            }
          } else if (format === 'number-without-time') {
            relativeTime = `last ${day}`;
          } else {
            relativeTime = `last ${day} at ${hour}:${minutesDbl} ${hourPref}`;
          }
        } else relativeTime = `${diffInHours}hr${diffInHours > 1 ? 's' : ''} ago`;
      } else relativeTime = `${diffInMinutes}min${diffInMinutes > 1 ? 's' : ''} ago`;
    } else relativeTime = 'just now';
  } else if (format === 'fullText') {
    relativeTime = `${day}, ${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
  } else if (format === 'text') {
    relativeTime = `${month} ${date} ${year} at ${hour}:${minutesDbl} ${hourPref}`;
  } else if (format === 'number-without-time') {
    relativeTime = `${date}/${d2.getMonth()}/${year}`;
  } else {
    // its number
    relativeTime = `${date}/${d2.getMonth()}/${Year} at ${hour}:${minutesDbl} ${hourPref}`;
  }

  return relativeTime;
};