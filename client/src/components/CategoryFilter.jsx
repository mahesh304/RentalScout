const categories = [
  { id: 'villa', name: 'Villa', icon: '🏡' },
  { id: 'farmhouse', name: 'Farm House', icon: '🌄' },
  { id: 'poolhouse', name: 'Pool House', icon: '🏊‍♂️' },
  { id: 'apartment', name: 'Apartment', icon: '🏢' },
  { id: 'pg', name: 'PG', icon: '🛏️' },
  { id: 'cabin', name: 'Cabins', icon: '🏠' },
  { id: 'shop', name: 'Shops', icon: '🏪' },
  { id: 'studio', name: 'Studio', icon: '🎨' },
  { id: 'bungalow', name: 'Bungalow', icon: '🏘️' }
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Property Type
      </label>
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id === selectedCategory ? null : category.id)}
              className={`flex flex-col items-center min-w-[100px] px-4 py-3 rounded-xl text-sm font-medium ${
                category.id === selectedCategory
                  ? 'bg-primary-50 text-primary-700 border-2 border-primary-500'
                  : 'text-gray-600 bg-white border-2 border-gray-100 hover:border-primary-500 hover:text-primary-700'
              } focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200`}
            >
              <span className="text-2xl mb-1">{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white pointer-events-none" />
      </div>
    </div>
  );
}