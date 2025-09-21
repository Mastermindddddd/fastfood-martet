import SearchBar from "@/components/search-bar"
import SectionCards from "@/components/section-cards"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-center text-foreground">
            🍔 <span className="text-primary">FastBite</span> Express
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        {/* Search Section */}
        <SearchBar />

        {/* Section Cards */}
        <SectionCards />

        {/* Welcome Section */}
        <div className="mt-16 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4 text-balance">
            Welcome to fast food ordering with <span className="text-primary">FastBite Express</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            FastBite Express offers the very best in online food ordering. There is nothing that quite matches the
            excitement of getting your favorite meals delivered fresh to your door. The only thing that could make this
            experience any better would be by getting exclusive deals and tracking your orders in real-time.{" "}
            <span className="text-accent font-semibold">Place a bet and start ordering your food!</span>
          </p>
          <button className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors duration-200">
            Show More →
          </button>
        </div>

        {/* Features Grid */}
        <div className="mt-16 max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm">
                Get your food delivered in 30 minutes or less with our express delivery service.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Easy Payment</h3>
              <p className="text-muted-foreground text-sm">
                Multiple payment options including cards, digital wallets, and cash on delivery.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Quality Food</h3>
              <p className="text-muted-foreground text-sm">
                Fresh ingredients and quality preparation ensure every meal meets our high standards.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
