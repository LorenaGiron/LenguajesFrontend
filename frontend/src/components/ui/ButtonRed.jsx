export default function ButtonR({ children, onClick, className = "", ...props }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white bg-rojoF hover:bg-rojoC ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}