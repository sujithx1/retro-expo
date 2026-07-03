import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsBtn}>
          <Ionicons name="settings-outline" size={22} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarText}>RF</Text>
            </View>
            <View style={styles.badgeWrap}>
              <MaterialCommunityIcons name="shield-star" size={16} color={COLORS.bg} />
            </View>
          </View>

          <Text style={styles.userName}>Retro Fan</Text>
          <Text style={styles.userEmail}>collector@retro88.com</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLbl}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>850</Text>
              <Text style={styles.statLbl}>Club Points</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>5</Text>
              <Text style={styles.statLbl}>Wishlist</Text>
            </View>
          </View>
        </View>

        {/* Club Rewards Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Retro Club Rewards</Text>
        </View>
        <View style={styles.rewardsCard}>
          <View style={styles.rewardsInfo}>
            <Ionicons name="gift-outline" size={24} color={COLORS.accent} />
            <View style={styles.rewardsTextWrap}>
              <Text style={styles.rewardsTitle}>$10 Reward Available</Text>
              <Text style={styles.rewardsSubtitle}>Redeemable on order over $50</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.redeemBtn}>
            <Text style={styles.redeemText}>REDEEM</Text>
          </TouchableOpacity>
        </View>

        {/* Order History */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ordersList}>
          {/* Order 1 */}
          <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>ORDER #98210</Text>
              <Text style={styles.orderStatus}>DELIVERED</Text>
            </View>
            <View style={styles.orderProductRow}>
              <View style={styles.orderProductInfo}>
                <Text style={styles.orderProductName}>Classic Rangefinder Camera</Text>
                <Text style={styles.orderProductQty}>Qty: 1 • $249.00</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </View>

          {/* Order 2 */}
          <View style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>ORDER #97489</Text>
              <Text style={styles.orderStatus}>DELIVERED</Text>
            </View>
            <View style={styles.orderProductRow}>
              <View style={styles.orderProductInfo}>
                <Text style={styles.orderProductName}>Yellow Tape Deck Walkman</Text>
                <Text style={styles.orderProductQty}>Qty: 1 • $129.00</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </View>
          </View>
        </View>

        {/* Options List */}
        <View style={styles.optionsList}>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons name="heart-outline" size={20} color={COLORS.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>My Wishlist</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons name="location-outline" size={20} color={COLORS.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>Shipping Addresses</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <Ionicons name="card-outline" size={20} color={COLORS.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionRow, styles.lastOptionRow]}
            onPress={() => router.push('/login')}
          >
            <View style={styles.optionLeft}>
              <Ionicons name="log-out-outline" size={20} color={COLORS.accent} style={styles.optionIcon} />
              <Text style={[styles.optionText, { color: COLORS.accent }]}>Sign Out</Text>
            </View>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  settingsBtn: {
    padding: 4,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.accentLight,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.accent,
  },
  badgeWrap: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.accent,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBg,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
    justifyContent: 'space-around',
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
  },
  statLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: COLORS.border,
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  rewardsCard: {
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    marginHorizontal: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardsTextWrap: {
    marginLeft: 12,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.text,
  },
  rewardsSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: COLORS.text,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemText: {
    color: COLORS.bg,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  ordersList: {
    marginHorizontal: 20,
  },
  orderItem: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 8,
    marginBottom: 8,
  },
  orderId: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.text,
  },
  orderStatus: {
    fontSize: 10,
    fontWeight: '800',
    color: '#27AE60',
    letterSpacing: 0.5,
  },
  orderProductRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderProductInfo: {
    flex: 1,
  },
  orderProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  orderProductQty: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  optionsList: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 24,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastOptionRow: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
});
