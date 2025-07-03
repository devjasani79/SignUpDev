// src/components/TextInput.jsx
export const TextInput = ({ label, type = "text", ...props }) => (
  <div className="space-y-1">
    {label && <label className="block font-medium">{label}</label>}
    <input type={type} className="border p-2 w-full rounded" {...props} />
  </div>
);
