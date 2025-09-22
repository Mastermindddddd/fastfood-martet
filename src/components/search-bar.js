import SearchIcon from "@/components/icons/search"
import ArrowRightIcon from "@/components/icons/arrow-right"

export default function SearchBar() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto px-4 mb-12">
      {/* Search Input */}
      <div className="relative flex-1">
        {/* Input */}
        <input
          type="text"
          placeholder="Search for food, restaurants, or deals..."
          className="w-full pl-12 pr-4 py-3 bg-accent/20 border border-accent/30 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 h-full"
        />
        {/* Icon inside input */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <SearchIcon />
        </div>
      </div>

      {/* All Deals Button */}
      <button className="flex-1 sm:flex-none sm:w-40 py-3 bg-muted text-muted-foreground rounded-xl hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap h-full">
        All Deals →
      </button>
    </div>
  )
}
