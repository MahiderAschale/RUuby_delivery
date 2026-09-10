import {
    ActivityIndicator,
    Alert,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from "react-native";
  import { useCallback, useEffect, useState } from "react";
  import { router } from "expo-router";
  
  import {
    getAddresses,
    createAddress,
    type Address,
  } from "../../services/address.service";
  
  import {
    previewCheckout,
    type Checkout,
  } from "../../services/checkout.service";
  
  export default function CheckoutScreen() {
    const [addresses, setAddresses] = useState<Address[]>(
      [],
    );
  
    const [selectedAddressId, setSelectedAddressId] =
      useState<string | null>(null);
  
    const [checkout, setCheckout] =
      useState<Checkout | null>(null);
  
    const [loading, setLoading] =
      useState(true);
  
    const [loadingPreview, setLoadingPreview] =
      useState(false);
  
    const [refreshing, setRefreshing] =
      useState(false);
  
    const [showAddressModal, setShowAddressModal] =
      useState(false);
  
    const [savingAddress, setSavingAddress] =
      useState(false);
  
    const [label, setLabel] =
      useState("");
  
    const [addressText, setAddressText] =
      useState("");
  
    const [city, setCity] =
      useState("");
  
    const [subCity, setSubCity] =
      useState("");
  
    const [phone, setPhone] =
      useState("");
  
    const [latitude, setLatitude] =
      useState("");
  
    const [longitude, setLongitude] =
      useState("");
  
    const formatPrice = (
      price: number | string,
    ) => {
      return Number(price).toLocaleString();
    };
  
    const loadAddresses = useCallback(
      async () => {
        try {
          const data = await getAddresses();
  
          setAddresses(data);
  
          if (data.length > 0) {
            const defaultAddress =
              data.find(
                (item) => item.isDefault,
              ) ?? data[0];
  
            setSelectedAddressId(
              defaultAddress.id,
            );
          }
        } catch (error: any) {
          console.error(
            "Load addresses error:",
            error,
          );
  
          Alert.alert(
            "Checkout",
            error?.response?.data?.message ||
              "Failed to load your addresses.",
          );
        }
      },
      [],
    );
  
    const loadCheckout = useCallback(
      async (addressId: string) => {
        try {
          setLoadingPreview(true);
  
          const data =
            await previewCheckout(addressId);
  
          setCheckout(data);
        } catch (error: any) {
          console.error(
            "Checkout preview error:",
            error,
          );
  
          setCheckout(null);
  
          Alert.alert(
            "Checkout",
            error?.response?.data?.message ||
              "Failed to prepare your checkout.",
          );
        } finally {
          setLoadingPreview(false);
        }
      },
      [],
    );
  
    const loadData = useCallback(
      async () => {
        try {
          setLoading(true);
  
          await loadAddresses();
        } finally {
          setLoading(false);
        }
      },
      [loadAddresses],
    );
  
    useEffect(() => {
      loadData();
    }, [loadData]);
  
    useEffect(() => {
      if (selectedAddressId) {
        loadCheckout(selectedAddressId);
      }
    }, [
      selectedAddressId,
      loadCheckout,
    ]);
  
    const handleRefresh = async () => {
      setRefreshing(true);
  
      try {
        const data = await getAddresses();
  
        setAddresses(data);
  
        if (data.length > 0) {
          const current =
            data.find(
              (item) =>
                item.id ===
                selectedAddressId,
            );
  
          if (!current) {
            const defaultAddress =
              data.find(
                (item) => item.isDefault,
              ) ?? data[0];
  
            setSelectedAddressId(
              defaultAddress.id,
            );
          }
        }
      } catch (error: any) {
        Alert.alert(
          "Checkout",
          error?.response?.data?.message ||
            "Failed to refresh addresses.",
        );
      } finally {
        setRefreshing(false);
      }
    };
  
    const resetAddressForm = () => {
      setLabel("");
      setAddressText("");
      setCity("");
      setSubCity("");
      setPhone("");
      setLatitude("");
      setLongitude("");
    };
  
    const handleAddAddress = async () => {
      if (!label.trim()) {
        Alert.alert(
          "Address",
          "Please enter an address label.",
        );
        return;
      }
  
      if (!addressText.trim()) {
        Alert.alert(
          "Address",
          "Please enter your delivery address.",
        );
        return;
      }
  
      if (!city.trim()) {
        Alert.alert(
          "Address",
          "Please enter your city.",
        );
        return;
      }
  
      if (!latitude.trim() || !longitude.trim()) {
        Alert.alert(
          "Address",
          "Please enter your location coordinates.",
        );
        return;
      }
  
      const latitudeNumber =
        Number(latitude);
  
      const longitudeNumber =
        Number(longitude);
  
      if (
        !Number.isFinite(latitudeNumber) ||
        !Number.isFinite(longitudeNumber)
      ) {
        Alert.alert(
          "Address",
          "Latitude and longitude must be valid numbers.",
        );
        return;
      }
  
      try {
        setSavingAddress(true);
  
        const newAddress =
          await createAddress({
            label: label.trim(),
            address: addressText.trim(),
            city: city.trim(),
            subCity:
              subCity.trim() || undefined,
            phone:
              phone.trim() || undefined,
            latitude: latitudeNumber,
            longitude: longitudeNumber,
          });
  
        setAddresses((current) => [
          newAddress,
          ...current,
        ]);
  
        setSelectedAddressId(
          newAddress.id,
        );
  
        setShowAddressModal(false);
  
        resetAddressForm();
      } catch (error: any) {
        console.error(
          "Create address error:",
          error,
        );
  
        Alert.alert(
          "Address",
          error?.response?.data?.message ||
            "Failed to create address.",
        );
      } finally {
        setSavingAddress(false);
      }
    };
  
    const selectedAddress =
      addresses.find(
        (item) =>
          item.id ===
          selectedAddressId,
      );
  
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator
            size="large"
            color="#7B1E3A"
          />
  
          <Text style={styles.loadingText}>
            Preparing checkout...
          </Text>
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
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>
                ‹
              </Text>
            </TouchableOpacity>
  
            <View style={styles.headerText}>
              <Text style={styles.title}>
                Checkout
              </Text>
  
              <Text style={styles.subtitle}>
                Review your order before payment
              </Text>
            </View>
          </View>
  
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Delivery Address
                </Text>
  
                <Text style={styles.sectionSubtitle}>
                  Where should we deliver?
                </Text>
              </View>
  
              <TouchableOpacity
                onPress={() =>
                  setShowAddressModal(true)
                }
              >
                <Text style={styles.addText}>
                  + Add
                </Text>
              </TouchableOpacity>
            </View>
  
            {addresses.length === 0 ? (
              <View style={styles.emptyAddressCard}>
                <Text
                  style={styles.emptyAddressTitle}
                >
                  No delivery address
                </Text>
  
                <Text
                  style={styles.emptyAddressText}
                >
                  Add an address to continue
                  with your order.
                </Text>
  
                <TouchableOpacity
                  style={styles.addAddressButton}
                  onPress={() =>
                    setShowAddressModal(true)
                  }
                >
                  <Text
                    style={
                      styles.addAddressButtonText
                    }
                  >
                    Add Delivery Address
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.addressList}>
                {addresses.map((item) => {
                  const selected =
                    item.id ===
                    selectedAddressId;
  
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.addressCard,
                        selected &&
                          styles.addressCardSelected,
                      ]}
                      onPress={() =>
                        setSelectedAddressId(
                          item.id,
                        )
                      }
                    >
                      <View
                        style={
                          styles.addressTopRow
                        }
                      >
                        <Text
                          style={
                            styles.addressLabel
                          }
                        >
                          {item.label}
                        </Text>
  
                        {item.isDefault ? (
                          <Text
                            style={
                              styles.defaultText
                            }
                          >
                            DEFAULT
                          </Text>
                        ) : null}
                      </View>
  
                      <Text
                        style={
                          styles.addressText
                        }
                      >
                        {item.address}
                      </Text>
  
                      <Text
                        style={
                          styles.addressLocation
                        }
                      >
                        {item.subCity
                          ? `${item.subCity}, `
                          : ""}
                        {item.city}
                      </Text>
  
                      {item.phone ? (
                        <Text
                          style={
                            styles.addressPhone
                          }
                        >
                          {item.phone}
                        </Text>
                      ) : null}
  
                      <View
                        style={[
                          styles.radio,
                          selected &&
                            styles.radioSelected,
                        ]}
                      >
                        {selected ? (
                          <View
                            style={
                              styles.radioInner
                            }
                          />
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
  
          {selectedAddressId &&
          loadingPreview ? (
            <View
              style={styles.previewLoading}
            >
              <ActivityIndicator
                size="small"
                color="#7B1E3A"
              />
  
              <Text
                style={
                  styles.previewLoadingText
                }
              >
                Recalculating order...
              </Text>
            </View>
          ) : null}
  
          {checkout ? (
            <>
              <View style={styles.restaurantCard}>
                <Text
                  style={styles.restaurantLabel}
                >
                  ORDERING FROM
                </Text>
  
                <Text
                  style={styles.restaurantName}
                >
                  {checkout.restaurant.name}
                </Text>
  
                <Text
                  style={styles.restaurantStatus}
                >
                  {checkout.restaurant.isOpen
                    ? "Open"
                    : "Currently closed"}
                </Text>
              </View>
  
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Your Items
                </Text>
  
                <View
                  style={styles.itemsContainer}
                >
                  {checkout.items.map(
                    (item) => (
                      <View
                        key={item.id}
                        style={styles.itemRow}
                      >
                        <View
                          style={styles.itemInfo}
                        >
                          <Text
                            style={
                              styles.itemName
                            }
                          >
                            {item.name}
                          </Text>
  
                          <Text
                            style={
                              styles.itemQuantity
                            }
                          >
                            {item.quantity} ×{" "}
                            {formatPrice(
                              item.unitPrice,
                            )}{" "}
                            ETB
                          </Text>
                        </View>
  
                        <Text
                          style={
                            styles.itemSubtotal
                          }
                        >
                          {formatPrice(
                            item.subtotal,
                          )}{" "}
                          ETB
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
  
              <View
                style={styles.summaryCard}
              >
                <Text
                  style={styles.summaryTitle}
                >
                  Order Summary
                </Text>
  
                <View
                  style={styles.summaryRow}
                >
                  <Text
                    style={styles.summaryLabel}
                  >
                    Subtotal
                  </Text>
  
                  <Text
                    style={styles.summaryValue}
                  >
                    {formatPrice(
                      checkout.subtotal,
                    )}{" "}
                    ETB
                  </Text>
                </View>
  
                <View
                  style={styles.summaryRow}
                >
                  <Text
                    style={styles.summaryLabel}
                  >
                    Delivery fee
                  </Text>
  
                  <Text
                    style={styles.summaryValue}
                  >
                    {formatPrice(
                      checkout.deliveryFee,
                    )}{" "}
                    ETB
                  </Text>
                </View>
  
                <View
                  style={styles.summaryRow}
                >
                  <Text
                    style={styles.summaryLabel}
                  >
                    Discount
                  </Text>
  
                  <Text
                    style={styles.summaryValue}
                  >
                    -{" "}
                    {formatPrice(
                      checkout.discount,
                    )}{" "}
                    ETB
                  </Text>
                </View>
  
                <View
                  style={styles.summaryDivider}
                />
  
                <View
                  style={styles.totalRow}
                >
                  <Text
                    style={styles.totalLabel}
                  >
                    Total
                  </Text>
  
                  <Text
                    style={styles.totalValue}
                  >
                    {formatPrice(
                      checkout.total,
                    )}{" "}
                    ETB
                  </Text>
                </View>
              </View>
  
              <View
                style={styles.paymentCard}
              >
                <Text
                  style={styles.paymentLabel}
                >
                  PAYMENT METHOD
                </Text>
  
                <View
                  style={styles.paymentRow}
                >
                  <View
                    style={styles.paymentIcon}
                  >
                    <Text
                      style={
                        styles.paymentIconText
                      }
                    >
                      C
                    </Text>
                  </View>
  
                  <View
                    style={styles.paymentInfo}
                  >
                    <Text
                      style={styles.paymentName}
                    >
                      Chapa
                    </Text>
  
                    <Text
                      style={
                        styles.paymentDescription
                      }
                    >
                      Secure online payment
                    </Text>
                  </View>
  
                  <View
                    style={styles.selectedMark}
                  >
                    <Text
                      style={
                        styles.selectedMarkText
                      }
                    >
                      ✓
                    </Text>
                  </View>
                </View>
              </View>
  
              <TouchableOpacity
                style={styles.payButton}
                onPress={() =>
                  Alert.alert(
                    "Chapa",
                    "Payment connection will be added next.",
                  )
                }
              >
                <Text
                  style={styles.payButtonText}
                >
                  Pay{" "}
                  {formatPrice(
                    checkout.total,
                  )}{" "}
                  ETB with Chapa
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
  
          {!selectedAddressId &&
          addresses.length > 0 ? (
            <View
              style={styles.noticeCard}
            >
              <Text
                style={styles.noticeText}
              >
                Select a delivery address to
                continue.
              </Text>
            </View>
          ) : null}
  
          {selectedAddress &&
          !checkout &&
          !loadingPreview ? (
            <View
              style={styles.noticeCard}
            >
              <Text
                style={styles.noticeText}
              >
                We couldn't prepare your
                checkout. Pull down to refresh
                and try again.
              </Text>
            </View>
          ) : null}
        </ScrollView>
  
        <Modal
          visible={showAddressModal}
          animationType="slide"
          transparent
          onRequestClose={() =>
            setShowAddressModal(false)
          }
        >
          <View
            style={styles.modalOverlay}
          >
            <View style={styles.modalCard}>
              <View
                style={styles.modalHeader}
              >
                <View>
                  <Text
                    style={styles.modalTitle}
                  >
                    Add Address
                  </Text>
  
                  <Text
                    style={styles.modalSubtitle}
                  >
                    Add a delivery location
                  </Text>
                </View>
  
                <TouchableOpacity
                  onPress={() =>
                    setShowAddressModal(false)
                  }
                >
                  <Text
                    style={styles.closeText}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
  
              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
              >
                <Text
                  style={styles.inputLabel}
                >
                  Label
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="Home, Work..."
                  placeholderTextColor="#A19B93"
                  value={label}
                  onChangeText={setLabel}
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  Address
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="Street or delivery address"
                  placeholderTextColor="#A19B93"
                  value={addressText}
                  onChangeText={
                    setAddressText
                  }
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  City
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#A19B93"
                  value={city}
                  onChangeText={setCity}
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  Sub-city
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="Sub-city"
                  placeholderTextColor="#A19B93"
                  value={subCity}
                  onChangeText={setSubCity}
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  Phone
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="Phone number"
                  placeholderTextColor="#A19B93"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  Latitude
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 9.0320"
                  placeholderTextColor="#A19B93"
                  keyboardType="numeric"
                  value={latitude}
                  onChangeText={setLatitude}
                />
  
                <Text
                  style={styles.inputLabel}
                >
                  Longitude
                </Text>
  
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 38.7469"
                  placeholderTextColor="#A19B93"
                  keyboardType="numeric"
                  value={longitude}
                  onChangeText={
                    setLongitude
                  }
                />
  
                <TouchableOpacity
                  style={
                    styles.saveAddressButton
                  }
                  onPress={
                    handleAddAddress
                  }
                  disabled={savingAddress}
                >
                  {savingAddress ? (
                    <ActivityIndicator
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      style={
                        styles.saveAddressText
                      }
                    >
                      Save Address
                    </Text>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
      paddingBottom: 50,
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
      marginBottom: 24,
    },
  
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 12,
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E7E0D7",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
  
    backText: {
      color: "#26231F",
      fontSize: 30,
      lineHeight: 30,
      marginTop: -3,
    },
  
    headerText: {
      flex: 1,
    },
  
    title: {
      color: "#26231F",
      fontSize: 30,
      fontWeight: "800",
    },
  
    subtitle: {
      color: "#817D76",
      fontSize: 13,
      marginTop: 3,
    },
  
    section: {
      marginBottom: 18,
    },
  
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12,
    },
  
    sectionTitle: {
      color: "#26231F",
      fontSize: 19,
      fontWeight: "800",
    },
  
    sectionSubtitle: {
      color: "#817D76",
      fontSize: 13,
      marginTop: 3,
    },
  
    addText: {
      color: "#7B1E3A",
      fontSize: 14,
      fontWeight: "800",
    },
  
    addressList: {
      gap: 10,
    },
  
    addressCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 17,
      padding: 16,
      borderWidth: 1,
      borderColor: "#E7E0D7",
      position: "relative",
    },
  
    addressCardSelected: {
      borderColor: "#7B1E3A",
      backgroundColor: "#FFF9FB",
    },
  
    addressTopRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 7,
    },
  
    addressLabel: {
      color: "#26231F",
      fontSize: 16,
      fontWeight: "800",
    },
  
    defaultText: {
      color: "#7B1E3A",
      fontSize: 9,
      fontWeight: "800",
      letterSpacing: 0.8,
      marginLeft: 8,
    },
  
    addressText: {
      color: "#26231F",
      fontSize: 14,
      lineHeight: 20,
      paddingRight: 35,
    },
  
    addressLocation: {
      color: "#817D76",
      fontSize: 13,
      marginTop: 4,
    },
  
    addressPhone: {
      color: "#817D76",
      fontSize: 13,
      marginTop: 3,
    },
  
    radio: {
      position: "absolute",
      right: 16,
      top: 17,
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: "#C9C1B8",
      alignItems: "center",
      justifyContent: "center",
    },
  
    radioSelected: {
      borderColor: "#7B1E3A",
    },
  
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "#7B1E3A",
    },
  
    emptyAddressCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 20,
      borderWidth: 1,
      borderColor: "#E7E0D7",
      alignItems: "center",
    },
  
    emptyAddressTitle: {
      color: "#26231F",
      fontSize: 17,
      fontWeight: "800",
    },
  
    emptyAddressText: {
      color: "#817D76",
      fontSize: 13,
      textAlign: "center",
      marginTop: 6,
    },
  
    addAddressButton: {
      backgroundColor: "#7B1E3A",
      borderRadius: 13,
      paddingHorizontal: 20,
      paddingVertical: 13,
      marginTop: 15,
    },
  
    addAddressButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "800",
    },
  
    previewLoading: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 15,
    },
  
    previewLoadingText: {
      color: "#817D76",
      fontSize: 13,
      marginLeft: 8,
    },
  
    restaurantCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 18,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: "#E7E0D7",
    },
  
    restaurantLabel: {
      color: "#817D76",
      fontSize: 10,
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
      color: "#2E7D32",
      fontSize: 13,
      fontWeight: "600",
      marginTop: 5,
    },
  
    itemsContainer: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      marginTop: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: "#E7E0D7",
    },
  
    itemRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#E7E0D7",
    },
  
    itemInfo: {
      flex: 1,
      paddingRight: 15,
    },
  
    itemName: {
      color: "#26231F",
      fontSize: 15,
      fontWeight: "700",
    },
  
    itemQuantity: {
      color: "#817D76",
      fontSize: 12,
      marginTop: 4,
    },
  
    itemSubtotal: {
      color: "#26231F",
      fontSize: 14,
      fontWeight: "800",
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
      marginBottom: 12,
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
      marginVertical: 6,
    },
  
    totalRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
  
    totalLabel: {
      color: "#26231F",
      fontSize: 18,
      fontWeight: "800",
    },
  
    totalValue: {
      color: "#7B1E3A",
      fontSize: 21,
      fontWeight: "800",
    },
  
    paymentCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 18,
      padding: 18,
      marginTop: 18,
      borderWidth: 1,
      borderColor: "#E7E0D7",
    },
  
    paymentLabel: {
      color: "#817D76",
      fontSize: 10,
      fontWeight: "800",
      letterSpacing: 1,
      marginBottom: 12,
    },
  
    paymentRow: {
      flexDirection: "row",
      alignItems: "center",
    },
  
    paymentIcon: {
      width: 42,
      height: 42,
      borderRadius: 12,
      backgroundColor: "#F1DCE3",
      alignItems: "center",
      justifyContent: "center",
    },
  
    paymentIconText: {
      color: "#7B1E3A",
      fontSize: 18,
      fontWeight: "900",
    },
  
    paymentInfo: {
      flex: 1,
      marginLeft: 12,
    },
  
    paymentName: {
      color: "#26231F",
      fontSize: 15,
      fontWeight: "800",
    },
  
    paymentDescription: {
      color: "#817D76",
      fontSize: 12,
      marginTop: 3,
    },
  
    selectedMark: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#7B1E3A",
      alignItems: "center",
      justifyContent: "center",
    },
  
    selectedMarkText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontWeight: "800",
    },
  
    payButton: {
      backgroundColor: "#7B1E3A",
      borderRadius: 15,
      minHeight: 56,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 18,
    },
  
    payButtonText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },
  
    noticeCard: {
      backgroundColor: "#FFFFFF",
      borderRadius: 16,
      padding: 16,
      marginTop: 18,
      borderWidth: 1,
      borderColor: "#E7E0D7",
    },
  
    noticeText: {
      color: "#817D76",
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },
  
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(38,35,31,0.45)",
      justifyContent: "flex-end",
    },
  
    modalCard: {
      backgroundColor: "#F8F5EF",
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      maxHeight: "92%",
      padding: 20,
    },
  
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 20,
    },
  
    modalTitle: {
      color: "#26231F",
      fontSize: 23,
      fontWeight: "800",
    },
  
    modalSubtitle: {
      color: "#817D76",
      fontSize: 13,
      marginTop: 3,
    },
  
    closeText: {
      color: "#26231F",
      fontSize: 30,
      fontWeight: "300",
    },
  
    inputLabel: {
      color: "#26231F",
      fontSize: 13,
      fontWeight: "700",
      marginBottom: 7,
      marginTop: 10,
    },
  
    input: {
      backgroundColor: "#FFFFFF",
      borderWidth: 1,
      borderColor: "#E7E0D7",
      borderRadius: 13,
      minHeight: 48,
      paddingHorizontal: 14,
      color: "#26231F",
      fontSize: 14,
    },
  
    saveAddressButton: {
      backgroundColor: "#7B1E3A",
      borderRadius: 14,
      minHeight: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 22,
      marginBottom: 25,
    },
  
    saveAddressText: {
      color: "#FFFFFF",
      fontSize: 15,
      fontWeight: "800",
    },
  });