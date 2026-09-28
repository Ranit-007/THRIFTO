"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";
import { useToast } from "@/components/providers/toast-provider";
import { createCheckoutOrder } from "@/app/actions/checkout";
import { verifyPayment } from "@/app/actions/payment";
import { formatPrice } from "@/lib/utils";
import { store } from "@/config/store";
import { Address } from "@prisma/client";

interface CheckoutClientProps {
  savedAddresses: Address[];
}

export default function CheckoutClient({ savedAddresses }: CheckoutClientProps) {
  const router = useRouter();
  const { cartItems, isStoreReady, clearCart } = useStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");

  // Form state for a new address
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  // Calculate totals client side for display ONLY (server computes truth)
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= store.shipping.freeThreshold ? 0 : store.shipping.flatRate;
  const total = subtotal + shipping;

  useEffect(() => {
    // If the cart is empty and store is ready, redirect to cart or shop
    if (isStoreReady && cartItems.length === 0 && !isLoading) {
      router.push("/cart");
    }
  }, [isStoreReady, cartItems.length, router, isLoading]);

  useEffect(() => {
    if (savedAddresses.length > 0) {
      setSelectedAddressId(savedAddresses[0].id);
    }
  }, [savedAddresses]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast({ title: "Your bag is empty", type: "error" });
      return;
    }

    if (!window.Razorpay) {
      toast({ title: "Failed to load payment gateway. Try again.", type: "error" });
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create order on server side
      const orderResponse = await createCheckoutOrder({
        items: cartItems.map((item) => ({
          productId: item.productId,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        })),
        shippingAddress:
          selectedAddressId !== "new"
            ? null
            : formData,
        addressId: selectedAddressId !== "new" ? selectedAddressId : undefined,
      });

      if (orderResponse.error) {
        throw new Error(orderResponse.error);
      }

      if (!orderResponse.razorpayOrderId) {
        throw new Error("Failed to get payment details from server.");
      }

      // 2. Initialize Razorpay Client
      const options = {
        key: orderResponse.keyId, // Razorpay Key ID
        amount: orderResponse.amount, // in paise
        currency: orderResponse.currency,
        name: "BAUNDULE",
        description: "Your Order",
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response: RazorpaySuccessResponse) {
          // 3. Verify payment on server
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              clearCart(); // Clear local cart on success
              router.push(`/checkout/success?orderId=${verifyRes.orderId}`);
            } else {
              toast({ title: verifyRes.error || "Payment verification failed", type: "error" });
              router.push(`/checkout/failure?orderId=${orderResponse.orderId}`);
            }
          } catch (error) {
            console.error(error);
            router.push(`/checkout/failure?orderId=${orderResponse.orderId}`);
          }
        },
        prefill: {
          name: orderResponse.customer?.name,
          email: orderResponse.customer?.email,
          contact: orderResponse.customer?.phone,
        },
        theme: {
          color: "#56352d", // --color-ink
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: RazorpayFailedResponse) {
        console.error(response.error.description);
        toast({ title: "Payment failed", type: "error" });
        router.push(`/checkout/failure?orderId=${orderResponse.orderId}`);
      });

      rzp1.open();
    } catch (error: unknown) {
      toast({ title: error instanceof Error ? error.message : "An error occurred during checkout", type: "error" });
      setIsLoading(false);
    }
  };

  if (!isStoreReady || cartItems.length === 0) {
    return (
      <main className="checkout-page checkout-page--loading">
        <Loader2 className="animate-spin" />
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="page-shell checkout-page__container">
        <header className="checkout-page__heading">
          <p className="eyebrow">Secure Checkout</p>
          <h1>CHECKOUT</h1>
        </header>

        <form className="checkout-page__grid" onSubmit={handleCheckout}>
          <div className="checkout-page__form-section">
            <h2 className="text-xl font-bold mb-6">SHIPPING INFO</h2>

            {savedAddresses.length > 0 && (
              <div className="checkout-page__saved-addresses mb-8 space-y-4">
                {savedAddresses.map((address) => (
                  <label
                    key={address.id}
                    className={`checkout-page__address-card flex items-start p-4 border rounded-none cursor-pointer ${
                      selectedAddressId === address.id ? "border-ink bg-gray-50" : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="addressSelection"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-1 mr-4"
                    />
                    <div>
                      <p className="font-bold">{address.fullName}</p>
                      <p className="text-sm">{address.addressLine1}</p>
                      {address.addressLine2 && <p className="text-sm">{address.addressLine2}</p>}
                      <p className="text-sm">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-sm mt-1">📞 {address.phone}</p>
                    </div>
                  </label>
                ))}

                <label
                  className={`checkout-page__address-card flex items-start p-4 border rounded-none cursor-pointer ${
                    selectedAddressId === "new" ? "border-ink bg-gray-50" : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="addressSelection"
                    value="new"
                    checked={selectedAddressId === "new"}
                    onChange={() => setSelectedAddressId("new")}
                    className="mt-1 mr-4"
                  />
                  <div className="font-bold">Use a different address</div>
                </label>
              </div>
            )}

            {selectedAddressId === "new" && (
              <div className="checkout-page__new-address gap-4 grid grid-cols-1 md:grid-cols-2">
                <div className="form-group md:col-span-2">
                  <label htmlFor="fullName">FULL NAME</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label htmlFor="phone">PHONE (For Delivery)</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label htmlFor="addressLine1">ADDRESS LINE 1</label>
                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label htmlFor="addressLine2">ADDRESS LINE 2 (Optional)</label>
                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="city">CITY</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">STATE</label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="postalCode">PIN CODE</label>
                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    required
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="country">COUNTRY</label>
                  <input
                    id="country"
                    name="country"
                    type="text"
                    required
                    value={formData.country}
                    onChange={handleInputChange}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
              </div>
            )}
          </div>

          <aside className="checkout-page__summary bg-gray-50 p-6 border h-fit sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">ORDER SUMMARY</h2>

            <div className="checkout-page__summary-items mb-6 space-y-4 max-h-[40vh] overflow-y-auto">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative w-16 h-20 bg-gray-200">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute -top-2 -right-2 bg-black text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-600 uppercase">
                      {item.size} / {item.color}
                    </p>
                    <p>{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="checkout-page__summary-totals pt-4 border-t space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4">
                <span>TOTAL</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="button button--dark w-full mt-6 flex justify-between items-center"
            >
              <span>{isLoading ? "PROCESSING..." : "PAY SECURELY"}</span>
              {!isLoading && <ArrowRight size={16} />}
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By proceeding, you agree to our Terms & Conditions.
            </p>
          </aside>
        </form>
      </div>
    </main>
  );
}
