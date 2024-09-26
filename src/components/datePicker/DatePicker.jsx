import React from "react";
import Button from "../button/Button";
import DatePicker from "react-multi-date-picker";

export default function CustomDatePicker({ values, onChange }) {
  const format = "YYYY-MM-DD";
  const [selectedDates, setSelectedDates] = React.useState(values);

  return (
    <div className="date-picker flex flex-col gap-2 pb-1">
      <DatePicker
        type="Calendar"
        value={selectedDates}
        onChange={setSelectedDates}
        format={format}
        range
      />

      <div className="px-4 grid grid-cols-2 gap-2">
        <Button
          design="primary"
          onClick={() => {
            if (selectedDates != null) {
              setSelectedDates(null);
              onChange(null);
            }
          }}
        >
          Remove
        </Button>
        <Button
          design="primary"
          onClick={() => {
            if (selectedDates != null) {
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
