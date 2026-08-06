export default function Blog({ active }) {
  const stroke = active ? "#ffffff" : "#35BAB2";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4H18C19.1 4 20 4.9 20 6V18C20 19.1 19.1 20 18 20H6C4.9 20 4 19.1 4 18V6C4 4.9 4.9 4 6 4Z"
        stroke={stroke}
        strokeWidth="1.75"
      />
      <path
        d="M8 8H16"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8 12H16"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M8 16H13"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
