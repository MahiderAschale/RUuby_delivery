import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import {
  getCustomerOrders,
  Order,
} from "../../services/order.service";

const formatPrice = (price: number | string) =>
  `${Number(price).toLocaleString()} ETB`;

const formatStatus = (status?: string | null) =>
  status
    ? status.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unavailable";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function OrdersScreen() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    try {
      setError("");
      const data = await getCustomerOrders();
      setOrders(data);
    } catch (err: any) {
      console.error("Load customer orders error:", err);
      setError(
        err?.response?.data?.message ||
          "Couldn't load your orders. Please try again.",
      );
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadOrders();
      setLoading(false);
    };

    load();
  }, [loadOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <Pressable
      style={styles.orderCard}
      onPress={() =>
        router.push({
  pathname: "/(main)/order-detail/[id]",
  params: { id: item.id },
})
      }
    >
      <View style={styles.cardHeader}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName} numberOfLines={1}>
            {item.restaurant?.name || "Restaurant"}
          </Text>

          <Text style={styles.orderNumber}>
            Order #{item.orderNumber}
          </Text>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {formatStatus(item.status)}
          </Text>
        </View>
      </View>

      <Text style={styles.orderDate}>
        {formatDate(item.createdAt)}
      </Text>

      <View style={styles.divider} />

      <View style={styles.itemsRow}>
        <Text style={styles.itemsText} numberOfLines={1}>
          {item.items?.length
            ? item.items
                .map((orderItem) =>
                  `${orderItem.quantity}× ${orderItem.name}`,
                )
                .join(", ")
            : "Order items"}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.paymentLabel}>Payment</Text>
          <Text
            style={[
              styles.paymentStatus,
              item.paymentStatus === "PAID" && styles.paidText,
            ]}
          >
            {formatStatus(item.paymentStatus)}
          </Text>
        </View>

        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            {formatPrice(item.total)}
          </Text>
        </View>
      </View>

      <View style={styles.viewDetailsRow}>
        <Text style={styles.viewDetailsText}>View order details</Text>
        <Text style={styles.arrow}>›</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7B1E3A" />
        <Text style={styles.loadingText}>Loading your orders...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>
          Keep track of your delicious moments.
        </Text>
      </View>

      {error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorText}>{error}</Text>

          <Pressable style={styles.retryButton} onPress={onRefresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrder}
          contentContainerStyle={[
            styles.listContent,
            orders.length === 0 && styles.emptyList,
          ]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#7B1E3A"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>
                Your orders will appear here when you place one.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8F5EF",
  },
  loadingText: {
    marginTop: 12,
    color: "#817D76",
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 18,
  },
  title: {
    color: "#26231F",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#817D76",
    fontSize: 14,
    marginTop: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7E0D7",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    color: "#26231F",
    fontSize: 17,
    fontWeight: "700",
  },
  orderNumber: {
    color: "#817D76",
    fontSize: 12,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#F1DCE3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#7B1E3A",
    fontSize: 11,
    fontWeight: "700",
  },
  orderDate: {
    color: "#817D76",
    fontSize: 12,
    marginTop: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E7E0D7",
    marginVertical: 14,
  },
  itemsRow: {
    marginBottom: 14,
  },
  itemsText: {
    color: "#26231F",
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  paymentLabel: {
    color: "#817D76",
    fontSize: 12,
  },
  paymentStatus: {
    color: "#26231F",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 4,
  },
  paidText: {
    color: "#287A45",
  },
  totalContainer: {
    alignItems: "flex-end",
  },
  totalLabel: {
    color: "#817D76",
    fontSize: 12,
  },
  totalPrice: {
    color: "#7B1E3A",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 4,
  },
  viewDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E7E0D7",
    marginTop: 14,
    paddingTop: 12,
  },
  viewDetailsText: {
    color: "#7B1E3A",
    fontSize: 13,
    fontWeight: "700",
  },
  arrow: {
    color: "#7B1E3A",
    fontSize: 24,
    lineHeight: 24,
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  emptyTitle: {
    color: "#26231F",
    fontSize: 19,
    fontWeight: "700",
  },
  emptyText: {
    color: "#817D76",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: "#7B1E3A",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#7B1E3A",
    borderRadius: 10,
    paddingHorizontal: 22,
    paddingVertical: 11,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
