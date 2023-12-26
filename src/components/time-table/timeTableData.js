const day = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

export function createData() {
    const finalData = [];
    const minInADay = 24 * 60;
  
    day.forEach((d, index) => {
      let time = [];
      let starting = minInADay * index;
  
      for (let i = 0; i < minInADay / 60; i++) {
        let startTime = starting + i * 60;
        let endTime = starting + (i + 1) * 60;
        let readableStartTime = formatReadableTime(startTime,d);
        let readableEndTime = formatReadableTime(endTime,d);
  
        let obj = {
          start_minute: startTime,
          end_minute: endTime,
          readableStartTime,
          readableEndTime,
        };
  
        time.push(obj);
      }
  
      let data = {
        day: d,
        time,
      };
  
      finalData.push(data);
    });
  
    return finalData;
  }
  
  function formatReadableTime(minutes) {
    const adjustedMinutes = minutes % (24 * 60); // Ensure minutes stay within a single day
    const hour = Math.floor(adjustedMinutes / 60) % 12 || 12;
    const period = adjustedMinutes < 720 ? 'AM' : 'PM';
    return `${hour}:${(adjustedMinutes % 60).toString().padStart(2, '0')}${period}`;
  }