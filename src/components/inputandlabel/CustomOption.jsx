import React from 'react'

export default function CustomOption({disabled=false, value, children}) {
  return (
    <option className="" value={value} disabled={disabled}>{children}</option>
  )
}
