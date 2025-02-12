import React from 'react';

interface AppBaseButtonProps {
  text: string;
  textColor: string;
  bgColor: string;
  type: 'first' | 'second'; 
  href?: string; 
}

const AppBaseButton: React.FC<AppBaseButtonProps> = ({ text, textColor, bgColor, type, href }) => {
  const baseStyles =
    "px-5 py-2 flex items-center justify-center transition-all";
  const typeStyles =
    type === "first"
      ? "p-[10px_20px] rounded-[50px]"
      : "p-[10px_20px] rounded-[50px] border border-solid";

  if (href) {
    return (
      <a
        href={href}
        className={`${baseStyles} ${typeStyles} ${bgColor} ${textColor}`}
      >
        {text}
      </a>
    );
  }

  return (
    <button className={`${baseStyles} ${typeStyles} ${bgColor} ${textColor}`}>
      {text}
    </button>
  );
};

export default AppBaseButton;
