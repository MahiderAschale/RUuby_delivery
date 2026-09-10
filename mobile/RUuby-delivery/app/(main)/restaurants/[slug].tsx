import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  getRestaurantBySlug,
  type RestaurantDetail,
} from "../../../services/restaurant.service";

const COLORS = {
  background: "#F8F5EF",
  foreground: "#26231F",
  muted: "#817D76",
  primary: "#7B1E3A",
  primarySoft: "#F1DCE3",
  border: "#E7E0D7",
  white: "#FFFFFF",
};

export default function RestaurantDetailsScreen() {
  const { slug } = useLocalSearchParams<{
    slug: string;
  }>();

  const [restaurant, setRestaurant] =
    useState<RestaurantDetail | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Restaurant not found.");
      setLoading(false);
      return;
    }

    const loadRestaurant = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getRestaurantBySlug(slug);

        setRestaurant(data);
      } catch (error: any) {
        console.error(
          "Restaurant details error:",
          error,
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load restaurant.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRestaurant();
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading restaurant...
        </Text>
      </View>
    );
  }

  if (error || !restaurant) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons
          name="restaurant-outline"
          size={48}
          color={COLORS.primary}
        />

        <Text style={styles.errorTitle}>
          Restaurant unavailable
        </Text>

        <Text style={styles.errorText}>
          {error || "Restaurant not found."}
        </Text>

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable
            style={styles.iconButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={COLORS.foreground}
            />
          </Pressable>

          <Text
            style={styles.headerTitle}
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>

          <View style={styles.iconButton} />
        </View>

        {/* RESTAURANT INFO */}

        <View style={styles.restaurantCard}>
          <View style={styles.restaurantIcon}>
            <Ionicons
              name="restaurant"
              size={32}
              color={COLORS.primary}
            />
          </View>

          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>
              {restaurant.name}
            </Text>

            {restaurant.description ? (
              <Text style={styles.description}>
                {restaurant.description}
              </Text>
            ) : null}

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={COLORS.muted}
              />

              <Text style={styles.locationText}>
                {restaurant.address}
                {restaurant.subCity
                  ? `, ${restaurant.subCity}`
                  : ""}
                {restaurant.city
                  ? `, ${restaurant.city}`
                  : ""}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  {
                    backgroundColor:
                      restaurant.isOpen
                        ? "#3A8D5D"
                        : "#A9A39B",
                  },
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  {
                    color: restaurant.isOpen
                      ? "#3A8D5D"
                      : COLORS.muted,
                  },
                ]}
              >
                {restaurant.isOpen
                  ? "Open"
                  : "Closed"}
              </Text>
            </View>
          </View>
        </View>

        {/* MENU */}

        <View style={styles.menuHeader}>
          <Text style={styles.menuTitle}>
            Menu
          </Text>

          <Text style={styles.menuCount}>
            {restaurant.categories.reduce(
              (total, category) =>
                total + category.items.length,
              0,
            )}{" "}
            items
          </Text>
        </View>

        {restaurant.categories.length === 0 ? (
          <View style={styles.emptyMenu}>
            <Ionicons
              name="fast-food-outline"
              size={40}
              color={COLORS.muted}
            />

            <Text style={styles.emptyTitle}>
              No menu available
            </Text>

            <Text style={styles.emptyText}>
              This restaurant hasn't added any
              available menu items yet.
            </Text>
          </View>
        ) : (
          restaurant.categories.map(
            (category) => (
              <View
                key={category.id}
                style={styles.category}
              >
                <Text style={styles.categoryTitle}>
                  {category.name}
                </Text>

                {category.description ? (
                  <Text
                    style={
                      styles.categoryDescription
                    }
                  >
                    {category.description}
                  </Text>
                ) : null}

                {category.items.map(
                  (item) => (
                    <View
                      key={item.id}
                      style={styles.menuItem}
                    >
                      <View
                        style={
                          styles.menuItemInfo
                        }
                      >
                        <Text
                          style={
                            styles.menuItemName
                          }
                        >
                          {item.name}
                        </Text>

                        {item.description ? (
                          <Text
                            style={
                              styles.menuItemDescription
                            }
                            numberOfLines={2}
                          >
                            {item.description}
                          </Text>
                        ) : null}

                        <Text
                          style={
                            styles.menuItemPrice
                          }
                        >
                          ETB{" "}
                          {Number(
                            item.price,
                          ).toFixed(2)}
                        </Text>
                      </View>

                      <Pressable
                        style={[
                          styles.addButton,
                          !restaurant.isOpen &&
                            styles.disabledButton,
                        ]}
                        disabled={
                          !restaurant.isOpen
                        }
                        onPress={() => {
                          console.log(
                            "Add to cart:",
                            item.id,
                          );
                        }}
                      >
                        <Ionicons
                          name="add"
                          size={22}
                          color={COLORS.white}
                        />
                      </Pressable>
                    </View>
                  ),
                )}
              </View>
            ),
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
    fontSize: 15,
  },

  errorTitle: {
    marginTop: 16,
    color: COLORS.foreground,
    fontSize: 20,
    fontWeight: "800",
  },

  errorText: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 14,
    textAlign: "center",
  },

  backButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },

  backButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  headerTitle: {
    flex: 1,
    marginHorizontal: 12,
    textAlign: "center",
    color: COLORS.foreground,
    fontSize: 18,
    fontWeight: "800",
  },

  restaurantCard: {
    marginHorizontal: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
  },

  restaurantIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },

  restaurantInfo: {
    flex: 1,
    marginLeft: 14,
  },

  restaurantName: {
    color: COLORS.foreground,
    fontSize: 20,
    fontWeight: "800",
  },

  description: {
    marginTop: 4,
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 10,
  },

  locationText: {
    flex: 1,
    marginLeft: 5,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "700",
  },

  menuHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 18,
    marginTop: 28,
    marginBottom: 14,
  },

  menuTitle: {
    color: COLORS.foreground,
    fontSize: 24,
    fontWeight: "800",
  },

  menuCount: {
    color: COLORS.muted,
    fontSize: 13,
  },

  category: {
    marginHorizontal: 18,
    marginBottom: 24,
  },

  categoryTitle: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },

  categoryDescription: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 10,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },

  menuItemInfo: {
    flex: 1,
    paddingRight: 12,
  },

  menuItemName: {
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: "800",
  },

  menuItemDescription: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 17,
  },

  menuItemPrice: {
    marginTop: 8,
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "800",
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  disabledButton: {
    opacity: 0.4,
  },

  emptyMenu: {
    marginHorizontal: 18,
    padding: 32,
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyTitle: {
    marginTop: 12,
    color: COLORS.foreground,
    fontSize: 17,
    fontWeight: "800",
  },

  emptyText: {
    marginTop: 6,
    color: COLORS.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});