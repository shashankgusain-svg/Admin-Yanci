import React from "react";

export default function CustomLabel({
  children,
  htmlFor,
  className = "",
  ...rest
}) {
  return (
    <label className={`text-body-2 font-medium custom-label ${className}`} htmlFor={htmlFor} {...rest}>
      {children}
    </label>
  );
}
