export default function CompanyData({ active }) {
  const fill = active ? "#ffffff" : "#35BAB2";
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 21V7.5C4 6.67157 4.67157 6 5.5 6H10V4.5C10 3.67157 10.6716 3 11.5 3H18.5C19.3284 3 20 3.67157 20 4.5V21H4Z"
        stroke={fill}
        strokeWidth="1.75"
        strokeLinejoin="round"
        fill="none"
      />
      <path d="M8 10H7V12H8V10Z" fill={fill} />
      <path d="M8 14H7V16H8V14Z" fill={fill} />
      <path d="M12.5 7H11.5V9H12.5V7Z" fill={fill} />
      <path d="M12.5 11H11.5V13H12.5V11Z" fill={fill} />
      <path d="M12.5 15H11.5V17H12.5V15Z" fill={fill} />
      <path d="M17 7H16V9H17V7Z" fill={fill} />
      <path d="M17 11H16V13H17V11Z" fill={fill} />
      <path d="M17 15H16V17H17V15Z" fill={fill} />
      <path d="M14 21V17.5H16V21" stroke={fill} strokeWidth="1.75" strokeLinejoin="round" />
    </svg>
  );
}
