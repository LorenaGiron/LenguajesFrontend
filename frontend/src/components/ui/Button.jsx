export default function Button({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-azulF hover:bg-azulM ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}