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
      <DatePicker 
        autoFocus 
        wrapperClassName="datePicker" 
        calendarIcon={null}
        isOpen
      />
    </div>
  );
}
