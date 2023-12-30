import { useEffect, useState } from 'react'
import { createData, formatReadableTime, mergeConsecutiveSchedules } from './timeTableData'
import "./timeTable.css";

const TimeTableGrid = () => {
  const [schedule,setSchedule] = useState([]);
  const [matchingSchedule,setMatchingSchedule] = useState([]);

  useEffect(()=>{
    const data = createData();
    console.log("data",data)
    setSchedule(data);
  },[]);

  useEffect(()=>{
    console.log(matchingSchedule)
  },[matchingSchedule]);

  const handleSelectSchedule=(e,selecedSchedule)=>{

    const isShiftPressed = e.shiftKey;

    if(!isShiftPressed) {
      handleSingleSelection(selecedSchedule);
    }else {
      if(matchingSchedule.length==0) {
        handleSingleSelection(selecedSchedule);
        return;
      }
      handleMultipleSelection(selecedSchedule);
    }

  }

  const handleSingleSelection=(selecedSchedule)=>{
    if(matchingSchedule.length==0){
      setMatchingSchedule([selecedSchedule]);
      return;
    }

    //  check if already exist and if schedule is consecutive decrease the schedule endminute by 60
    const isAlreadyExist = matchingSchedule.find((sch)=>{
      return (selecedSchedule.start_minute>=sch?.start_minute) &&( selecedSchedule?.end_minute <= sch.end_minute);
    });

    const isExactSelection = matchingSchedule.find((sch)=>{
      return (selecedSchedule.start_minute==sch?.start_minute) &&( selecedSchedule?.end_minute == sch.end_minute);
    });

    if(isAlreadyExist && !isExactSelection) {
      // check for if start and end min diff > 60 --> means consecutive timing selected
      // 1. diselect from top
      // 2. diselect from bottom
      // 3. diselect from between

      const newSchedule = splitSchedule(isAlreadyExist,selecedSchedule);

      if(Array.isArray(newSchedule)) {
        const temp = [...matchingSchedule];
        const index = matchingSchedule.findIndex((sch)=>{
          return (selecedSchedule.start_minute>=sch?.start_minute) &&( selecedSchedule?.end_minute <= sch.end_minute);
        });
        temp.splice(index,1)
        // const filteredSchedule = matchingSchedule.filter((schedule)=>schedule.day != newSchedule[0].day);
        setMatchingSchedule([...temp,...newSchedule]);

      }else { 
        const filteredSchedule = matchingSchedule.filter((sch)=>{
          return !((selecedSchedule.start_minute>=sch?.start_minute) && ( selecedSchedule?.end_minute <= sch.end_minute));
        });
        setMatchingSchedule([...filteredSchedule,newSchedule]);
      }

    }else if(isExactSelection){
      const index = matchingSchedule.findIndex((sch)=>{
        return (selecedSchedule.start_minute==sch?.start_minute) &&( selecedSchedule?.end_minute == sch.end_minute);
      });
      const temp = [...matchingSchedule];
      temp.splice(index,1);
      setMatchingSchedule([...temp]);
    }else {
      // check if selection is consecutive
      const sch = [...matchingSchedule,selecedSchedule];
      const data = mergeConsecutiveSchedules(sch);
      setMatchingSchedule(data);
    }

  }

  const handleMultipleSelection = (selectedSchedule) => {
    const schedules = [...matchingSchedule].filter((schedule)=>schedule.day != selectedSchedule.day);
    const dayWiseSchedule = matchingSchedule.filter((schedule)=>schedule.day == selectedSchedule.day).sort((a,b)=>a.start_minute-b.start_minute);
    const lastSchedule = dayWiseSchedule.pop();
    if(selectedSchedule.end_minute < lastSchedule.end_minute) {
      handleSingleSelection(selectedSchedule);
      return;
    }
    lastSchedule.end_minute = selectedSchedule.end_minute;
    dayWiseSchedule.push(lastSchedule);
    setMatchingSchedule([...schedules,...dayWiseSchedule]);
  };

  const splitSchedule=(schedule,selecedSchedule)=>{
    if(schedule.end_minute === selecedSchedule.end_minute) {
      return {...schedule, end_minute: schedule.end_minute-60}
    }else if(schedule.start_minute === selecedSchedule.start_minute) {
    // diselect from bottom
      return {...schedule,start_minute: selecedSchedule.start_minute+60,};
    }else {
      // how can osplit my object into two  
      const firstPart = {...schedule, end_minute: selecedSchedule.start_minute}
      const secondPart = {...schedule, start_minute: selecedSchedule.end_minute, end_minute: schedule.end_minute}
      return [firstPart,secondPart]
    }
  }

  const handleIsActive=(data)=>{
    if(matchingSchedule.length==0){
      return false;
    }
    const isFound = matchingSchedule.find((sch)=>(data.start_minute>=sch?.start_minute) &&( data?.end_minute <= sch.end_minute));
    if(isFound) {
      return true;
    }else {
      return false;
    }
  }

  const gridItemSelectionLogic=(schedule,day)=> {
    const isConsecutive = matchingSchedule.find((sch)=>{
      return (schedule.start_minute>=sch?.start_minute) &&( schedule?.end_minute <= sch.end_minute) &&(schedule.start_minute==sch.start_minute);
    });
    let readableStartTime = formatReadableTime(schedule.start_minute);
    let readableEndTime = formatReadableTime(schedule.end_minute);
    if(isConsecutive) {
      readableStartTime = formatReadableTime(isConsecutive.start_minute);
      readableEndTime = formatReadableTime(isConsecutive.end_minute);
      return `${day} ${readableStartTime}-${readableEndTime}`
    }else {
      return <span className="timetable-editor-grid-item-hover-text">
      {`${day} ${readableStartTime}`} 
    </span>
    }
  }

  

  return (
    <main className='grid-time-matching'>
      <div className='d-flex align-items-center justify-content-center'>
        <div>
          {/* timing map */}
          <div className="timetable-editor-grid-hour-axis-item"></div>
          {
            schedule.length > 0 && schedule[0].time.map((data,i)=>(
              <div key={i} className="timetable-editor-grid-hour-axis-item">
                {formatReadableTime(data.start_minute)}
              </div>
            ))
          }
        </div>
        <div className='d-flex align-items-center'>
          {/* Mon Tue */}
          {schedule.map((data,index)=>{
           return (
            <div key={index}>
           <div className="time-table-editor-day">
              <div>{data.day.toUpperCase()}</div>
            </div>
              {
                data.time.map((min,i)=>{
                  return(
                    <div key={i} className={`timetable-editor-grid-item ${handleIsActive(min) && 'active'}`} onClick={(e)=>{handleSelectSchedule(e,{day:data.day,...min})}}>
                      {
                        gridItemSelectionLogic(min,data.day)
                      }
                    </div>
                  )
                })
              }
            </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

export default TimeTableGrid