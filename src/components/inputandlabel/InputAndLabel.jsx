import React from 'react'

export default function InputAndLabel({children, className}) {
  return (
    <div className={`flex flex-col items-start justify-start gap-2 ${className}`}>
        {children}
    </div>
  )
}
