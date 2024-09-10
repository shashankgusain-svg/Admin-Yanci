import React from "react";

export default function CustomSelect({ onChange, name, id, children, defaultValue, value }) {
  return (
    <div className="select">
      <select onChange={onChange} name={name} id={id} value={value} defaultValue={defaultValue} className="custom-select text-body-2 font-medium text-black-10">
        {children}
      </select>
    </div>
  );
}