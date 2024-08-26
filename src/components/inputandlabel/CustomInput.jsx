import React from "react";

export default function CustomInput({
  type = "text",
  name,
  id,
  value,
  onChange,
  placeHolder,
  required = false,
  disabled = false,
  className = "",
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeHolder}
      required={required}
      disabled={disabled}
      className={`
        ${
          disabled === true
            ? "custom-input border border-black-5 bg-black-4 rounded-lg"
            : null
        }
        ${
          type != "button"
            ? "custom-input border border-black-5 bg-black-1 rounded-lg"
            : "underline text-blue-600 text-left p-2 pl-0 text-body-2 cursor-pointer"
        } 
      ${className}`}
      {...rest}
    />
  );
}
