"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Filter, Plus, X, ChevronRight, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { useCartContext } from '@/components/AppContext'

const cuisineTypes = ["All", "Burgers", "Pizza", "Chicken", "Japanese", "Mexican", "Steakhouse", "Fast Food", "Other"]

export default function HomePage() {
  const { data: session } = useSession()
  const { addToCart } = useCartContext()
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedShop, setSelectedShop] = useState(null)
  const [menuItems, setMenuItems] = useState([])
  const [loadingMenu, setLoadingMenu] = useState(false)

  useEffect(() => { fetchShops() }, [])

  const fetchShops = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/shops')
      const data = await response.json()
      if (data.success) setShops(data.shops || [])
      else setError(data.message || 'Failed to fetch shops')
    } catch {
      setError('Failed to load restaurants')
    } finally {
      setLoading(false)
    }
  }

  const fetchMenuItems = async (shopId) => {
    try {
      setLoadingMenu(true)
      const response = await fetch(`/api/menu-items?shopId=${shopId}`)
      const data = await response.json()
      if (data.success) setMenuItems(data.menuItems || [])
      else setError(data.message || 'Failed to fetch menu items')
    } catch {
      setError('Failed to load menu items')
    } finally {
      setLoadingMenu(false)
    }
  }

  const handleShopClick = async (shop) => {
    setSelectedShop(shop)
    await fetchMenuItems(shop._id)
  }

  const handleAddToCart = (item) => {
    if (!session) {
      const returnTo = selectedShop ? `/restaurants?shop=${selectedShop._id}` : '/restaurants'
      router.push(`/login?callbackUrl=${encodeURIComponent(returnTo)}`)
      return
    }
    addToCart({
      id: item._id,
      _id: item._id,
      name: item.name,
      price: item.price,
      shopId: selectedShop._id,
      shopName: selectedShop.businessName
    })
    router.push('/cart')
  }

  const closeMenu = () => { setSelectedShop(null); setMenuItems([]) }

  const filteredShops = shops
    .filter(shop => {
      const matchesSearch =
        shop.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.cuisine?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCuisine = selectedCuisine === "All" || shop.cuisine?.toLowerCase() === selectedCuisine.toLowerCase()
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.businessName || '').localeCompare(b.businessName || '')
      if (sortBy === "cuisine") return (a.cuisine || '').localeCompare(b.cuisine || '')
      return 0
    })

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <p style={styles.loadingText}>Finding great food near you…</p>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* ── Hero ── */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>🇿🇦 Johannesburg's favourite delivery app</p>
          <h1 style={styles.heroHeadline}>
            Great food,<br />
            <span style={styles.heroAccent}>at your door.</span>
          </h1>
          <div style={styles.searchWrapper}>
            <Search style={styles.searchIcon} size={20} />
            <input
              type="text"
              placeholder="Restaurant name, cuisine, or dish…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={styles.searchInput}
              className="hero-search"
            />
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main style={styles.main}>

        {/* Error banner */}
        {error && (
          <div style={styles.errorBanner}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={styles.errorClose}><X size={16} /></button>
          </div>
        )}

        {/* Cuisine pills + sort */}
        <div style={styles.filterRow}>
          <div style={styles.pillScroll} className="pill-scroll">
            {cuisineTypes.map(c => (
              <button
                key={c}
                onClick={() => setSelectedCuisine(c)}
                style={{
                  ...styles.pill,
                  ...(selectedCuisine === c ? styles.pillActive : {})
                }}
                className="pill-btn"
              >
                {c}
              </button>
            ))}
          </div>

          <div style={styles.sortGroup}>
            <span style={styles.sortLabel}>Sort</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="name">Name</option>
              <option value="cuisine">Cuisine</option>
            </select>
          </div>
        </div>

        {/* Section header */}
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {selectedCuisine === "All" ? "All Restaurants" : selectedCuisine}
          </h2>
          <span style={styles.sectionCount}>{filteredShops.length} spots</span>
        </div>

        {/* Grid */}
        {filteredShops.length === 0 ? (
          <div style={styles.emptyState}>
            <Utensils size={48} style={{ color: '#FF4D2D', marginBottom: 16 }} />
            <p style={styles.emptyTitle}>
              {shops.length === 0 ? 'No restaurants yet' : 'Nothing matches your search'}
            </p>
            <p style={styles.emptyBody}>
              {shops.length === 0
                ? 'Be the first to register your restaurant on FoodHub SA.'
                : 'Try a different cuisine or clear the search.'}
            </p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredShops.map(shop => (
              <ShopCard key={shop._id} shop={shop} onClick={() => handleShopClick(shop)} />
            ))}
          </div>
        )}
      </main>

      {/* ── Owner CTA ── */}
      <section style={styles.cta}>
        <div style={styles.ctaInner}>
          <div>
            <h3 style={styles.ctaTitle}>Own a restaurant?</h3>
            <p style={styles.ctaBody}>Join FoodHub SA and reach thousands of hungry customers.</p>
          </div>
          <button
            style={styles.ctaButton}
            className="cta-btn"
            onClick={() => router.push(session ? '/shop-registration' : '/register?redirect=shop-registration')}
          >
            List your restaurant <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Menu modal ── */}
      {selectedShop && (
        <div style={styles.backdrop} onClick={closeMenu}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.modalEyebrow}>{selectedShop.cuisine}</p>
                <h2 style={styles.modalTitle}>{selectedShop.businessName}</h2>
                {selectedShop.city && (
                  <span style={styles.modalCity}>
                    <MapPin size={13} style={{ marginRight: 4 }} />{selectedShop.city}
                  </span>
                )}
              </div>
              <button style={styles.closeBtn} className="close-btn" onClick={closeMenu}>
                <X size={20} />
              </button>
            </div>

            {/* Modal body */}
            <div style={styles.modalBody}>
              {loadingMenu ? (
                <div style={styles.modalLoading}>
                  <div style={styles.spinner} />
                  <p style={{ color: '#888', marginTop: 12 }}>Loading menu…</p>
                </div>
              ) : menuItems.filter(i => i.available).length === 0 ? (
                <div style={styles.modalLoading}>
                  <p style={{ color: '#888' }}>No items available right now.</p>
                </div>
              ) : (
                <div style={styles.menuGrid}>
                  {menuItems.filter(i => i.available).map(item => (
                    <MenuItemCard key={item._id} item={item} onAddToCart={() => handleAddToCart(item)} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Shop card ── */
function ShopCard({ shop, onClick }) {
  return (
    <div style={styles.card} className="shop-card" onClick={onClick}>
      <div style={styles.cardImageWrap} className="card-image-wrap">
        {shop.shopImage ? (
          <Image src={shop.shopImage} alt={shop.businessName} fill className="card-img" style={{ objectFit: 'cover' }} unoptimized />
        ) : (
          <div style={{ ...styles.cardImageFallback }}>
            <span style={styles.cardInitial}>{shop.businessName?.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <span style={styles.cardBadge}>{shop.cuisine || 'Food'}</span>
      </div>

      <div style={styles.cardBody}>
        <h4 style={styles.cardName}>{shop.businessName}</h4>
        <p style={styles.cardDesc}>{shop.description || 'Delicious food awaits you!'}</p>
        <div style={styles.cardFooter}>
          {shop.city && (
            <span style={styles.cardCity}>
              <MapPin size={13} style={{ marginRight: 3 }} />{shop.city}
            </span>
          )}
          <span style={styles.cardCta}>View menu →</span>
        </div>
      </div>
    </div>
  )
}

/* ── Menu item card ── */
function MenuItemCard({ item, onAddToCart }) {
  return (
    <div style={styles.menuCard} className="menu-card">
      <div style={styles.menuCardTop}>
        <div style={{ flex: 1 }}>
          <h5 style={styles.menuName}>{item.name}</h5>
          <p style={styles.menuDesc}>{item.description}</p>
          <span style={styles.menuTag}>{item.category}</span>
        </div>
      </div>
      <div style={styles.menuCardBottom}>
        <span style={styles.menuPrice}>R{item.price.toFixed(2)}</span>
        <button style={styles.addBtn} className="add-btn" onClick={onAddToCart}>
          <Plus size={15} style={{ marginRight: 4 }} /> Add
        </button>
      </div>
    </div>
  )
}

/* ────────────────────────────────
   Styles
──────────────────────────────── */
const styles = {
  page: { fontFamily: "'Inter', 'Helvetica Neue', sans-serif", background: '#F7F4F0', minHeight: '100vh' },

  /* Loading */
  loadingScreen: { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0F0D0B' },
  spinner: { width: 40, height: 40, borderRadius: '50%', border: '3px solid #2a2a2a', borderTop: '3px solid #FF4D2D', animation: 'spin 0.8s linear infinite' },
  loadingText: { marginTop: 16, color: '#888', fontSize: 14 },

  /* Hero */
  hero: { position: 'relative', background: '#0F0D0B', padding: '144px 24px 100px', overflow: 'hidden', minHeight: 380, display: 'flex', alignItems: 'center' },
  heroOverlay: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(255,77,45,0.18) 0%, transparent 70%)',
    pointerEvents: 'none'
  },
  heroContent: { maxWidth: 680, margin: '0 auto', position: 'relative', zIndex: 1, width: '100%' },
  heroEyebrow: { fontSize: 13, letterSpacing: '0.08em', color: '#888', marginBottom: 16, textTransform: 'uppercase' },
  heroHeadline: { fontSize: 'clamp(42px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', marginBottom: 32, letterSpacing: '-0.03em' },
  heroAccent: { color: '#FF4D2D' },
  searchWrapper: { position: 'relative', maxWidth: 540 },
  searchIcon: { position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#888', pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '16px 16px 16px 48px', background: '#1C1916',
    border: '1px solid #2E2A26', borderRadius: 12, color: '#fff', fontSize: 15,
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  },

  /* Main */
  main: { maxWidth: 1200, margin: '0 auto', padding: '40px 24px 60px' },

  /* Error */
  errorBanner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', marginBottom: 24, color: '#991B1B', fontSize: 14 },
  errorClose: { background: 'none', border: 'none', cursor: 'pointer', color: '#991B1B', display: 'flex' },

  /* Filters */
  filterRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' },
  pillScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, flex: 1 },
  pill: {
    flexShrink: 0, padding: '8px 16px', borderRadius: 100, border: '1.5px solid #E0DBD4',
    background: '#fff', color: '#555', fontSize: 13, fontWeight: 500, cursor: 'pointer',
    transition: 'all 0.15s', whiteSpace: 'nowrap'
  },
  pillActive: { background: '#0F0D0B', borderColor: '#0F0D0B', color: '#fff' },
  sortGroup: { display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 },
  sortLabel: { fontSize: 13, color: '#888' },
  sortSelect: { padding: '7px 12px', border: '1.5px solid #E0DBD4', borderRadius: 8, fontSize: 13, background: '#fff', color: '#333', cursor: 'pointer', outline: 'none' },

  /* Section header */
  sectionHeader: { display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 },
  sectionTitle: { fontSize: 22, fontWeight: 700, color: '#0F0D0B', letterSpacing: '-0.02em' },
  sectionCount: { fontSize: 14, color: '#999' },

  /* Grid */
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 },

  /* Shop card */
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' },
  cardImageWrap: { position: 'relative', height: 200, overflow: 'hidden' },
  cardImageFallback: { width: '100%', height: '100%', background: 'linear-gradient(135deg, #FF4D2D 0%, #F5A623 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  cardInitial: { fontSize: 56, fontWeight: 800, color: 'rgba(255,255,255,0.9)' },
  cardBadge: { position: 'absolute', top: 12, left: 12, background: 'rgba(15,13,11,0.75)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100, letterSpacing: '0.04em', textTransform: 'uppercase' },
  cardBody: { padding: '16px 20px 20px' },
  cardName: { fontSize: 17, fontWeight: 700, color: '#0F0D0B', marginBottom: 6, letterSpacing: '-0.01em' },
  cardDesc: { fontSize: 13, color: '#777', lineHeight: 1.5, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardCity: { display: 'flex', alignItems: 'center', fontSize: 13, color: '#999' },
  cardCta: { fontSize: 13, fontWeight: 600, color: '#FF4D2D' },

  /* Empty state */
  emptyState: { textAlign: 'center', padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: '#0F0D0B', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: '#888', maxWidth: 320 },

  /* CTA section */
  cta: { background: '#0F0D0B', padding: '48px 24px' },
  ctaInner: { maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' },
  ctaTitle: { fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.02em' },
  ctaBody: { fontSize: 15, color: '#888' },
  ctaButton: { display: 'flex', alignItems: 'center', gap: 6, padding: '14px 24px', background: '#FF4D2D', color: '#fff', border: 'none', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', flexShrink: 0, transition: 'background 0.2s' },

  /* Modal */
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  modal: { background: '#fff', borderRadius: 20, width: '100%', maxWidth: 860, maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  modalHeader: { padding: '24px 28px', borderBottom: '1px solid #F0EDE8', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 },
  modalEyebrow: { fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#FF4D2D', marginBottom: 4 },
  modalTitle: { fontSize: 24, fontWeight: 800, color: '#0F0D0B', letterSpacing: '-0.02em', marginBottom: 4 },
  modalCity: { display: 'flex', alignItems: 'center', fontSize: 13, color: '#999' },
  closeBtn: { background: '#F4F1EC', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#555', flexShrink: 0 },
  modalBody: { overflowY: 'auto', padding: '24px 28px', flex: 1 },
  modalLoading: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' },
  menuGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 },

  /* Menu item card */
  menuCard: { border: '1.5px solid #F0EDE8', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 12, background: '#fff', transition: 'border-color 0.15s, box-shadow 0.15s' },
  menuCardTop: { display: 'flex', gap: 12 },
  menuName: { fontSize: 15, fontWeight: 700, color: '#0F0D0B', marginBottom: 4 },
  menuDesc: { fontSize: 13, color: '#888', lineHeight: 1.5, marginBottom: 8 },
  menuTag: { display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#888', background: '#F4F1EC', padding: '3px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.05em' },
  menuCardBottom: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  menuPrice: { fontSize: 18, fontWeight: 800, color: '#0F0D0B', letterSpacing: '-0.02em' },
  addBtn: { display: 'flex', alignItems: 'center', padding: '9px 16px', background: '#FF4D2D', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s' },
}

const css = `
  @keyframes spin { to { transform: rotate(360deg); } }

  .hero-search:focus { border-color: #FF4D2D !important; box-shadow: 0 0 0 3px rgba(255,77,45,0.15); }
  .hero-search::placeholder { color: #555; }

  .pill-scroll::-webkit-scrollbar { display: none; }
  .pill-scroll { -ms-overflow-style: none; scrollbar-width: none; }

  .pill-btn:hover { background: #F4F1EC !important; border-color: #C8C2B8 !important; }

  .shop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.10) !important; }
  .shop-card:hover .card-img { transform: scale(1.05); }
  .card-img { transition: transform 0.4s ease !important; }
  .card-image-wrap { overflow: hidden; }

  .cta-btn:hover { background: #e03e22 !important; }

  .close-btn:hover { background: #E8E4DE !important; }

  .add-btn:hover { background: #e03e22 !important; }

  .menu-card:hover { border-color: #FF4D2D !important; box-shadow: 0 4px 16px rgba(255,77,45,0.08) !important; }

  @media (max-width: 640px) {
    .pill-scroll { flex-wrap: nowrap; }
  }
`