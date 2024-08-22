import React from 'react'

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
        type = {type}
        name = {name}
        value = {value}
        onChange = {onChange}
        placeHolder = {placeHolder}
        required = {required}
        disabled = {disabled}
        className = {`custom-input border border-black-5 bg-black-4 rounded-lg ${className}`}
        {...rest}
    />
  );
}
