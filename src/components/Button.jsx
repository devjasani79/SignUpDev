// src/components/Button.jsx
export const Button = ({ children, onClick, type = "button", color = "blue", className = "" }) => {
  const base = "px-4 py-2 rounded focus:outline-none";
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600 text-white",
    green: "bg-green-500 hover:bg-green-600 text-white",
    yellow: "bg-yellow-500 hover:bg-yellow-600 text-white",
    purple: "bg-purple-500 hover:bg-purple-600 text-white",
    red: "bg-red-500 hover:bg-red-600 text-white",
  }[color];
  return (
    <button type={type} onClick={onClick} className={`${base} ${colors} ${className}`}>
      {children}
    </button>
  );
};
