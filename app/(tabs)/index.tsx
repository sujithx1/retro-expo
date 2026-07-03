import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Color Palette
const COLORS = {
  bg: '#F9F5F0',       // Warm vintage cream
  text: '#1C1C1C',     // Matte charcoal black
  textMuted: '#6E6E6E',// Soft grey
  accent: '#C2593F',   // Terracotta rust orange
  accentLight: '#F5EBE6', // Light beige rust tint
  gold: '#D4AF37',     // Antique gold
  cardBg: '#FFFFFF',   // Pure white for cards
  border: '#E8DFD8',   // Light sand border
};

// Slideshow Items
const SLIDES = [
  {
    id: '1',
    title: 'Classic Rangefinder',
    tagline: 'Timeless Analog Vision',
    price: '$249.00',
    description: 'Capture moments in classic 1970s format with retro controls and modern optics.',
    image: require('../../assets/images/retro_camera.png'),
    badge: 'NEW ARRIVAL',
  },
  {
    id: '2',
    title: 'Retro Walkman',
    tagline: '80s Sound, Unplugged',
    price: '$129.00',
    description: 'Experience the tactile satisfaction of tapes with modern Bluetooth connectivity.',
    image: require('../../assets/images/retro_walkman.png'),
    badge: 'BEST SELLER',
  },
  {
    id: '3',
    title: 'Hi-Fi Turntable',
    tagline: 'Pure Acoustic Warmth',
    price: '$399.00',
    description: 'Mid-century wooden record player with premium gold and walnut finishings.',
    image: require('../../assets/images/retro_vinyl.png'),
    badge: 'LIMITED EDITION',
  },
];

// Categories
const CATEGORIES = [
  { id: '1', name: 'Audio', icon: 'headphones', type: 'feather' },
  { id: '2', name: 'Cameras', icon: 'camera', type: 'feather' },
  { id: '3', name: 'Vinyl', icon: 'record-player', type: 'material' },
  { id: '4', name: 'Console', icon: 'gamepad-variant', type: 'material' },
  { id: '5', name: 'Wear', icon: 'tshirt', type: 'font-awesome' },
];

// Featured Products
const PRODUCTS = [
  {
    id: 'p1',
    name: 'Super 8 Video Camera',
    category: 'Cameras',
    price: '$380.00',
    rating: 4.8,
    reviews: 12,
    image: require('../../assets/images/retro_camera.png'),
  },
  {
    id: 'p2',
    name: 'Yellow Tape Deck Pro',
    category: 'Audio',
    price: '$95.00',
    rating: 4.6,
    reviews: 24,
    image: require('../../assets/images/retro_walkman.png'),
  },
  {
    id: 'p3',
    name: 'Mid-Century Oak Console',
    category: 'Vinyl',
    price: '$520.00',
    rating: 4.9,
    reviews: 8,
    image: require('../../assets/images/retro_vinyl.png'),
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Auto-play slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev === SLIDES.length - 1 ? 0 : prev + 1;
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
    // Visual feedback
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <Text style={styles.promoText}>
          GET 10% OFF VINTAGE FINDS • CODE: <Text style={styles.promoCode}>RETRO10</Text>
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.brandLogo}>retro.</Text>
          <Text style={styles.brandSub}>EST. 1988</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={22} color={COLORS.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="heart-outline" size={22} color={COLORS.text} />
            {favorites.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{favorites.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="cart-outline" size={22} color={COLORS.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search vintage items, vinyls, walkman..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Hero Slideshow / Carousel */}
        <View style={styles.slideshowContainer}>
          <View style={styles.slideCard}>
            <View style={styles.slideContent}>
              <View style={styles.badgeContainer}>
                <Text style={styles.slideBadge}>{SLIDES[currentSlide].badge}</Text>
              </View>
              <Text style={styles.slideTagline}>{SLIDES[currentSlide].tagline}</Text>
              <Text style={styles.slideTitle}>{SLIDES[currentSlide].title}</Text>
              <Text style={styles.slidePrice}>{SLIDES[currentSlide].price}</Text>
              <Text style={styles.slideDesc} numberOfLines={2}>
                {SLIDES[currentSlide].description}
              </Text>
              <TouchableOpacity
                style={styles.slideBtn}
                onPress={() => handleAddToCart(SLIDES[currentSlide].title)}
              >
                <Text style={styles.slideBtnText}>SHOP NOW</Text>
                <Ionicons name="arrow-forward-outline" size={16} color={COLORS.bg} />
              </TouchableOpacity>
            </View>

            <View style={styles.slideImageContainer}>
              <Image source={SLIDES[currentSlide].image} style={styles.slideImage} resizeMode="contain" />
            </View>
          </View>

          {/* Dots Indicator */}
          <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dot,
                  currentSlide === index && styles.activeDot,
                ]}
                onPress={() => setCurrentSlide(index)}
              />
            ))}
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Collections</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Browse All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryCard,
              selectedCategory === 'All' && styles.categoryCardSelected,
            ]}
            onPress={() => setSelectedCategory('All')}
          >
            <View style={styles.categoryIconWrap}>
              <Ionicons
                name="grid-outline"
                size={20}
                color={selectedCategory === 'All' ? COLORS.bg : COLORS.text}
              />
            </View>
            <Text style={[
              styles.categoryName,
              selectedCategory === 'All' && styles.categoryNameSelected
            ]}>All</Text>
          </TouchableOpacity>

          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <View style={styles.categoryIconWrap}>
                  {cat.type === 'feather' && (
                    <Ionicons
                      name={cat.icon as any}
                      size={20}
                      color={isSelected ? COLORS.bg : COLORS.text}
                    />
                  )}
                  {cat.type === 'material' && (
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={22}
                      color={isSelected ? COLORS.bg : COLORS.text}
                    />
                  )}
                  {cat.type === 'font-awesome' && (
                    <FontAwesome5
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? COLORS.bg : COLORS.text}
                    />
                  )}
                </View>
                <Text style={[
                  styles.categoryName,
                  isSelected && styles.categoryNameSelected
                ]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Products */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Retro</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View Grid</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.productsGrid}>
          {PRODUCTS.filter(p => selectedCategory === 'All' || p.category === selectedCategory).map((product) => {
            const isFav = favorites.includes(product.id);
            return (
              <View key={product.id} style={styles.productCard}>
                <TouchableOpacity
                  style={styles.favButton}
                  onPress={() => toggleFavorite(product.id)}
                >
                  <Ionicons
                    name={isFav ? "heart" : "heart-outline"}
                    size={18}
                    color={isFav ? COLORS.accent : COLORS.text}
                  />
                </TouchableOpacity>

                <View style={styles.productImageWrapper}>
                  <Image source={product.image} style={styles.productImg} resizeMode="contain" />
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productCat}>{product.category}</Text>
                  <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>

                  <View style={styles.productRatingRow}>
                    <Ionicons name="star" size={14} color={COLORS.gold} />
                    <Text style={styles.ratingVal}>{product.rating}</Text>
                    <Text style={styles.ratingCount}>({product.reviews})</Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <TouchableOpacity
                      style={styles.addCartBtn}
                      onPress={() => handleAddToCart(product.name)}
                    >
                      <Ionicons name="add" size={18} color={COLORS.bg} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Brand Story Banner */}
        <View style={styles.storyBanner}>
          <Text style={styles.storyQuote}>&ldquo;Analog products carry soul. We restore premium retro hardware so you can experience pure sensory design.&rdquo;</Text>
          <View style={styles.divider} />
          <Text style={styles.storyAuthor}>— RETRO CURATORS</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  promoBanner: {
    backgroundColor: COLORS.text,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promoText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  promoCode: {
    color: COLORS.gold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitleContainer: {
    alignItems: 'flex-start',
  },
  brandLogo: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  brandSub: {
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 3,
    color: COLORS.accent,
    marginTop: -2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconBtn: {
    padding: 6,
    marginLeft: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.bg,
    fontSize: 8,
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  slideshowContainer: {
    marginHorizontal: 20,
    marginVertical: 12,
  },
  slideCard: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  slideContent: {
    flex: 1.2,
    justifyContent: 'center',
    zIndex: 2,
  },
  badgeContainer: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 6,
  },
  slideBadge: {
    color: COLORS.bg,
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 1,
  },
  slideTagline: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  slideTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 26,
    marginBottom: 6,
  },
  slidePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  slideDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginBottom: 14,
  },
  slideBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  slideBtnText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    marginRight: 6,
  },
  slideImageContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  slideImage: {
    width: '100%',
    height: '90%',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 18,
    backgroundColor: COLORS.accent,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 22,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  categoriesScroll: {
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.cardBg,
    flexDirection: 'row',
  },
  categoryCardSelected: {
    backgroundColor: COLORS.text,
    borderColor: COLORS.text,
  },
  categoryIconWrap: {
    marginRight: 6,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  categoryNameSelected: {
    color: COLORS.bg,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 14,
    justifyContent: 'space-between',
  },
  productCard: {
    width: (SCREEN_WIDTH - 38) / 2,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    position: 'relative',
  },
  favButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  productImageWrapper: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImg: {
    width: '90%',
    height: '90%',
  },
  productDetails: {
    paddingHorizontal: 2,
  },
  productCat: {
    fontSize: 9,
    color: COLORS.accent,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  productName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingVal: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 3,
  },
  ratingCount: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginLeft: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  addCartBtn: {
    backgroundColor: COLORS.text,
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyBanner: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 30,
    padding: 24,
    alignItems: 'center',
  },
  storyQuote: {
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
    color: COLORS.text,
    fontWeight: '500',
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.accent,
    marginVertical: 12,
  },
  storyAuthor: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 2,
    color: COLORS.accent,
  },
});
