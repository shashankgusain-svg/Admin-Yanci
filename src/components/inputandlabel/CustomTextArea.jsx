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
  showLimit = false,
  autoFocus = false,
  readOnly = false,
  wrap = "soft",
  onChange = () => {},
  value = "",
  ...rest
}) {
  return (
    <div className="text-area-wrapper w-full flex flex-col gap-2">
      <textarea
        id={id}
        name={name}
        rows={rows}
        cols={cols}
        className={`${className} w-full border border-black-5 bg-black-1 py-3 pl-3 pr-4 rounded-lg text-body-2 ${
          value.length >= maxLength * 0.9 ? "!outline-red-500" : ""
        }`}
        disabled={disabled}
        required={required}
        placeholder={placeHolder}
        maxLength={maxLength}
        showLimit={showLimit}
        autoFocus={autoFocus}
        readOnly={readOnly}
        wrap={wrap}
        onChange={onChange}
        value={value}
        {...rest}
      />
      {showLimit ? (
        <p
          className={`text-body-[0.75rem] ${
            value.length >= maxLength * 0.9 ? "text-red-500" : "text-black-7"
          } self-end`}
        >
          {value.length}/{maxLength}
        </p>
      ) : null}
    </div>
  );
}
