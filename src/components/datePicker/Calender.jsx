import React from "react";
import DatePicker from "react-date-picker";
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

export default function Calender({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}) {
  return (
    <div className="calender-container">
      {/* <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 31 }, (_, i) => (
          <button
            key={i}
            className={``}
            onClick={() => setStartDate(new Date(2024, 2, i + 1))}
          >
            {i + 1}
          </button>
        ))}
      </div> */}
      <DatePicker 
        autoFocus 
        wrapperClassName="datePicker" 
        calendarIcon={null}
        isOpen
      />
    </div>
  );
}
