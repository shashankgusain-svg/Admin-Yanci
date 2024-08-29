import React from "react";

export default function CustomTextArea({
  id,
  name,
  rows,
  cols,
  className,
  disabled = false,
  required = false,
  placeHolder = "Enter your text",
  maxLength = 250,
  autoFocus = false,
  readOnly = false,
  wrap = "soft",
  onChange = () => {},
  value,
  ...rest
}) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      cols={cols}
      className={`${className} w-full border border-black-5 bg-black-1 py-3 pl-3 pr-4 rounded-lg text-body-2`}
      disabled={disabled}
      required={required}
      placeholder={placeHolder}
      maxLength={maxLength}
      autoFocus={autoFocus}
      readOnly={readOnly}
      wrap={wrap}
      onChange={onChange}
      value={value}
      {...rest}
    />
  );
}
