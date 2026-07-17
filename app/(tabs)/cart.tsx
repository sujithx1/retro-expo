import { getProductImage } from '@/helpers';
import { removeFromCart, retroStore, updateCartQty } from '@/store/retro-store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@tanstack/react-store';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

export default function CartScreen() {
  const cart = useSelector(retroStore, (state) => state.cart);
  const [localError, setLocalError] = useState<string | null>(null);
  // Pricing calculations
  const subtotal = cart.reduce((acc, item) => {
    const hasDiscount = item.product.promo_price > 0 && item.product.promo_price < item.product.price;
    const price = hasDiscount ? item.product.promo_price : item.product.price;
    return acc + price * item.qty;
  }, 0);
  const shipping = subtotal > 150 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePromoCode = () => {
    setLocalError("No Promo Code Available ");
    return false
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Bag</Text>
        <Text style={styles.itemCount}>({cart.reduce((acc, i) => acc + i.qty, 0)} Items)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {cart.length === 0 ? (
          <View style={styles.emptyBag}>
            <Ionicons name="cart-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>Your bag is empty</Text>
            <Text style={styles.emptySubtitle}>Explore the collections to add some vintage soul.</Text>
          </View>
        ) : (
          <>
            {/* Items List */}
            <View style={styles.itemList}>
              {cart.map((item) => {
                const hasDiscount = item.product.promo_price > 0 && item.product.promo_price < item.product.price;
                const price = hasDiscount ? item.product.promo_price : item.product.price;

                return (
                  <View key={item.product._id} style={styles.itemCard}>
                    <View style={styles.imageWrap}>
                      <Image source={getProductImage(item.product.image)} style={styles.productImg} resizeMode="contain" />
                    </View>

                    <View style={styles.itemDetails}>
                      <Text style={styles.itemCat}>{item.product.category?.name || 'VINTAGE'}</Text>
                      <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
                      <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>

                      <View style={styles.qtyRow}>
                        <View style={styles.qtyAdjust}>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.product._id, -1)}>
                            <Ionicons name="remove" size={16} color={COLORS.text} />
                          </TouchableOpacity>
                          <Text style={styles.qtyVal}>{item.qty}</Text>
                          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.product._id, 1)}>
                            <Ionicons name="add" size={16} color={COLORS.text} />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.removeBtn} onPress={() => removeFromCart(item.product._id)}>
                          <Ionicons name="trash-outline" size={16} color={COLORS.accent} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>


            {/* promo code error  section  */}
            {localError && (
              <View style={styles.errorContainer}>
                <View style={styles.errorInfoRow}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.accent} />
                  <Text style={styles.errorText}>{localError}</Text>
                </View>
                <TouchableOpacity onPress={() => setLocalError(null)} style={styles.errorCloseBtn}>
                  <Ionicons name="close" size={16} color={COLORS.accent} />
                </TouchableOpacity>
              </View>
            )}
            {/* promocode section  */}
            <View style={styles.promoSection}>
              <TextInput
                style={styles.promoInput}
                placeholder="Enter promo code"
                placeholderTextColor={COLORS.textMuted}
              />
              <TouchableOpacity style={styles.promoBtn} onPress={handlePromoCode}>
                <Text style={styles.promoBtnText}>APPLY</Text>
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLbl}>Subtotal</Text>
                <Text style={styles.summaryVal}>${subtotal.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLbl}>Shipping</Text>
                <Text style={styles.summaryVal}>
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLbl}>Estimated Tax</Text>
                <Text style={styles.summaryVal}>${tax.toFixed(2)}</Text>
              </View>

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLbl}>Total</Text>
                <Text style={styles.totalVal}>${total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.checkoutBtn}>
                <Text style={styles.checkoutText}>PROCEED TO SECURE CHECKOUT</Text>
                <Ionicons name="lock-closed" size={14} color={COLORS.bg} style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            </View>
          </>
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
    alignItems: 'baseline',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  itemCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
    fontWeight: '600',
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
  },
  itemList: {
    paddingHorizontal: 20,
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
  itemCat: {
    fontSize: 8,
    color: COLORS.accent,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 1,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  qtyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyAdjust: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  qtyVal: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
    paddingHorizontal: 4,
  },
  removeBtn: {
    padding: 4,
  },
  promoSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
    height: 44,
  },
  promoInput: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 13,
    color: COLORS.text,
  },
  promoBtn: {
    backgroundColor: COLORS.text,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    marginLeft: 8,
  },
  promoBtnText: {
    color: COLORS.bg,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  summaryCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.text,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 10,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLbl: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  summaryVal: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  totalLbl: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  totalVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.accent,
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutText: {
    color: COLORS.bg,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.accentLight,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 6,
  },
  errorInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 8,
  },
  errorText: {
    flex: 1,
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  errorCloseBtn: {
    padding: 2,
    marginLeft: 10,
  },
});
