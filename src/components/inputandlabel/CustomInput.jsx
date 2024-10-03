import React from "react";
import PasswordIcon from "../../../public/icons/misc/passwordIcon";

export default function CustomInput({
  type = "text",
  name,
  id,
  value = "",
  onChange = () => {},
  placeHolder = "",
  required = false,
  disabled = false,
  className = "",
  maxLength = 70,
  showLimit = false,
  ...rest
}) {
  const [passwordShown, setPasswordShown] = React.useState(false);

  const handleToggle = () => {
    setPasswordShown(!passwordShown);
  };

  return type === "status" ? (
    <div
      className={`custom-input w-full flex items-center border border-black-5 bg-black-4 rounded-lg`}
    >
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
  ) : type === "password" ? (
    <div className="custom-input flex items-center border border-black-5 bg-white rounded-lg">
      <input
        type={passwordShown ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        maxLength={64}
        required={required}
        disabled={disabled}
        className={`
          ${disabled === true ? "bg-black-4" : null}
          w-full text-body-2 bg-none focus:outline-none
        ${className}`}
        {...rest}
      />
      <button type="button" onClick={handleToggle}>
        <PasswordIcon type={passwordShown ? "open" : "close"} />
      </button>
    </div>
  ) : (
    <div className="input-wrapper w-full flex flex-col gap-2">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeHolder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={`
          ${
            disabled === true
              ? "custom-input border border-black-5 bg-black-4 rounded-lg text-body-2"
              : null
          }
          ${
            type != "button"
              ? `custom-input border border-black-5 bg-black-1 rounded-lg w-full text-body-2 ${
                  value.length >= maxLength * 0.9 ? "!outline-red-500" : ""
                }`
              : "underline text-blue-600 text-left p-2 pl-0 text-body-2 cursor-pointer active:outline-none"
          } 
        ${className}`}
        {...rest}
      />
      {showLimit ? (
        <p
          className={`text-[0.75rem] ${
            value.length >= maxLength * 0.9 ? "text-red-500" : "text-black-7"
          } self-end`}
        >
          {value.length}/{maxLength}
        </p>
      ) : null}
    </div>
  );
}
