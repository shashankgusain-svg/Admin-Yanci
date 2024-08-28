import React from "react";

export default function CustomSelect({ name, id, children, defaultValue }) {
  return (
    <div className="select">
      <select name={name} id={id} defaultValue={defaultValue} className="custom-select text-body-2 font-medium text-black-10">
        {children}
      </select>
    </div>
  );
}
