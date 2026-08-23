import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
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

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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

        <Text style={styles.title}>
          Create your account
        </Text>

        <Text style={styles.subtitle}>
          Join RUuby and get your favorite meals
          delivered to your door.
        </Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {/* First + Last name */}
        <View style={styles.row}>
          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              FIRST NAME
            </Text>

            <TextInput
              placeholder="First name"
              placeholderTextColor="#AAA39A"
              autoCapitalize="words"
              style={styles.input}
            />
          </View>

          <View style={[styles.field, styles.halfField]}>
            <Text style={styles.label}>
              LAST NAME
            </Text>

            <TextInput
              placeholder="Last name"
              placeholderTextColor="#AAA39A"
              autoCapitalize="words"
              style={styles.input}
            />
          </View>
        </View>

        {/* Phone */}
        <View style={styles.field}>
          <Text style={styles.label}>
            PHONE NUMBER
          </Text>

          <TextInput
            placeholder="0912345678"
            placeholderTextColor="#AAA39A"
            keyboardType="phone-pad"
            maxLength={10}
            style={styles.input}
          />
        </View>

        {/* Email */}
        <View style={styles.field}>
          <Text style={styles.label}>EMAIL</Text>

          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#AAA39A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.field}>
          <Text style={styles.label}>
            PASSWORD
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              placeholder="At least 8 characters"
              placeholderTextColor="#AAA39A"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              style={styles.passwordInput}
            />

            <Pressable
              onPress={() =>
                setShowPassword(
                  (current) => !current,
                )
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

        {/* Register */}
        <Pressable
          style={styles.registerButton}
          onPress={() => {
            // Backend registration will be connected later.
          }}
        >
          <Text style={styles.registerButtonText}>
            Create account
          </Text>
        </Pressable>
      </View>

      {/* Login link */}
      <View style={styles.bottomText}>
        <Text style={styles.accountText}>
          Already have an account?
        </Text>

        <Pressable
          onPress={() =>
            router.replace("/(auth)/login")
          }
        >
          <Text style={styles.loginLink}>
            Login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flexGrow: 1,
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
    marginTop: 35,
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
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -1,
    textAlign: "center",
  },

  subtitle: {
    maxWidth: 320,
    marginTop: 9,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },

  form: {
    marginTop: 34,
    gap: 18,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  field: {
    gap: 8,
  },

  halfField: {
    flex: 1,
  },

  label: {
    color: "#898178",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  input: {
    height: 52,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 15,
    color: COLORS.foreground,
    backgroundColor: COLORS.white,
    fontSize: 14,
  },

  passwordInputContainer: {
    height: 52,
    paddingHorizontal: 14,
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

  registerButton: {
    height: 54,
    marginTop: 4,
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

  registerButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  bottomText: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },

  accountText: {
    color: COLORS.muted,
    fontSize: 12,
  },

  loginLink: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "800",
  },
});