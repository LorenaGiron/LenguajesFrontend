export default function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  id,
  required
}) {
  return (
    <div className="flex flex-col mb-4">
      {label && <label htmlFor={id} className="mb-1 font-medium text-gray-700">{label}</label>}
      
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 border border-grisC rounded-md 
                   placeholder:text-grisM
                   text-grisF
                   focus:outline-none focus:ring-2 focus:ring-azulM"
      />
    </div>
  );
}
