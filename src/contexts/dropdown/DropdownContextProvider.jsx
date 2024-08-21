import React from 'react';
import DropdownContext from "./DropdownContext";

export default function DropdownContextProvider({ children }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </DropdownContext.Provider>
  );
}