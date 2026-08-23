import { router } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#F8F5EF",
  foreground: "#26231F",
  muted: "#817D76",
  primary: "#7B1E3A",
  primaryDark: "#64162F",
  primarySoft: "#F1DCE3",
  white: "#FFFFFF",
};

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.topArea}>
        <View style={styles.locationBadge}>
          <Ionicons
            name="location-outline"
            size={15}
            color={COLORS.primary}
          />

          <Text style={styles.locationText}>
            Addis Ababa
          </Text>
        </View>
      </View>

      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons
            name="restaurant-outline"
            size={42}
            color={COLORS.white}
          />
        </View>

        <Text style={styles.logo}>RUuby</Text>

        <Text style={styles.title}>
          Food you love,
          {"\n"}
          <Text style={styles.titleAccent}>
            delivered to you.
          </Text>
        </Text>

        <Text style={styles.description}>
          Discover restaurants around you, order your
          favorite meals, and enjoy fast delivery.
        </Text>
      </View>

      <View style={styles.bottomArea}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/(auth)/login")}
        >
          <Text style={styles.primaryButtonText}>
            Login
          </Text>

          <Ionicons
            name="arrow-forward"
            size={19}
            color={COLORS.white}
          />
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.push("/(auth)/register")
          }
        >
          <Text style={styles.secondaryButtonText}>
            Create an account
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          By continuing, you agree to our Terms and
          Privacy Policy.
        </Text>
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
    justifyContent: "space-between",
  },

  topArea: {
    alignItems: "flex-start",
  },

  locationBadge: {
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.primarySoft,
  },

  locationText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "700",
  },

  hero: {
    alignItems: "center",
    paddingHorizontal: 10,
  },

  logoCircle: {
    width: 82,
    height: 82,
    marginBottom: 18,
    borderRadius: 41,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 9,
    },
    elevation: 5,
  },

  logo: {
    marginBottom: 25,
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  title: {
    color: COLORS.foreground,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -1.6,
  },

  titleAccent: {
    color: COLORS.primary,
  },

  description: {
    maxWidth: 320,
    marginTop: 16,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },

  bottomArea: {
    gap: 12,
  },

  primaryButton: {
    height: 54,
    borderRadius: 16,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.22,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },

  primaryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "800",
  },

  secondaryButton: {
    height: 54,
    borderWidth: 1,
    borderColor: "#DED7CF",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  secondaryButtonText: {
    color: COLORS.foreground,
    fontSize: 15,
    fontWeight: "700",
  },

  footerText: {
    marginTop: 5,
    color: "#A19B92",
    fontSize: 9,
    lineHeight: 14,
    textAlign: "center",
  },
});