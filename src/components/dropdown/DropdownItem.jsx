import React from 'react'

export default function DropdownItem({children}) {
  return (
    <button className="dropdown-item text-body-2 gap-3 cursor-pointer flex justify-start items-center bg-white hover:bg-primary-2 transition-transform duration-200 ease-in-out">{children}</button>
  )
}
