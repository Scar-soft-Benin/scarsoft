import React from 'react';

interface AppBaseButtonProps {
  text: string;
  textColor: string;
  bgColor: string;
  type: 'first' | 'second'; 
  href?: string; 
  className? : string; // Optional class prop for additional styles
}

const AppBaseButton: React.FC<AppBaseButtonProps> = ({ text, textColor, bgColor, type, href, className = '', ...rest }) => {
  const baseStyles =
    "px-5 py-2 flex items-center justify-center transition-all";
  const typeStyles =
    type === "first"
      ? "p-[10px_20px] rounded-[50px]"
      : "p-[10px_20px] rounded-[50px] border border-solid";
  const classes = `${baseStyles} ${typeStyles} ${bgColor} ${textColor} ${className}`.trim();
  if (href) {
    return (
      <a href={href} className={classes} {...(rest as React.HTMLAttributes<HTMLAnchorElement>)}>
        {text}
      </a>
    );
  }

  return (
    <button className={classes} {...(rest as React.HTMLAttributes<HTMLButtonElement>)}>
      {text}
    </button>
  );
};

export default AppBaseButton;
