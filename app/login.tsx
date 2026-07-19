import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useLogin, useRegister } from '../hooks/useAuth';
import { COLORS, loginStyles as styles } from '../constants/styles';

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

