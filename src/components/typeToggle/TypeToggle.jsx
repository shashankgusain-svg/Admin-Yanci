import React from 'react'

export default function Toggle({ options }) {
  const [activeTab, setActiveTab] = React.useState(options[0].label);

  return (
    <div>
      <div className="flex justify-start gap-2">
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => setActiveTab(option.label)}
            className={`pb-1 min-w-32 ${
              activeTab === option.label
                ? "border-b-4 border-primary-6 text-primary-6"
                : "text-black-7"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-4">
        {options.map((option) => (
          <div
            key={option.label}
            className={`${activeTab === option.label ? "" : "hidden"}`}
          >
            {option.content}
          </div>
        ))}
      </div>
    </div>
  );
}
