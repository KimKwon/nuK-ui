function CheckIcon({ width = 24, height = 24 }: { width?: number; height?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#2ab1ac"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="feather feather-check"
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export default CheckIcon;
