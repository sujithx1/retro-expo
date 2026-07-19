import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS, profileStyles as styles } from '@/constants/styles';

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


