import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { api } from "../../services/api";

export default function HomeScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("/auth/me");

        console.log("Current user:", response.data);

        setUser(response.data);
      } catch (error: any) {
        console.error(
          "Failed to load user:",
          error,
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load user.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>
          Loading your account...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>
          Authentication Test
        </Text>

        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to RUuby
      </Text>

      <Text style={styles.text}>
        You are successfully authenticated.
      </Text>

      <Text style={styles.text}>
        {JSON.stringify(user, null, 2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#26231F",
    marginBottom: 12,
  },

  text: {
    fontSize: 16,
    color: "#817D76",
    textAlign: "center",
    marginBottom: 12,
  },

  error: {
    fontSize: 16,
    color: "#B42318",
    textAlign: "center",
  },
});