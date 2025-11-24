export default function Input({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label className="mb-1 font-medium text-gray-700">{label}</label>}
      
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 border border-gray-300 rounded-md 
                   placeholder:text-neutral-400
                   text-neutral-700
                   focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </div>
  );
}
