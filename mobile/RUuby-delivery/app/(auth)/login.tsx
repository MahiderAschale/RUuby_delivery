import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F8F5EF",
  foreground: "#26231F",
  muted: "#817D76",
  primary: "#7B1E3A",
  primarySoft: "#F1DCE3",
  border: "#E7E0D7",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {/* Back button */}
      <Pressable
        style={styles.backButton}
        onPress={() => router.back()}
        accessibilityLabel="Go back"
      >
        <Ionicons
          name="arrow-back"
          size={20}
          color={COLORS.foreground}
        />
      </Pressable>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>R</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Login to continue ordering your favorite food.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>PHONE NUMBER</Text>

          <TextInput
            placeholder="0912345678"
            placeholderTextColor="#AAA39A"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>PASSWORD</Text>

            <Pressable>
              <Text style={styles.forgotPassword}>
                Forgot password?
              </Text>
            </Pressable>
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#AAA39A"
              secureTextEntry={!showPassword}
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() =>
                setShowPassword((current) => !current)
              }
              accessibilityLabel={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              <Ionicons
                name={
                  showPassword
                    ? "eye-off-outline"
                    : "eye-outline"
                }
                size={19}
                color={COLORS.muted}
              />
            </Pressable>
          </View>
        </View>

        {/* Login */}
        <Pressable
          style={styles.loginButton}
          onPress={() => {
            // Backend connection will be added later.
          }}
        >
          <Text style={styles.loginButtonText}>
            Login
          </Text>
        </Pressable>
      </View>

      {/* Register */}
      <View style={styles.bottomText}>
        <Text style={styles.accountText}>
          Don't have an account?
        </Text>

        <Pressable
          onPress={() =>
            router.replace("/(auth)/register")
          }
        >
          <Text style={styles.registerLink}>
            Create one
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    shadowColor: "#2D2514",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  header: {
    alignItems: "center",
    marginTop: 48,
  },

  iconCircle: {
    width: 56,
    height: 56,
    marginBottom: 18,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },

  iconText: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: "800",
  },

  title: {
    color: COLORS.foreground,
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    maxWidth: 300,
    marginTop: 9,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  form: {
    marginTop: 42,
    gap: 20,
  },

  field: {
    gap: 8,
  },

  label: {
    color: "#898178",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  input: {
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    color: COLORS.foreground,
    backgroundColor: COLORS.white,
    fontSize: 14,
  },

  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  forgotPassword: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: "700",
  },

  passwordInputContainer: {
    height: 54,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },

  passwordInput: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 14,
    padding: 0,
  },

  loginButton: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  loginButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  bottomText: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  accountText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  registerLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});