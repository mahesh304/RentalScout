const timeFilters = [
  { id: '1d', label: '1 day', value: '1' },
  { id: '3d', label: '3 days', value: '3' },
  { id: '1w', label: '1 week', value: '7' },
  { id: '15d', label: '15 days', value: '15' },
  { id: '1m', label: '1 month', value: '30' },
  { id: '3m', label: '3 months', value: '90' },
  { id: '6m', label: '6 months', value: '180' },
  { id: '1y', label: '1 year', value: '365' }
];

export default function TimeFilter() {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Duration
      </label>
      <div className="relative">
        <select
          className="block w-full pl-4 pr-10 py-3 text-base border-2 border-gray-100 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 sm:text-sm rounded-xl appearance-none bg-white"
        >
          <option value="">Select duration</option>
          {timeFilters.map((filter) => (
            <option key={filter.id} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}