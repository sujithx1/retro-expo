import { getProductImage } from '@/helpers';
import { useGetHome } from '@/hooks/retro/usegetHome';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";

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

// Fallback slides if no products/offers exist
const FALLBACK_SLIDES = [
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

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const { data: homeResponse, isLoading, error, refetch } = useGetHome();
  
  const productsData = homeResponse?.data;
  const productsList = productsData?.products || [];
  const categoriesList = productsData?.categories || [];
  // Build dynamic slideshow list from products having promo price or special offer
  const slides = useMemo(() => {
    if (productsList.length === 0) {
      return FALLBACK_SLIDES;
    }
    const promoProducts = productsList.filter(p => p.promo_price > 0 && p.promo_price < p.price);
    const sourceProducts = promoProducts.length > 0 ? promoProducts.slice(0, 3) : productsList.slice(0, 3);
    
    return sourceProducts.map((p) => ({
      id: p._id,
      title: p.name,
      tagline: p.offer?.offerName || 'SPECIAL VINTAGE FIND',
      price: `$${(p.promo_price || p.price).toFixed(2)}`,
      description: p.description,
      image: getProductImage(p.image),
      badge: p.offer?.Discount ? `${p.offer.Discount}% OFF` : 'FEATURED',
    }));
  }, [productsList]);

  // Auto-play slideshow
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleAddToCart = (productName: string) => {
    setCartCount((prev) => prev + 1);
  };

  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
  };

  // Filtered Products list
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={[styles.brandLogo, { marginTop: 16 }]}>retro.</Text>
        <Text style={styles.brandSub}>LOADING EXCLUSIVE FINDS...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer, { paddingHorizontal: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.accent} />
        <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: 'center' }]}>Failed to load retro catalog</Text>
        <Text style={[styles.slideDesc, { textAlign: 'center', marginTop: 8 }]}>
          {(error as any).message || 'Please check your connection and try again.'}
        </Text>
        <TouchableOpacity style={[styles.slideBtn, { marginTop: 20, alignSelf: 'center' }]} onPress={() => refetch()}>
          <Text style={styles.slideBtnText}>TRY AGAIN</Text>
          <Ionicons name="refresh" size={14} color={COLORS.bg} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const activeSlide = slides[currentSlide] || slides[0];

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
        {activeSlide && (
          <View style={styles.slideshowContainer}>
            <View style={styles.slideCard}>
              <View style={styles.slideContent}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.slideBadge}>{activeSlide.badge}</Text>
                </View>
                <Text style={styles.slideTagline}>{activeSlide.tagline}</Text>
                <Text style={styles.slideTitle} numberOfLines={2}>{activeSlide.title}</Text>
                <Text style={styles.slidePrice}>{activeSlide.price}</Text>
                <Text style={styles.slideDesc} numberOfLines={2}>
                  {activeSlide.description}
                </Text>
                <TouchableOpacity
                  style={styles.slideBtn}
                  onPress={() => handleAddToCart(activeSlide.title)}
                >
                  <Text style={styles.slideBtnText}>SHOP NOW</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color={COLORS.bg} />
                </TouchableOpacity>
              </View>

              <View style={styles.slideImageContainer}>
                <Image source={activeSlide.image} style={styles.slideImage} resizeMode="contain" />
              </View>
            </View>

            {/* Dots Indicator */}
            {slides.length > 1 && (
              <View style={styles.dotsContainer}>
                {slides.map((_, index) => (
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
            )}
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Curated Collections</Text>
          <TouchableOpacity onPress={() => setSelectedCategory('All')}>
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
            <Text style={[
              styles.categoryName,
              selectedCategory === 'All' && styles.categoryNameSelected
            ]}>All</Text>
          </TouchableOpacity>

          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat._id}
                style={[
                  styles.categoryCard,
                  isSelected && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(cat.name)}
              >
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
        </View>

        <View style={styles.productsGrid}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyProductsContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyProductsText}>No vintage items found matching your filter</Text>
            </View>
          ) : (
            filteredProducts.map((product) => {
              const isFav = favorites.includes(product._id);
              const hasDiscount = product.promo_price > 0 && product.promo_price < product.price;
              const displayPrice = hasDiscount ? product.promo_price : product.price;
              
              return (
                <View key={product._id} style={styles.productCard}>
                  <TouchableOpacity
                    style={styles.favButton}
                    onPress={() => toggleFavorite(product._id)}
                  >
                    <Ionicons
                      name={isFav ? "heart" : "heart-outline"}
                      size={18}
                      color={isFav ? COLORS.accent : COLORS.text}
                    />
                  </TouchableOpacity>

                  <View style={styles.productImageWrapper}>
                    <Image source={getProductImage(product.image)} style={styles.productImg} resizeMode="contain" />
                  </View>

                  <View style={styles.productDetails}>
                    <Text style={styles.productCat}>{product.category?.name || 'VINTAGE'}</Text>
                    <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>

                    <View style={styles.productRatingRow}>
                      <Ionicons name="star" size={14} color={COLORS.gold} />
                      <Text style={styles.ratingVal}>{product.totalstars > 0 ? (product.totalstars / (product.numReview || 1)).toFixed(1) : '4.5'}</Text>
                      <Text style={styles.ratingCount}>({product.numReview || 0})</Text>
                    </View>

                    <View style={styles.priceRow}>
                      <View style={styles.priceContainer}>
                        {hasDiscount && (
                          <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                        )}
                        <Text style={styles.productPrice}>${displayPrice.toFixed(2)}</Text>
                      </View>
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
            })
          )}
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
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 24,
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
  priceContainer: {
    flexDirection: 'column',
  },
  originalPrice: {
    fontSize: 11,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
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
  emptyProductsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyProductsText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 10,
    textAlign: 'center',
  },
});

