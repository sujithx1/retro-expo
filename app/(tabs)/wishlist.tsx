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
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, wishlistStyles as styles } from '@/constants/styles';

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
