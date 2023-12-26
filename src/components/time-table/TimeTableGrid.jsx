import { useEffect, useState } from 'react'
import { createData } from './timeTableData'
import "./timeTable.css";

const TimeTableGrid = () => {
  const [schedule,setSchedule] = useState([]);
  useEffect(()=>{
    const data = createData();
    setSchedule(data);
    console.log(data)
  },[]);


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
                    <div key={i} className={`timetable-editor-grid-item ${i==6 && 'active'}`}>
                      <span className="timetable-editor-grid-item-hover-text">
                        {`${data.day} ${min.readableStartTime}`} 
                      </span>
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