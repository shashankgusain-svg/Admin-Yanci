export default function Arrow({ direction = "up" }) {
  return direction && direction === "up" ? (
    <svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.08333 4.66667L4.99999 1.75M4.99999 1.75L7.91666 4.66667M4.99999 1.75V9.25"
        stroke="#22C55E"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ) : direction && direction === "down" ? (
    <svg
      width="10"
      height="11"
      viewBox="0 0 10 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.08333 6.33333L4.99999 9.25M4.99999 9.25L7.91666 6.33333M4.99999 9.25V1.75"
        stroke="#EF4444"
        stroke-width="1.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ) : null;
}
