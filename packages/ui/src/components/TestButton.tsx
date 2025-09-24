import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const TestButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: '8px 16px', border: '1px solid #ccc' }}>
      {children}
    </button>
  );
};