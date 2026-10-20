import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getCurrentUser } from "../../services/auth.service";

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  role: string;
  status: string;
  createdAt: string;
}

interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

export default function ProfileScreen() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setErrorMessage("");

      const response =
        (await getCurrentUser()) as CurrentUserResponse;

      if (!response.success || !response.data?.user) {
        throw new Error("Unable to load your profile.");
      }

      setUser(response.data.user);
    } catch (error: any) {
      console.error("Load profile error:", error);

      setErrorMessage(
        error?.response?.data?.message ||
          error?.message ||
          "Could not load your profile. Please try again.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    void loadProfile();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7B1E3A" />
        <Text style={styles.loadingText}>
          Loading your profile...
        </Text>
      </View>
    );
  }

  if (errorMessage && !user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>
          Couldn't load your profile
        </Text>

        <Text style={styles.errorText}>
          {errorMessage}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={() => {
            setLoading(true);
            void loadProfile();
          }}
        >
          <Text style={styles.retryButtonText}>
            Try again
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  const fullName =
    `${user.firstName} ${user.lastName}`.trim();

  const initials =
    `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`
      .toUpperCase() || "U";

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor="#7B1E3A"
        />
      }
    >
      <Text style={styles.pageTitle}>My Profile</Text>
      <Text style={styles.pageSubtitle}>
        Manage your RUuby account
      </Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {initials}
          </Text>
        </View>

        <Text style={styles.fullName}>
          {fullName}
        </Text>

        <Text style={styles.role}>
          {user.role.replace(/_/g, " ")}
        </Text>

        <View
          style={[
            styles.statusBadge,
            user.status !== "ACTIVE" &&
              styles.inactiveBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              user.status !== "ACTIVE" &&
                styles.inactiveStatusText,
            ]}
          >
            {user.status}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Personal information
      </Text>

      <View style={styles.infoCard}>
        <ProfileField
          label="First name"
          value={user.firstName}
        />

        <ProfileField
          label="Last name"
          value={user.lastName}
        />

        <ProfileField
          label="Phone number"
          value={user.phone}
        />

        <ProfileField
          label="Email address"
          value={user.email || "Not provided"}
          last
        />
      </View>

      <Text style={styles.footerText}>
        RUuby Delivery
      </Text>
    </ScrollView>
  );
}

function ProfileField({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !last && styles.infoRowBorder,
      ]}
    >
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  content: {
    padding: 20,
    paddingBottom: 36,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#F8F5EF",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#7B1E3A",
  },
  pageSubtitle: {
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
    color: "#77716D",
  },
  profileCard: {
    alignItems: "center",
    padding: 24,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    marginBottom: 28,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#7B1E3A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  fullName: {
    color: "#2F2927",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
  },
  role: {
    color: "#77716D",
    fontSize: 13,
    marginTop: 6,
  },
  statusBadge: {
    marginTop: 12,
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  inactiveBadge: {
    backgroundColor: "#FCE8E6",
  },
  statusText: {
    color: "#287D3C",
    fontSize: 11,
    fontWeight: "800",
  },
  inactiveStatusText: {
    color: "#B3261E",
  },
  sectionTitle: {
    color: "#2F2927",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  infoRow: {
    paddingVertical: 16,
    gap: 6,
  },
  infoRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5DFD8",
  },
  fieldLabel: {
    color: "#817873",
    fontSize: 13,
  },
  fieldValue: {
    color: "#302926",
    fontSize: 15,
    fontWeight: "600",
  },
  loadingText: {
    marginTop: 12,
    color: "#7B1E3A",
    fontSize: 14,
  },
  errorTitle: {
    color: "#7B1E3A",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  errorText: {
    color: "#77716D",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#7B1E3A",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    color: "#A39A94",
    fontSize: 12,
    marginTop: 28,
  },
});
