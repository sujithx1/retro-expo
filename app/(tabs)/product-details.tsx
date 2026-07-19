import { getProductImage } from '@/helpers';
import { useProductDetails } from '@/hooks/retro/useProductDetails';
import { addToCart, retroStore, toggleWishlist } from '@/store/retro-store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@tanstack/react-store';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, productDetailsStyles as styles } from '@/constants/styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { data: detailsData, isLoading, error, refetch } = useProductDetails(id || '');

  const wishlist = useSelector(retroStore, (state) => state.wishlist);
  const isFav = wishlist.some((p) => p._id === id);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
        <Text style={[styles.brandLogo, { marginTop: 16 }]}>retro.</Text>
        <Text style={styles.brandSub}>LOADING PRODUCT DETAILS...</Text>
      </SafeAreaView>
    );
  }

  if (error || !detailsData?.product) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centeredContainer, { paddingHorizontal: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.accent} />
        <Text style={[styles.sectionTitle, { marginTop: 16, textAlign: 'center' }]}>Failed to load product</Text>
        <Text style={[styles.slideDesc, { textAlign: 'center', marginTop: 8 }]}>
          {(error as any)?.message || 'Product details are unavailable. Please try again.'}
        </Text>
        <TouchableOpacity style={[styles.slideBtn, { marginTop: 20, alignSelf: 'center' }]} onPress={() => refetch()}>
          <Text style={styles.slideBtnText}>TRY AGAIN</Text>
          <Ionicons name="refresh" size={14} color={COLORS.bg} />
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { product, totalstock, relatedProduct, CountRating } = detailsData;
  const hasDiscount = product.promo_price > 0 && product.promo_price < product.price;
  const displayPrice = hasDiscount ? product.promo_price : product.price;

  // Sizes array to display
  const sizes = [
    { label: 'XS', qty: product.stock?.XS || 0 },
    { label: 'S', qty: product.stock?.S || 0 },
    { label: 'M', qty: product.stock?.M || 0 },
    { label: 'L', qty: product.stock?.L || 0 },
    { label: 'XL', qty: product.stock?.XL || 0 },
    { label: 'XXL', qty: product.stock?.XXL || 0 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
        <TouchableOpacity onPress={() => toggleWishlist(product)} style={styles.headerBtn}>
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? COLORS.accent : COLORS.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <View style={styles.mainImageWrapper}>
            <Image
              source={getProductImage(product.image ? [product.image[activeImageIndex] || product.image[0]] : [])}
              style={styles.mainImage}
              resizeMode="contain"
            />
          </View>

          {/* Thumbnail list if there are multiple images */}
          {product.image && product.image.length > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailScroll}
            >
              {product.image.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.thumbnailWrapper,
                    activeImageIndex === idx && styles.activeThumbnailWrapper,
                  ]}
                  onPress={() => setActiveImageIndex(idx)}
                >
                  <Image source={getProductImage([img])} style={styles.thumbnailImage} resizeMode="contain" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsCard}>
          {product.offer && (
            <View style={styles.offerBadge}>
              <Text style={styles.offerText}>
                {product.offer.offerName} ({product.offer.Discount}% OFF)
              </Text>
            </View>
          )}

          <Text style={styles.productCat}>{product.category?.name || 'VINTAGE'}</Text>
          <Text style={styles.productName}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={COLORS.gold} />
            <Text style={styles.ratingVal}>
              {product.totalstars > 0
                ? (product.totalstars / (product.numReview || 1)).toFixed(1)
                : '4.5'}
            </Text>
            <Text style={styles.ratingCount}>({CountRating || product.numReview || 0} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <View style={styles.priceWrap}>
              {hasDiscount && (
                <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
              )}
              <Text style={styles.productPrice}>${displayPrice.toFixed(2)}</Text>
            </View>

            <View style={styles.stockBadge}>
              <Text style={totalstock > 0 ? styles.inStockText : styles.outOfStockText}>
                {totalstock > 0 ? `In Stock (${totalstock})` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Sizes */}
          <Text style={styles.sectionHeading}>Available Options</Text>
          <View style={styles.sizesContainer}>
            {sizes.map((s, idx) => {
              const inStock = s.qty > 0;
              return (
                <View
                  key={idx}
                  style={[
                    styles.sizeBox,
                    !inStock && styles.outOfStockSizeBox,
                  ]}
                >
                  <Text style={[styles.sizeLabel, !inStock && styles.outOfStockSizeLabel]}>
                    {s.label}
                  </Text>
                  <Text style={styles.sizeQty}>({s.qty})</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.descriptionText}>{product.description}</Text>
        </View>

        {/* Related Products */}
        {relatedProduct && relatedProduct.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>You May Also Like</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {relatedProduct
                .filter((p) => p._id !== product._id)
                .map((rp) => (
                  <TouchableOpacity
                    key={rp._id}
                    style={styles.relatedCard}
                    onPress={() => {
                      router.push({
                        pathname: '/(tabs)/product-details',
                        params: { id: rp._id },
                      });
                      setActiveImageIndex(0);
                    }}
                  >
                    <Image
                      source={getProductImage(rp.image)}
                      style={styles.relatedImg}
                      resizeMode="contain"
                    />
                    <Text style={styles.relatedCardName} numberOfLines={1}>
                      {rp.name}
                    </Text>
                    <Text style={styles.relatedCardPrice}>
                      ${(rp.promo_price || rp.price).toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.addToCartBtn,
            totalstock === 0 && styles.disabledBtn,
          ]}
          disabled={totalstock === 0}
          onPress={() => addToCart(product)}
        >
          <Text style={styles.addToCartText}>
            {totalstock > 0 ? 'ADD TO SHOPPING BAG' : 'OUT OF STOCK'}
          </Text>
          <Ionicons name="cart-outline" size={20} color={COLORS.bg} style={{ marginLeft: 8 }} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
