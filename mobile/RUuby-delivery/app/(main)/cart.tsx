import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCallback, useEffect, useState } from "react";

import {
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
  type Cart,
  type CartItem,
} from "../../services/cart.service";

export default function CartScreen() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingItemId, setUpdatingItemId] =
    useState<string | null>(null);

  const loadCart = useCallback(async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (error: any) {
      console.error("Load cart error:", error);

      Alert.alert(
        "Cart",
        error?.response?.data?.message ||
          "Failed to load your cart.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCart();
  };

  const handleIncrease = async (item: CartItem) => {
    if (item.quantity >= 20) {
      Alert.alert(
        "Maximum quantity",
        "You can add a maximum of 20 of this item.",
      );
      return;
    }

    try {
      setUpdatingItemId(item.id);

      await updateCartItem(
        item.id,
        item.quantity + 1,
      );

      await loadCart();
    } catch (error: any) {
      console.error(
        "Increase cart item error:",
        error,
      );

      Alert.alert(
        "Cart",
        error?.response?.data?.message ||
          "Failed to update item quantity.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleDecrease = async (item: CartItem) => {
    if (item.quantity <= 1) {
      await handleRemove(item);
      return;
    }

    try {
      setUpdatingItemId(item.id);

      await updateCartItem(
        item.id,
        item.quantity - 1,
      );

      await loadCart();
    } catch (error: any) {
      console.error(
        "Decrease cart item error:",
        error,
      );

      Alert.alert(
        "Cart",
        error?.response?.data?.message ||
          "Failed to update item quantity.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (item: CartItem) => {
    try {
      setUpdatingItemId(item.id);

      await removeCartItem(item.id);

      await loadCart();
    } catch (error: any) {
      console.error(
        "Remove cart item error:",
        error,
      );

      Alert.alert(
        "Cart",
        error?.response?.data?.message ||
          "Failed to remove item.",
      );
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      "Clear cart",
      "Are you sure you want to remove all items from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true);

              await clearCart();

              setCart(null);
            } catch (error: any) {
              console.error(
                "Clear cart error:",
                error,
              );

              Alert.alert(
                "Cart",
                error?.response?.data?.message ||
                  "Failed to clear cart.",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const formatPrice = (
    price: number | string,
  ) => {
    return Number(price).toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator
          size="large"
          color="#7B1E3A"
        />

        <Text style={styles.loadingText}>
          Loading your cart...
        </Text>
      </View>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyIcon}>
          <Text style={styles.emptyIconText}>
            +
          </Text>
        </View>

        <Text style={styles.emptyTitle}>
          Your cart is empty
        </Text>

        <Text style={styles.emptyText}>
          Add delicious meals from a restaurant
          to get started.
        </Text>

        <TouchableOpacity
          style={styles.browseButton}
          onPress={loadCart}
        >
          <Text style={styles.browseButtonText}>
            Browse Restaurants
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#7B1E3A"
          />
        }
        contentContainerStyle={
          styles.scrollContent
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Your Cart
            </Text>

            <Text style={styles.itemCount}>
              {cart.items.length}{" "}
              {cart.items.length === 1
                ? "item"
                : "items"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleClearCart}
          >
            <Text style={styles.clearText}>
              Clear
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.restaurantCard}>
          <Text style={styles.restaurantLabel}>
            ORDERING FROM
          </Text>

          <Text style={styles.restaurantName}>
            {cart.restaurant.name}
          </Text>

          <Text
            style={[
              styles.restaurantStatus,
              {
                color: cart.restaurant.isOpen
                  ? "#2E7D32"
                  : "#B3261E",
              },
            ]}
          >
            {cart.restaurant.isOpen
              ? "Open"
              : "Currently closed"}
          </Text>
        </View>

        <View style={styles.itemsContainer}>
          {cart.items.map((item) => {
            const isUpdating =
              updatingItemId === item.id;

            const price =
              Number(item.menuItem.price);

            const itemTotal =
              price * item.quantity;

            return (
              <View
                key={item.id}
                style={styles.itemCard}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>
                    {item.menuItem.name}
                  </Text>

                  {item.menuItem.description ? (
                    <Text
                      style={styles.itemDescription}
                      numberOfLines={2}
                    >
                      {item.menuItem.description}
                    </Text>
                  ) : null}

                  <Text style={styles.itemPrice}>
                    {formatPrice(price)} ETB
                  </Text>
                </View>

                <View style={styles.itemRight}>
                  <Text style={styles.itemTotal}>
                    {formatPrice(itemTotal)} ETB
                  </Text>

                  <View
                    style={styles.quantityRow}
                  >
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleDecrease(item)
                      }
                      disabled={isUpdating}
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        −
                      </Text>
                    </TouchableOpacity>

                    <View
                      style={styles.quantityBox}
                    >
                      {isUpdating ? (
                        <ActivityIndicator
                          size="small"
                          color="#7B1E3A"
                        />
                      ) : (
                        <Text
                          style={
                            styles.quantityText
                          }
                        >
                          {item.quantity}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() =>
                        handleIncrease(item)
                      }
                      disabled={
                        isUpdating ||
                        item.quantity >= 20
                      }
                    >
                      <Text
                        style={
                          styles.quantityButtonText
                        }
                      >
                        +
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      handleRemove(item)
                    }
                    disabled={isUpdating}
                  >
                    <Text style={styles.removeText}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Order Summary
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Subtotal
            </Text>

            <Text style={styles.summaryValue}>
              {formatPrice(cart.subtotal)} ETB
            </Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Total
            </Text>

            <Text style={styles.totalValue}>
              {formatPrice(cart.subtotal)} ETB
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            Alert.alert(
              "Checkout",
              "Checkout will be connected next.",
            )
          }
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F5EF",
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    color: "#817D76",
    fontSize: 15,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  title: {
    color: "#26231F",
    fontSize: 30,
    fontWeight: "800",
  },

  itemCount: {
    marginTop: 4,
    color: "#817D76",
    fontSize: 14,
  },

  clearText: {
    color: "#7B1E3A",
    fontSize: 14,
    fontWeight: "700",
  },

  restaurantCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E7E0D7",
  },

  restaurantLabel: {
    color: "#817D76",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 6,
  },

  restaurantName: {
    color: "#26231F",
    fontSize: 20,
    fontWeight: "800",
  },

  restaurantStatus: {
    marginTop: 5,
    fontSize: 13,
    fontWeight: "600",
  },

  itemsContainer: {
    gap: 12,
  },

  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7E0D7",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },

  itemName: {
    color: "#26231F",
    fontSize: 17,
    fontWeight: "800",
  },

  itemDescription: {
    color: "#817D76",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 5,
  },

  itemPrice: {
    color: "#7B1E3A",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 10,
  },

  itemRight: {
    alignItems: "flex-end",
  },

  itemTotal: {
    color: "#26231F",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 9,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#F1DCE3",
    alignItems: "center",
    justifyContent: "center",
  },

  quantityButtonText: {
    color: "#7B1E3A",
    fontSize: 21,
    fontWeight: "700",
    lineHeight: 22,
  },

  quantityBox: {
    width: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  quantityText: {
    color: "#26231F",
    fontSize: 15,
    fontWeight: "800",
  },

  removeText: {
    color: "#817D76",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#E7E0D7",
  },

  summaryTitle: {
    color: "#26231F",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    color: "#817D76",
    fontSize: 14,
  },

  summaryValue: {
    color: "#26231F",
    fontSize: 14,
    fontWeight: "700",
  },

  summaryDivider: {
    height: 1,
    backgroundColor: "#E7E0D7",
    marginVertical: 16,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  totalLabel: {
    color: "#26231F",
    fontSize: 18,
    fontWeight: "800",
  },

  totalValue: {
    color: "#7B1E3A",
    fontSize: 20,
    fontWeight: "800",
  },

  checkoutButton: {
    backgroundColor: "#7B1E3A",
    borderRadius: 15,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },

  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F1DCE3",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  emptyIconText: {
    color: "#7B1E3A",
    fontSize: 38,
    fontWeight: "300",
  },

  emptyTitle: {
    color: "#26231F",
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },

  emptyText: {
    color: "#817D76",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },

  browseButton: {
    backgroundColor: "#7B1E3A",
    borderRadius: 14,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 22,
  },

  browseButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
