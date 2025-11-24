export default function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-sky-600 hover:bg-sky-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}