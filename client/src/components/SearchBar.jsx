export default function SearchBar({ value, onChange }) {
  return (
    <div className="max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for restaurants or cuisines..."
        className="w-full px-6 py-4 rounded-full text-gray-800 text-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
      />
    </div>
  );
}
