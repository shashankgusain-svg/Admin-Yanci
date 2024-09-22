import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function CustomPhoneInput({
  name = "phone",
  id = "phone",
  value = "",
  onChange = () => {},
  placeHolder = "Enter phone number",
  required = false,
  disabled = false,
  className = "",
  country = "gh",
  ...rest
}) {
  return (
    <PhoneInput
      country={country}
      value={value}
      onChange={(phone) => onChange({ target: { name, value: phone } })}
      placeholder={placeHolder}
      inputProps={{
        name: name,
        id: id,
        required: required,
        disabled: disabled,
      }}
      containerClass={`custom-input-container ${className}`}
      inputClass={`custom-input ${className}`}
      {...rest}
    />
  );
}
