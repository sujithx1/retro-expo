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
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector} from '@tanstack/react-store';
import { retroStore, addToCart, toggleWishlist } from '@/store/retro-store';
import { Product } from '@/api/retro-api';
import { useRouter } from 'expo-router';
import { COLORS, homeStyles as styles } from '@/constants/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const cart = useSelector(retroStore, (state) => state.cart);
  const wishlist = useSelector(retroStore, (state) => state.wishlist);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const favorites = wishlist;

  const { data: homeResponse, isLoading, error, refetch } = useGetHome();
  
  const productsData = homeResponse?.data;
  const productsList = productsData?.products || [];
  const categoriesList = productsData?.categories || [];
  // Build dynamic slideshow list from products having promo price or special offer
  const slides = useMemo(() => {
    if (productsList.length === 0) {
      return [] 
    }
    const promoProducts = productsList.filter(p => p.promo_price > 0 && p.promo_price < p.price);
    const sourceProducts = promoProducts.length > 0 ? promoProducts.slice(0, 3) : productsList.slice(0, 3);
    
    return sourceProducts.map((p) => ({
      ...p,
      id: p._id,
      title: p.name,
      tagline: p.offer?.offerName || 'SPECIAL VINTAGE FIND',
      price: `$${(p.promo_price || p.price).toFixed(2)}`,
      description: p.description,
      image: getProductImage(p.image),
      badge: p.offer?.Discount ? `${p.offer.Discount}% OFF` : 'FEATURED',
      product: p
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

  const handleAddToCart = (product?: Product ) => {
    if (product && product._id) {
      addToCart(product);
    }
  };

  const toggleFavorite = (product:Product) => {
    toggleWishlist(product);
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
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.push('/(tabs)/wishlist')}>
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
                  onPress={() => {
                    if (activeSlide.product?._id) {
                      router.push({
                        pathname: '/(tabs)/product-details',
                        params: { id: activeSlide.product._id }
                      });
                    }
                  }}
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
              const isFav = favorites.some((fav) => fav._id === product._id);
              const hasDiscount = product.promo_price > 0 && product.promo_price < product.price;
              const displayPrice = hasDiscount ? product.promo_price : product.price;
              
              return (
                <TouchableOpacity
                  key={product._id}
                  style={styles.productCard}
                  onPress={() => router.push({
                    pathname: '/(tabs)/product-details',
                    params: { id: product._id }
                  })}
                >
                  <TouchableOpacity
                    style={styles.favButton}
                    onPress={() => toggleFavorite(product)}
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
                        onPress={() => handleAddToCart(product)}
                      >
                        <Ionicons name="add" size={18} color={COLORS.bg} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
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



