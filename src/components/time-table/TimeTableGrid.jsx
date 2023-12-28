import { useEffect, useState } from 'react'
import { createData, mergeConsecutiveSchedules } from './timeTableData'
import "./timeTable.css";

const TimeTableGrid = () => {
  const [schedule,setSchedule] = useState([]);
  const [matchingSchedule,setMatchingSchedule] = useState([]);

  useEffect(()=>{
    const data = createData();
    setSchedule(data);
  },[]);

  useEffect(()=>{
    console.log(matchingSchedule)
  },[matchingSchedule]);

  const handleSelectSchedule=(e,selecedSchedule)=>{
    if(matchingSchedule.length==0){
      setMatchingSchedule([selecedSchedule]);
      return;
    }
    const isAlreadyExist = matchingSchedule.find((schedule) => schedule.start_minute == selecedSchedule.start_minute);

    if(isAlreadyExist) {
      let filteredSchedule = matchingSchedule.filter((schedule) => (schedule.start_minute !== selecedSchedule.start_minute) && (schedule.end_minute !== selecedSchedule.end_minute));
      setMatchingSchedule([...filteredSchedule]);
    }else {
      // check if selection is consecutive
      const sch = [...matchingSchedule,selecedSchedule];
      const data = mergeConsecutiveSchedules(sch);
      setMatchingSchedule(data);
    }

  }

  const handleIsActive=(data)=>{
    if(matchingSchedule.length==0){
      return false;
    }
    const isFound = matchingSchedule.find((sch)=>sch?.start_minute === data?.start_minute);
    if(isFound) {
      return true;
    }else {
      return false;
    }
  }


  
  const gridItemSelectionLogic=(schedule,day)=> {
   return `${day} ${schedule.readableStartTime}-${schedule.readableEndTime}`
  }

  return (
    <main className='grid-time-matching'>
      <div className='d-flex align-items-center'>
        <div>
          {/* timing map */}
          <div className="timetable-editor-grid-hour-axis-item"></div>
          {
            schedule.length > 0 && schedule[0].time.map((data,i)=>(
              <div key={i} className="timetable-editor-grid-hour-axis-item">
                {data.readableStartTime}
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
                      {handleIsActive(min) ? 
                        gridItemSelectionLogic(min,data.day)
                      :<span className="timetable-editor-grid-item-hover-text">
                        {`${data.day} ${min.readableStartTime}`} 
                      </span>}
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