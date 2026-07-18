import React from "react";

interface IntelLLMIconProps {
  className?: string;
  strokeWidth?: number;
}

const IntelLLMIcon: React.FC<IntelLLMIconProps> = ({ className = "h-4 w-4", strokeWidth = 1.75 }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
};

export default IntelLLMIcon;
