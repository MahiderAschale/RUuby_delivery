import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { registerUser } from "../../services/auth.service";
import { saveToken } from "../../services/auth.storage";

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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

const handleRegister = async () => {
  if (!firstName.trim()) {
    Alert.alert(
      "Registration failed",
      "Please enter your first name.",
    );
    return;
  }

  if (!lastName.trim()) {
    Alert.alert(
      "Registration failed",
      "Please enter your last name.",
    );
    return;
  }

  if (phone.length !== 10) {
    Alert.alert(
      "Registration failed",
      "Phone number must be 10 digits.",
    );
    return;
  }

  if (password.length < 8) {
    Alert.alert(
      "Registration failed",
      "Password must be at least 8 characters.",
    );
    return;
  }

  try {
    setLoading(true);

    const response = await registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      email: email.trim() || undefined,
      password,
    });

    await saveToken(
      response.data.accessToken,
    );

    Alert.alert(
      "Welcome to RUuby",
      "Your account has been created successfully.",
      [
        {
          text: "Continue",
          onPress: () => {
            router.replace("/(main)");
          },
        },
      ],
      {
        cancelable: false,
      },
    );
  } catch (error: any) {
    console.error(
      "Registration error:",
      error,
    );

    const message =
      error?.response?.data?.message ||
      "Registration failed. Please try again.";

    Alert.alert(
      "Registration failed",
      message,
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
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

      <View style={styles.form}>
        <View style={styles.row}>
          <View
            style={[
              styles.field,
              styles.halfField,
            ]}
          >
            <Text style={styles.label}>
              FIRST NAME
            </Text>

            <TextInput
              placeholder="First name"
              placeholderTextColor="#AAA39A"
              autoCapitalize="words"
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />
          </View>

          <View
            style={[
              styles.field,
              styles.halfField,
            ]}
          >
            <Text style={styles.label}>
              LAST NAME
            </Text>

            <TextInput
              placeholder="Last name"
              placeholderTextColor="#AAA39A"
              autoCapitalize="words"
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            PHONE NUMBER
          </Text>

          <TextInput
            placeholder="0912345678"
            placeholderTextColor="#AAA39A"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>EMAIL</Text>

          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#AAA39A"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            PASSWORD
          </Text>

          <View
            style={styles.passwordInputContainer}
          >
            <TextInput
              placeholder="At least 8 characters"
              placeholderTextColor="#AAA39A"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
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

        <Pressable
          style={[
            styles.registerButton,
            loading && styles.registerButtonDisabled,
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text
            style={styles.registerButtonText}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </Text>
        </Pressable>
      </View>

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

  registerButtonDisabled: {
    opacity: 0.6,
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
