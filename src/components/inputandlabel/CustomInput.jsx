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
  return type === "status" ? (
    <div className={`custom-input w-full flex items-center border border-black-5 bg-black-4 rounded-lg`}>
      <span
        className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm ${
          value === "Successful"
            ? "bg-green-600 text-white"
            : value === "Pending"
            ? "bg-yellow-600 text-white"
            : "bg-red-600 text-red-white "
        }`}
      >
        {value}
      </span>
    </div>
  ) : (
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
              ? "custom-input border border-black-5 bg-black-4 rounded-lg text-body-2"
              : null
          }
          ${
            type != "button"
              ? "custom-input border border-black-5 bg-black-1 rounded-lg w-full text-body-2"
              : "underline text-blue-600 text-left p-2 pl-0 text-body-2 cursor-pointer"
          } 
        ${className}`}
      {...rest}
    />
  );
}
