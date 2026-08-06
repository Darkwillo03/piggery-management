interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <input
        type="text"
        placeholder="🔍 Search Batch..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-lg p-3 w-80 focus:outline-none focus:ring-2 focus:ring-green-600"
      />
    </div>
  );
}
