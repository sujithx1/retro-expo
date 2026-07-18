import { getProductImage } from '@/helpers';
import { addToCart, retroStore, toggleWishlist } from '@/store/retro-store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@tanstack/react-store';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function WishlistScreen() {
  const router = useRouter();
  const wishlist = useSelector(retroStore, (state) => state.wishlist);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <View style={styles.headerPlaceholder}>
          <Text style={styles.itemCount}>({wishlist.length})</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {wishlist.length === 0 ? (
          <View style={styles.emptyBag}>
            <Ionicons name="heart-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtitle}>Tap the heart icon on any vintage finds to save them here.</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => router.push('/(tabs)')}>
              <Text style={styles.exploreText}>START EXPLORING</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.itemList}>
            {wishlist.map((item) => {
              const hasDiscount = item.promo_price > 0 && item.promo_price < item.price;
              const displayPrice = hasDiscount ? item.promo_price : item.price;

              return (
                <View key={item._id} style={styles.itemCard}>
                  {/* Click to navigate to details */}
                  <TouchableOpacity
                    style={styles.imageWrap}
                    onPress={() => router.push({
                      pathname: '/(tabs)/product-details',
                      params: { id: item._id }
                    })}
                  >
                    <Image source={getProductImage(item.image)} style={styles.productImg} resizeMode="contain" />
                  </TouchableOpacity>

                  <View style={styles.itemDetails}>
                    <View style={styles.topRow}>
                      <Text style={styles.itemCat}>{item.category?.name || 'VINTAGE'}</Text>
                      <TouchableOpacity style={styles.removeBtn} onPress={() => toggleWishlist(item)}>
                        <Ionicons name="trash-outline" size={16} color={COLORS.accent} />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={() => router.push({
                        pathname: '/(tabs)/product-details',
                        params: { id: item._id }
                      })}
                    >
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    </TouchableOpacity>

                    <View style={styles.bottomRow}>
                      <View style={styles.priceContainer}>
                        {hasDiscount && (
                          <Text style={styles.originalPrice}>${item.price.toFixed(2)}</Text>
                        )}
                        <Text style={styles.itemPrice}>${displayPrice.toFixed(2)}</Text>
                      </View>

                      <TouchableOpacity style={styles.bagBtn} onPress={() => addToCart(item)}>
                        <Text style={styles.bagBtnText}>ADD TO BAG</Text>
                        <Ionicons name="cart-outline" size={14} color={COLORS.bg} style={{ marginLeft: 4 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  headerPlaceholder: {
    padding: 6,
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  emptyBag: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginTop: 18,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: COLORS.text,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exploreText: {
    color: COLORS.bg,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  itemList: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  imageWrap: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: {
    width: '90%',
    height: '90%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCat: {
    fontSize: 8,
    color: COLORS.accent,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  removeBtn: {
    padding: 4,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  originalPrice: {
    fontSize: 10,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
    marginBottom: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  bagBtn: {
    backgroundColor: COLORS.text,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  bagBtnText: {
    color: COLORS.bg,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});