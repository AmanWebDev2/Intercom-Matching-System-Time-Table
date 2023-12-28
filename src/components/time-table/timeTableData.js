const day = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

function createData() {
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

  function mergeConsecutiveSchedules(schedules) {
    if (schedules.length <= 1) {
      return schedules; // No need to merge if there's only one or no schedule
    }
  
    // Sort schedules based on start_minute
    const sortedSchedules = schedules.slice().sort((a, b) => a.start_minute - b.start_minute);
  
    const mergedSchedules = [];
    let currentSchedule = { ...sortedSchedules[0] };
  
    for (let i = 1; i < sortedSchedules.length; i++) {
      const nextSchedule = sortedSchedules[i];
  
      if (
        currentSchedule.day === nextSchedule.day &&
        currentSchedule.end_minute >= nextSchedule.start_minute
      ) {
        // Merge overlapping or consecutive schedules
        currentSchedule.end_minute = Math.max(currentSchedule.end_minute, nextSchedule.end_minute);
        currentSchedule.readableEndTime = nextSchedule.readableEndTime;
      } else {
        // Non-consecutive or different day, push the current schedule and update currentSchedule
        mergedSchedules.push(currentSchedule);
        currentSchedule = { ...nextSchedule };
      }
    }
  
    // Push the last schedule after the loop
    mergedSchedules.push(currentSchedule);
  
    return mergedSchedules;
  }
  
  function splitSchedules(schedules) {
    const splitSchedules = [];
  
    for (const schedule of schedules) {
      const duration = schedule.end_minute - schedule.start_minute;
  
      if (duration === 60) {
        splitSchedules.push(schedule);
      } else {
        // Split the schedule into multiple 60-minute schedules
        let currentStartMinute = schedule.start_minute;
        let currentEndMinute = currentStartMinute + 60;
  
        while (currentEndMinute <= schedule.end_minute) {
          splitSchedules.push({
            day: schedule.day,
            start_minute: currentStartMinute,
            end_minute: currentEndMinute,
            readableStartTime: formatReadableTime(currentStartMinute),
            readableEndTime: formatReadableTime(currentEndMinute),
          });
  
          currentStartMinute = currentEndMinute;
          currentEndMinute += 60;
        }
      }
    }
  
    return splitSchedules;
  }
  
  
  function formatReadableTime(minutes) {
    const adjustedMinutes = minutes % (24 * 60); // Ensure minutes stay within a single day
    const hour = Math.floor(adjustedMinutes / 60) % 12 || 12;
    const period = adjustedMinutes < 720 ? 'AM' : 'PM';
    return `${hour}:${(adjustedMinutes % 60).toString().padStart(2, '0')}${period}`;
  }

  export { formatReadableTime,mergeConsecutiveSchedules,createData,splitSchedules }