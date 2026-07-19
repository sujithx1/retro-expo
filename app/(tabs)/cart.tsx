import { getProductImage } from '@/helpers';
import { removeFromCart, retroStore, updateCartQty } from '@/store/retro-store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from '@tanstack/react-store';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, cartStyles as styles } from '@/constants/styles';

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


