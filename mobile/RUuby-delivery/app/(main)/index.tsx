import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  getRestaurants,
  type Restaurant,
} from "../../services/restaurant.service";

const COLORS = {
  background: "#F8F5EF",
  foreground: "#26231F",
  muted: "#817D76",
  primary: "#7B1E3A",
  primarySoft: "#F1DCE3",
  border: "#E7E0D7",
  white: "#FFFFFF",
};

const categories = [
  {
    name: "All",
    icon: "restaurant-outline" as const,
  },
  {
    name: "Pizza",
    icon: "pizza-outline" as const,
  },
  {
    name: "Burger",
    icon: "fast-food-outline" as const,
  },
  {
    name: "Chicken",
    icon: "flame-outline" as const,
  },
  {
    name: "Coffee",
    icon: "cafe-outline" as const,
  },
];

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<
    Restaurant[]
  >([]);

  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);

  const [restaurantError, setRestaurantError] =
    useState<string | null>(null);

  const [searchText, setSearchText] = useState("");

  // ========================================
  // LOAD RESTAURANTS
  // ========================================

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      setLoadingRestaurants(true);
      setRestaurantError(null);

      const data = await getRestaurants();

      setRestaurants(data);
    } catch (error: any) {
      console.error(
        "Failed to load restaurants:",
        error,
      );

      setRestaurantError(
        error?.response?.data?.message ||
          "Failed to load restaurants.",
      );
    } finally {
      setLoadingRestaurants(false);
    }
  };

  // ========================================
  // SEARCH
  // ========================================

  const filteredRestaurants = restaurants.filter(
    (restaurant) => {
      const search = searchText
        .trim()
        .toLowerCase();

      if (!search) {
        return true;
      }

      return (
        restaurant.name
          .toLowerCase()
          .includes(search) ||
        restaurant.description
          ?.toLowerCase()
          .includes(search) ||
        restaurant.city
          .toLowerCase()
          .includes(search) ||
        restaurant.subCity
          ?.toLowerCase()
          .includes(search)
      );
    },
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ========================================
            HEADER
        ======================================== */}

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good afternoon
            </Text>

            <Text style={styles.userName}>
              What are you craving?
            </Text>
          </View>

          <Pressable
            style={styles.notificationButton}
          >
            <Ionicons
              name="notifications-outline"
              size={21}
              color={COLORS.foreground}
            />

            <View
              style={styles.notificationDot}
            />
          </Pressable>
        </View>

        {/* ========================================
            LOCATION
        ======================================== */}

        <Pressable style={styles.locationRow}>
          <View style={styles.locationIcon}>
            <Ionicons
              name="location"
              size={16}
              color={COLORS.primary}
            />
          </View>

          <View
            style={styles.locationTextContainer}
          >
            <Text style={styles.locationLabel}>
              DELIVER TO
            </Text>

            <View style={styles.addressRow}>
              <Text style={styles.address}>
                Addis Ababa
              </Text>

              <Ionicons
                name="chevron-down"
                size={14}
                color={COLORS.foreground}
              />
            </View>
          </View>
        </Pressable>

        {/* ========================================
            SEARCH
        ======================================== */}

        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color={COLORS.muted}
          />

          <TextInput
            placeholder="Search restaurants or food"
            placeholderTextColor="#A19B92"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />

          <Pressable style={styles.filterButton}>
            <Ionicons
              name="options-outline"
              size={19}
              color={COLORS.white}
            />
          </Pressable>
        </View>

        {/* ========================================
            PROMO
        ======================================== */}

        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoSmall}>
              WELCOME TO RUUBY
            </Text>

            <Text style={styles.promoTitle}>
              Delicious food,
              {"\n"}
              delivered fast.
            </Text>

            <Pressable
              style={styles.promoButton}
              onPress={() => {
                // Restaurant list is already below.
                // This button can later navigate
                // to the full restaurant/search page.
              }}
            >
              <Text style={styles.promoButtonText}>
                Order now
              </Text>

              <Ionicons
                name="arrow-forward"
                size={15}
                color={COLORS.white}
              />
            </Pressable>
          </View>

          <View style={styles.promoIcon}>
            <Ionicons
              name="fast-food"
              size={58}
              color={COLORS.white}
            />
          </View>
        </View>

        {/* ========================================
            CATEGORIES
        ======================================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Categories
          </Text>

          <Pressable>
            <Text style={styles.seeAll}>
              See all
            </Text>
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.categoryList
          }
        >
          {categories.map(
            (category, index) => (
              <Pressable
                key={category.name}
                style={[
                  styles.category,
                  index === 0 &&
                    styles.categoryActive,
                ]}
              >
                <View
                  style={[
                    styles.categoryIcon,
                    index === 0 &&
                      styles.categoryIconActive,
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={21}
                    color={
                      index === 0
                        ? COLORS.white
                        : COLORS.primary
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.categoryText,
                    index === 0 &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </Pressable>
            ),
          )}
        </ScrollView>

        {/* ========================================
            RESTAURANTS
        ======================================== */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Popular near you
          </Text>

          <Pressable
            onPress={() =>
              router.push("/search")
            }
          >
            <Text style={styles.seeAll}>
              See all
            </Text>
          </Pressable>
        </View>

        {/* LOADING */}

        {loadingRestaurants && (
          <View
            style={styles.restaurantState}
          >
            <ActivityIndicator
              size="small"
              color={COLORS.primary}
            />

            <Text style={styles.stateText}>
              Loading restaurants...
            </Text>
          </View>
        )}

        {/* ERROR */}

        {!loadingRestaurants &&
          restaurantError && (
            <View
              style={styles.restaurantState}
            >
              <Ionicons
                name="cloud-offline-outline"
                size={30}
                color={COLORS.muted}
              />

              <Text style={styles.stateText}>
                {restaurantError}
              </Text>

              <Pressable
                style={styles.retryButton}
                onPress={loadRestaurants}
              >
                <Text
                  style={styles.retryButtonText}
                >
                  Try again
                </Text>
              </Pressable>
            </View>
          )}

        {/* EMPTY */}

        {!loadingRestaurants &&
          !restaurantError &&
          filteredRestaurants.length === 0 && (
            <View
              style={styles.restaurantState}
            >
              <Ionicons
                name="restaurant-outline"
                size={30}
                color={COLORS.muted}
              />

              <Text style={styles.stateText}>
                {searchText
                  ? "No restaurants match your search."
                  : "No restaurants available yet."}
              </Text>
            </View>
          )}

        {/* RESTAURANT LIST */}

        {!loadingRestaurants &&
          !restaurantError &&
          filteredRestaurants.length > 0 && (
            <View style={styles.restaurantList}>
              {filteredRestaurants.map(
                (restaurant) => (
                  <Pressable
                    key={restaurant.id}
                    style={
                      styles.restaurantCard
                    }
                    onPress={() =>
                      router.push(
                        `/restaurants/${restaurant.slug}`,
                      )
                    }
                  >
                    {/* RESTAURANT IMAGE */}

                    <View
                      style={
                        styles.restaurantImage
                      }
                    >
                      {restaurant.coverImageUrl ? (
                        <View
                          style={
                            styles.imagePlaceholder
                          }
                        >
                          <Ionicons
                            name="image-outline"
                            size={42}
                            color={
                              COLORS.primary
                            }
                          />
                        </View>
                      ) : (
                        <Ionicons
                          name="restaurant-outline"
                          size={42}
                          color={
                            COLORS.primary
                          }
                        />
                      )}

                      {/* FAVORITE */}

                      <View
                        style={
                          styles.favoriteButton
                        }
                      >
                        <Ionicons
                          name="heart-outline"
                          size={17}
                          color={
                            COLORS.primary
                          }
                        />
                      </View>
                    </View>

                    {/* RESTAURANT INFO */}

                    <View
                      style={
                        styles.restaurantInfo
                      }
                    >
                      <View
                        style={
                          styles.restaurantNameRow
                        }
                      >
                        <Text
                          style={
                            styles.restaurantName
                          }
                          numberOfLines={1}
                        >
                          {restaurant.name}
                        </Text>

                        <View
                          style={[
                            styles.statusBadge,
                            restaurant.isOpen
                              ? styles.statusOpen
                              : styles.statusClosed,
                          ]}
                        >
                          <Text
                            style={
                              styles.statusText
                            }
                          >
                            {restaurant.isOpen
                              ? "Open"
                              : "Closed"}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={styles.cuisine}
                        numberOfLines={2}
                      >
                        {restaurant.description ||
                          restaurant.address}
                      </Text>

                      <View
                        style={
                          styles.restaurantMeta
                        }
                      >
                        <View
                          style={styles.metaItem}
                        >
                          <Ionicons
                            name="location-outline"
                            size={14}
                            color={
                              COLORS.muted
                            }
                          />

                          <Text
                            style={
                              styles.metaText
                            }
                            numberOfLines={1}
                          >
                            {restaurant.subCity
                              ? `${restaurant.subCity}, ${restaurant.city}`
                              : restaurant.city}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </Pressable>
                ),
              )}
            </View>
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

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  greeting: {
    color: COLORS.muted,
    fontSize: 12,
    marginBottom: 4,
  },

  userName: {
    color: COLORS.foreground,
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 22,
  },

  locationIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },

  locationTextContainer: {
    marginLeft: 10,
  },

  locationLabel: {
    color: COLORS.muted,
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },

  address: {
    color: COLORS.foreground,
    fontSize: 13,
    fontWeight: "700",
  },

  searchContainer: {
    height: 52,
    marginTop: 18,
    paddingLeft: 15,
    paddingRight: 6,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    marginLeft: 9,
    color: COLORS.foreground,
    fontSize: 13,
  },

  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
  },

  promoCard: {
    minHeight: 175,
    marginTop: 20,
    padding: 22,
    borderRadius: 22,
    overflow: "hidden",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
  },

  promoContent: {
    flex: 1,
  },

  promoSmall: {
    color: "#EFCBD6",
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  promoTitle: {
    marginTop: 8,
    color: COLORS.white,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  promoButton: {
    height: 36,
    marginTop: 15,
    paddingHorizontal: 13,
    borderRadius: 11,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#64162F",
  },

  promoButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },

  promoIcon: {
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.9,
  },

  sectionHeader: {
    marginTop: 26,
    marginBottom: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    color: COLORS.foreground,
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  seeAll: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: "800",
  },

  categoryList: {
    gap: 12,
    paddingRight: 10,
  },

  category: {
    width: 72,
    alignItems: "center",
  },

  categoryActive: {
    opacity: 1,
  },

  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryIconActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    marginTop: 7,
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  categoryTextActive: {
    color: COLORS.primary,
  },

  restaurantList: {
    gap: 14,
  },

  restaurantCard: {
    overflow: "hidden",
    borderRadius: 19,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  restaurantImage: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primarySoft,
  },

  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },

  restaurantInfo: {
    padding: 15,
  },

  restaurantNameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  restaurantName: {
    flex: 1,
    color: COLORS.foreground,
    fontSize: 16,
    fontWeight: "800",
  },

  statusBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusOpen: {
    backgroundColor: COLORS.primarySoft,
  },

  statusClosed: {
    backgroundColor: COLORS.border,
  },

  statusText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: "800",
  },

  cuisine: {
    marginTop: 5,
    color: COLORS.muted,
    fontSize: 11,
  },

  restaurantMeta: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
  },

  metaText: {
    color: COLORS.muted,
    fontSize: 10,
    flexShrink: 1,
  },

  restaurantState: {
    minHeight: 140,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  stateText: {
    marginTop: 10,
    color: COLORS.muted,
    fontSize: 12,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  retryButtonText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },
});