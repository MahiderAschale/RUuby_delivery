import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { verifyChapaPayment } from "../../services/chapa.service";

type PaymentState =
  | "verifying"
  | "success"
  | "failed"
  | "error";

export default function PaymentResultScreen() {
const params = useLocalSearchParams<{
  tx_ref?: string | string[];
  trx_ref?: string | string[];
  txRef?: string | string[];
  reference?: string | string[];
  ref_id?: string | string[];
  status?: string | string[];
}>();

// TEMPORARY DEBUG LOG
console.log("Chapa return params:", params);

const getParam = (
  value: string | string[] | undefined,
): string | undefined => {
  const result = Array.isArray(value)
    ? value[0]
    : value;

  return result?.trim() || undefined;
};

const txRef =
  getParam(params.tx_ref) ||
  getParam(params.trx_ref) ||
  getParam(params.txRef) ||
  getParam(params.reference) ||
  getParam(params.ref_id);


  //const txRef = params.tx_ref || params.trx_ref;

  const [paymentState, setPaymentState] =
    useState<PaymentState>("verifying");

  const [orderId, setOrderId] = useState<string | null>(
    null,
  );

  const [errorMessage, setErrorMessage] = useState("");

  const verifyPayment = useCallback(async () => {
    if (!txRef) {
      setPaymentState("error");
      setErrorMessage(
        "We couldn't find your payment reference. Please check your order.",
      );
      return;
    }

    try {
      setPaymentState("verifying");
      setErrorMessage("");

      const payment = await verifyChapaPayment(txRef);

      if (payment.status === "PAID") {
        setPaymentState("success");

        if (payment.orderId) {
          setOrderId(payment.orderId);
        }
      } else {
        setPaymentState("failed");
        setErrorMessage(
          "Your payment has not been confirmed yet. If you completed the payment, please try verifying again.",
        );
      }
    } catch (error: any) {
      console.error("Payment verification error:", error);

      setPaymentState("error");
      setErrorMessage(
        error?.response?.data?.message ||
          "We couldn't verify your payment. Please try again.",
      );
    }
  }, [txRef]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  const handleContinue = () => {
    if (orderId) {
      router.replace(`/orders/${orderId}`);
    } else {
      router.replace("/(main)/orders");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {paymentState === "verifying" && (
          <>
            <ActivityIndicator
              size="large"
              color="#7B1E3A"
            />

            <Text style={styles.title}>
              Verifying your payment
            </Text>

            <Text style={styles.description}>
              Please wait while we confirm your
              transaction with Chapa.
            </Text>
          </>
        )}

        {paymentState === "success" && (
          <>
            <View style={styles.successIcon}>
              <Text style={styles.iconText}>✓</Text>
            </View>

            <Text style={styles.title}>
              Payment successful!
            </Text>

            <Text style={styles.description}>
              Your payment has been confirmed.
              Your RUuby order is now being processed.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>
                View My Order
              </Text>
            </TouchableOpacity>
          </>
        )}

        {paymentState === "failed" && (
          <>
            <View style={styles.failedIcon}>
              <Text style={styles.iconText}>!</Text>
            </View>

            <Text style={styles.title}>
              Payment not confirmed
            </Text>

            <Text style={styles.description}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={verifyPayment}
            >
              <Text style={styles.primaryButtonText}>
                Verify Payment Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.secondaryButtonText}>
                View My Orders
              </Text>
            </TouchableOpacity>
          </>
        )}

        {paymentState === "error" && (
          <>
            <View style={styles.failedIcon}>
              <Text style={styles.iconText}>!</Text>
            </View>

            <Text style={styles.title}>
              Unable to verify payment
            </Text>

            <Text style={styles.description}>
              {errorMessage}
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={verifyPayment}
            >
              <Text style={styles.primaryButtonText}>
                Try Again
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.secondaryButtonText}>
                Go to My Orders
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5EF",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  successIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#E2F3E8",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  failedIcon: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#F1DCE3",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  iconText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#7B1E3A",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#26231F",
    textAlign: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#817D76",
    textAlign: "center",
    marginBottom: 28,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: "#7B1E3A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#7B1E3A",
    fontSize: 15,
    fontWeight: "600",
  },
});
