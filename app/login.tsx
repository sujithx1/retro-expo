import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLogin, useRegister } from '../hooks/useAuth';

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


export const  emailValidator=(e:string)=>{
  if(e.trim().length===0){
    return "Please enter your email";
  }
  if(!e.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
    return "Please enter a valid email";
  }
  return null;  
}

export default function LoginScreen() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isLoading = loginMutation.isPending || registerMutation.isPending;
  const apiError = loginMutation.error?.message || registerMutation.error?.message;
  const error = localError || apiError;



  
  
  const handleSubmit = () => {
    setLocalError(null);
    loginMutation.reset();
    registerMutation.reset();

    if (!email.trim() || !password.trim()) {
      setLocalError("Please fill out all fields.");
      return;
    }

    if(emailValidator(email)){
      setLocalError(emailValidator(email));
      return;
    }
    
    if (isSignUp) {
      if (!name.trim()) {
        setLocalError("Please enter your name.");
        return;
      }
      if (!agreeTerms) {
        setLocalError("You must agree to the Terms & Conditions.");
        return;
      }
      registerMutation.mutate(
        { name, email, password },
        {
          onSuccess: () => {
            router.replace('/(tabs)');
          },
        }
      );
    } else {
      loginMutation.mutate(
        { email, password },
        {
          onSuccess: () => {
            router.replace('/(tabs)');
          },
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      {/* Close Modal Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Logo / Brand Header */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandLogo}>retro.</Text>
            <Text style={styles.brandSubtitle}>THE ANALOG E-COMMERCE CLUB</Text>
          </View>

          {/* Toggle Switch */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleTab, !isSignUp && styles.toggleTabActive]}
              onPress={() => setIsSignUp(false)}
            >
              <Text style={[styles.toggleText, !isSignUp && styles.toggleTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleTab, isSignUp && styles.toggleTabActive]}
              onPress={() => setIsSignUp(true)}
            >
              <Text style={[styles.toggleText, isSignUp && styles.toggleTextActive]}>Join Club</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={18} color={COLORS.accent} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {isSignUp && (
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    placeholderTextColor={COLORS.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={18} color={COLORS.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder={isSignUp ? "Create password" : "Enter password"}
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
            </View>

            {!isSignUp && (
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}

            {isSignUp && (
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                <Ionicons
                  name={agreeTerms ? "checkbox" : "square-outline"}
                  size={20}
                  color={agreeTerms ? COLORS.accent : COLORS.textMuted}
                  style={styles.checkbox}
                />
                <Text style={styles.termsText}>
                  I agree to the retro. <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={[styles.submitBtn, isLoading && { opacity: 0.8 }]} onPress={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={COLORS.bg} size="small" />
              ) : (
                <Text style={styles.submitBtnText}>
                  {isSignUp ? 'JOIN THE CLUB' : 'WELCOME BACK'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Social Sign-In */}
          <Text style={styles.orText}>OR CONTINUE WITH</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-google" size={20} color={COLORS.text} />
              <Text style={styles.socialBtnText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialBtn}>
              <Ionicons name="logo-apple" size={20} color={COLORS.text} />
              <Text style={styles.socialBtnText}>Apple</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  closeBtn: {
    padding: 6,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  brandLogo: {
    fontSize: 42,
    fontWeight: '900',
    fontStyle: 'italic',
    color: COLORS.text,
    letterSpacing: -1,
  },
  brandSubtitle: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 4,
    color: COLORS.accent,
    marginTop: 2,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.accentLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 4,
    marginVertical: 16,
  },
  toggleTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleTabActive: {
    backgroundColor: COLORS.cardBg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  toggleTextActive: {
    color: COLORS.text,
  },
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.bg,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.accent,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  termsLink: {
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  submitBtn: {
    backgroundColor: COLORS.accent,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    color: COLORS.bg,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1,
  },
  orText: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    textAlign: 'center',
    marginVertical: 24,
    letterSpacing: 2,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    width: '48%',
  },
  socialBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginLeft: 8,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDF2F0',
    borderColor: '#F5C6BC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    gap: 6,
  },
  errorText: {
    flex: 1,
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
  },
});
