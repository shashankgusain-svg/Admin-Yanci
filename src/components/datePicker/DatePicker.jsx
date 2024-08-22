import { format } from "date-fns";
import React from "react";
import Button from "../button/Button";
import Calender from "./Calender";

export default function DatePicker() {
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

  const handleDateChange = (date, setDate) => {
    setDate(date);
  };

  return (
    <div className="date-picker flex flex-col gap-2">
      <div className="flex gap-10 py-4 px-8 bg-black-3">
        <div className="flex flex-col gap-2">
          <label className="text-body-2">From</label>
          <input
            type="text"
            value={format(startDate, "yyyy-MM-dd")}
            readOnly
            className="text-body-2 h-8 w-full text-center"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-body-2">To</label>
          <input
            type="text"
            value={format(startDate, "yyyy-MM-dd")}
            readOnly
            className="text-body-2 h-8 w-full text-center"
          />
        </div>
      </div>

      <div>
        <Calender/>
      </div>

      <div className="px-4 grid grid-cols-2 gap-2">
        <Button type="primary">Remove</Button>
        <Button>Apply</Button>
      </div>
    </div>
  );
}
