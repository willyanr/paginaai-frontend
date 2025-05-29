import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  isLoading?: boolean
}

const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  isLoading = false
}) => {
  // Size Classes
  const sizeClasses = {
    sm: "px-5 py-3.5 text-sm",
    md: "px-6 py-3.5 text-sm",
  };

  // Variant Classes
  const variantClasses = {
    primary:
      "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300",
    outline:
      "bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300",
  };

  const loadingIcon = (
    <svg
      className="animate-spin h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );

  return (

    <div>
      {!isLoading &&
        <button
          className={`inline-flex items-center justify-center font-medium gap-2 rounded-full transition ${className} ${sizeClasses[size]
            } ${variantClasses[variant]} ${disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
          onClick={onClick}
          disabled={disabled}
        >
          {startIcon && <span className="flex items-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>

      }
      {isLoading &&
        <button
          className={`dark:text-white inline-flex items-center justify-center font-medium gap-2 rounded-full transition ${className} ${sizeClasses[size]
            } "
            }`}
          onClick={onClick}
          disabled={true}
        >
          <span className="flex items-center dark:text-white">{loadingIcon}</span>
          Carregando...
        </button>
      }
    </div>

  );
};

export default Button;
