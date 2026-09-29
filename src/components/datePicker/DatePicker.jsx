import React from "react";
import Button from "../button/Button";
import { Calendar } from "react-multi-date-picker";

export default function CustomDatePicker({ values, onChange }) {
  const format = "YYYY-MM-DD";
  const [selectedDates, setSelectedDates] = React.useState(values);

  return (
    <div className="date-picker flex flex-col gap-2 pb-1 bg-[#F6F6F6]">
      <div className="flex justify-around items-center my-4 ">
        <div className="flex flex-col">
          <span className="text-black-7">From</span>
          <span className="border border-gray-300 rounded-md px-4 py-2 bg-white">
            {selectedDates && selectedDates.length === 2
              ? selectedDates[0].format(format)
              : 'YYYY-MM-DD'}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-black-7">To</span>
          <span className="border border-gray-300 rounded-md px-4 py-2 bg-white">
            {selectedDates && selectedDates.length === 2
              ? selectedDates[1].format(format)
              : 'YYYY-MM-DD'}
          </span>
        </div>
      </div>

     


      <Calendar
        value={selectedDates}
        onChange={setSelectedDates}
        format={format}
        range
        showOtherDays
      />

      {/* Buttons to apply or clear the selected dates */}
      <div className="px-4 grid grid-cols-2 gap-2 mt-4">
        <Button
          design="primary"
          onClick={() => {
            setSelectedDates(null);
            onChange(null);
          }}
        >
          Remove
        </Button>
        <Button
          design="primary"
          onClick={() => {
            if (selectedDates) {
              onChange(selectedDates);
            }
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );
}
