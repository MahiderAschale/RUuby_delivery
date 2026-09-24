import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  cancelCustomerOrder,
  getCustomerOrderById,
  Order,
} from "../../../services/order.service";

const formatPrice = (value: number | string) =>
  `${Number(value).toLocaleString()} ETB`;

const formatStatus = (status?: string | null) =>
  status
    ? status
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase())
    : "Unavailable";

const formatDate = (date?: string | null) => {
  if (!date) return "—";

  return new Date(date).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const canCancel = (status: string) =>
  ["PENDING", "CONFIRMED"].includes(status);

export default function OrderDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = useCallback(async () => {
    if (!id) {
      setError("Order ID is missing.");
      return;
    }

    try {
      setError("");
      const data = await getCustomerOrderById(id);
      setOrder(data);
    } catch (err: any) {
      console.error("Load order details error:", err);
      setError(
        err?.response?.data?.message ||
          "Couldn't load order details. Please try again.",
      );
    }
  }, [id]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await loadOrder();
      setLoading(false);
    };

    load();
  }, [loadOrder]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  };

  const handleCancel = () => {
    if (!order || !canCancel(order.status)) return;

    Alert.alert(
      "Cancel order?",
      "Are you sure you want to cancel this order?",
      [
        { text: "Keep Order", style: "cancel" },
        {
          text: "Cancel Order",
          style: "destructive",
          onPress: async () => {
            try {
              setCancelling(true);
              const updatedOrder =
                await cancelCustomerOrder(order.id);

              setOrder((previous) =>
                previous
                  ? { ...previous, ...updatedOrder }
                  : updatedOrder,
              );

              Alert.alert(
                "Order cancelled",
                "Your order has been cancelled.",
              );
            } catch (err: any) {
              Alert.alert(
                "Couldn't cancel order",
                err?.response?.data?.message ||
                  "Please try again.",
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7B1E3A" />
        <Text style={styles.mutedText}>
          Loading order details...
        </Text>
      </View>
    );
  }

  if (error || !order) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Couldn't load order
        </Text>
        <Text style={styles.mutedText}>
          {error || "Order not found."}
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={loadOrder}
        >
          <Text style={styles.primaryButtonText}>
            Try Again
          </Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={styles.backText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const cancelled = order.status === "CANCELLED";
  const delivered = order.status === "DELIVERED";

  const progressSteps = [
    "CONFIRMED",
    "PREPARING",
    "READY_FOR_PICKUP",
    "PICKED_UP",
    "DELIVERED",
  ];

  const currentStep = progressSteps.indexOf(order.status);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>‹</Text>
        </Pressable>

        <Text style={styles.topBarTitle}>Order Details</Text>

        <Pressable onPress={handleRefresh}>
          <Text style={styles.refreshText}>Refresh</Text>
        </Pressable>
      </View>

      <ScrollView
  contentContainerStyle={{
    padding: 20,
    paddingBottom: 40,
  }}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={loading}
      onRefresh={loadOrder}
    />
  }
>
        {/* ORDER HEADER */}
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderTop}>
            <View style={styles.flex}>
              <Text style={styles.orderNumber}>
                Order #{order.orderNumber}
              </Text>
              <Text style={styles.dateText}>
                {formatDate(order.createdAt)}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                cancelled && styles.cancelledBadge,
                delivered && styles.deliveredBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  cancelled && styles.cancelledText,
                  delivered && styles.deliveredText,
                ]}
              >
                {formatStatus(order.status)}
              </Text>
            </View>
          </View>

          <Text style={styles.restaurantName}>
            {order.restaurant?.name || "Restaurant"}
          </Text>

          {order.restaurant?.address ? (
            <Text style={styles.restaurantAddress}>
              {order.restaurant.address}
            </Text>
          ) : null}
        </View>

        {/* ORDER PROGRESS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Order Progress
          </Text>

          {cancelled ? (
            <Text style={styles.cancelledMessage}>
              This order has been cancelled.
            </Text>
          ) : (
            progressSteps.map((step, index) => {
              const completed =
                currentStep >= index ||
                delivered;

              return (
                <View key={step} style={styles.progressRow}>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressDot,
                        completed && styles.progressDotActive,
                      ]}
                    />
                    {index < progressSteps.length - 1 && (
                      <View
                        style={[
                          styles.progressLine,
                          currentStep > index &&
                            styles.progressLineActive,
                        ]}
                      />
                    )}
                  </View>

                  <Text
                    style={[
                      styles.progressLabel,
                      completed && styles.progressLabelActive,
                    ]}
                  >
                    {formatStatus(step)}
                  </Text>
                </View>
              );
            })
          )}

          <Text style={styles.progressHint}>
            Status updates appear as your order moves forward.
          </Text>
        </View>

        {/* ITEMS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Items ({order.items?.length || 0})
          </Text>

          {order.items?.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemQuantity}>
                <Text style={styles.itemQuantityText}>
                  {item.quantity}×
                </Text>
              </View>

              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.price)} each
                </Text>
              </View>

              <Text style={styles.itemSubtotal}>
                {formatPrice(item.subtotal)}
              </Text>
            </View>
          ))}

          {!order.items?.length && (
            <Text style={styles.mutedText}>
              No item information available.
            </Text>
          )}
        </View>

        {/* PRICE BREAKDOWN */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Payment Summary
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>
              {formatPrice(order.subtotal)}
            </Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery fee</Text>
            <Text style={styles.priceValue}>
              {formatPrice(order.deliveryFee)}
            </Text>
          </View>

          {Number(order.discount) > 0 && (
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Discount</Text>
              <Text style={styles.discountValue}>
                −{formatPrice(order.discount)}
              </Text>
            </View>
          )}

          <View style={styles.totalDivider} />

          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              {formatPrice(order.total)}
            </Text>
          </View>

          <View style={styles.paymentInfo}>
            <View style={styles.flex}>
              <Text style={styles.priceLabel}>
                Payment method
              </Text>
              <Text style={styles.paymentMethod}>
                {formatStatus(order.payment?.method || "CHAPA")}
              </Text>
            </View>

            <View style={styles.paymentStatusBadge}>
              <Text style={styles.paymentStatusText}>
                {formatStatus(
                  order.paymentStatus ||
                    order.payment?.status,
                )}
              </Text>
            </View>
          </View>

          {order.payment?.paidAt && (
            <Text style={styles.paidAtText}>
              Paid on {formatDate(order.payment.paidAt)}
            </Text>
          )}
        </View>

        {/* DELIVERY ADDRESS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Delivery Address
          </Text>

          <Text style={styles.addressText}>
            {order.deliveryAddress}
          </Text>

          <Text style={styles.addressSubText}>
            {[order.deliverySubCity, order.deliveryCity]
              .filter(Boolean)
              .join(", ")}
          </Text>

          {order.notes ? (
            <View style={styles.notesBox}>
              <Text style={styles.notesLabel}>
                Order notes
              </Text>
              <Text style={styles.notesText}>
                {order.notes}
              </Text>
            </View>
          ) : null}
        </View>

        {/* DELIVERY STATUS */}
        {order.delivery && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Delivery Information
            </Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>
                Delivery status
              </Text>
              <Text style={styles.priceValue}>
                {formatStatus(order.delivery.status)}
              </Text>
            </View>

            {order.delivery.deliveredAt && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>
                  Delivered at
                </Text>
                <Text style={styles.priceValue}>
                  {formatDate(order.delivery.deliveredAt)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* CANCEL ORDER */}
        {canCancel(order.status) && (
          <Pressable
            style={[
              styles.cancelButton,
              cancelling && styles.disabledButton,
            ]}
            onPress={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? (
              <ActivityIndicator color="#7B1E3A" />
            ) : (
              <Text style={styles.cancelButtonText}>
                Cancel Order
              </Text>
            )}
          </Pressable>
        )}

        <Text style={styles.footerText}>
          Thank you for choosing RUuby!
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8F5EF",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E7E0D7",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1DCE3",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#7B1E3A",
    fontSize: 30,
    lineHeight: 32,
  },
  topBarTitle: {
    color: "#26231F",
    fontSize: 17,
    fontWeight: "700",
  },
  refreshText: {
    color: "#7B1E3A",
    fontSize: 13,
    fontWeight: "700",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  orderHeader: {
    marginBottom: 16,
  },
  orderHeaderTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  orderNumber: {
    color: "#26231F",
    fontSize: 20,
    fontWeight: "800",
  },
  dateText: {
    color: "#817D76",
    fontSize: 12,
    marginTop: 5,
  },
  restaurantName: {
    color: "#7B1E3A",
    fontSize: 17,
    fontWeight: "700",
    marginTop: 14,
  },
  restaurantAddress: {
    color: "#817D76",
    fontSize: 13,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#F1DCE3",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#7B1E3A",
    fontSize: 11,
    fontWeight: "700",
  },
  cancelledBadge: {
    backgroundColor: "#FCE8E6",
  },
  cancelledText: {
    color: "#B42318",
  },
  deliveredBadge: {
    backgroundColor: "#E2F3E8",
  },
  deliveredText: {
    color: "#287A45",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E7E0D7",
  },
  sectionTitle: {
    color: "#26231F",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 16,
  },
  progressRow: {
    flexDirection: "row",
    minHeight: 34,
  },
  progressTrack: {
    width: 20,
    alignItems: "center",
    marginRight: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#C9C2BA",
    backgroundColor: "#FFFFFF",
    zIndex: 1,
  },
  progressDotActive: {
    backgroundColor: "#7B1E3A",
    borderColor: "#7B1E3A",
  },
  progressLine: {
    position: "absolute",
    top: 11,
    bottom: -1,
    width: 2,
    backgroundColor: "#E7E0D7",
  },
  progressLineActive: {
    backgroundColor: "#7B1E3A",
  },
  progressLabel: {
    color: "#817D76",
    fontSize: 13,
    paddingBottom: 14,
  },
  progressLabelActive: {
    color: "#26231F",
    fontWeight: "700",
  },
  progressHint: {
    color: "#817D76",
    fontSize: 11,
    marginTop: 6,
  },
  cancelledMessage: {
    color: "#B42318",
    fontSize: 14,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EBE5",
    gap: 10,
  },
  itemQuantity: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#F1DCE3",
    alignItems: "center",
    justifyContent: "center",
  },
  itemQuantityText: {
    color: "#7B1E3A",
    fontSize: 12,
    fontWeight: "800",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: "#26231F",
    fontSize: 14,
    fontWeight: "700",
  },
  itemPrice: {
    color: "#817D76",
    fontSize: 11,
    marginTop: 4,
  },
  itemSubtotal: {
    color: "#26231F",
    fontSize: 13,
    fontWeight: "700",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  priceLabel: {
    color: "#817D76",
    fontSize: 13,
  },
  priceValue: {
    color: "#26231F",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  discountValue: {
    color: "#287A45",
    fontSize: 13,
    fontWeight: "600",
  },
  totalDivider: {
    height: 1,
    backgroundColor: "#E7E0D7",
    marginVertical: 4,
  },
  totalLabel: {
    color: "#26231F",
    fontSize: 15,
    fontWeight: "800",
  },
  totalValue: {
    color: "#7B1E3A",
    fontSize: 19,
    fontWeight: "800",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0EBE5",
  },
  paymentMethod: {
    color: "#26231F",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
  paymentStatusBadge: {
    backgroundColor: "#E2F3E8",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paymentStatusText: {
    color: "#287A45",
    fontSize: 11,
    fontWeight: "700",
  },
  paidAtText: {
    color: "#817D76",
    fontSize: 11,
    marginTop: 10,
  },
  addressText: {
    color: "#26231F",
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  addressSubText: {
    color: "#817D76",
    fontSize: 13,
    marginTop: 5,
  },
  notesBox: {
    marginTop: 14,
    padding: 12,
    backgroundColor: "#F8F5EF",
    borderRadius: 10,
  },
  notesLabel: {
    color: "#817D76",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 5,
  },
  notesText: {
    color: "#26231F",
    fontSize: 13,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: "#7B1E3A",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  cancelButtonText: {
    color: "#7B1E3A",
    fontSize: 14,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButton: {
    backgroundColor: "#7B1E3A",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 18,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  errorTitle: {
    color: "#26231F",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  mutedText: {
    color: "#817D76",
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  backText: {
    color: "#7B1E3A",
    fontSize: 14,
    fontWeight: "700",
  },
  footerText: {
    textAlign: "center",
    color: "#817D76",
    fontSize: 12,
    marginTop: 8,
    marginBottom: 10,
  },
});
