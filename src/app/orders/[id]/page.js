'use client';

import { CartContext } from "@/components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, CheckCircle, Truck, XCircle } from "lucide-react";

const statusConfig = {
  pending: {
    label: "Order received",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock,
    message: "Your order has been received and is waiting for the shop to accept it.",
  },
  confirmed: {
    label: "Accepted by shop",
    color: "bg-blue-100 text-blue-800",
    icon: CheckCircle,
    message: "Your order was accepted by the shop and will be prepared shortly.",
  },
  preparing: {
    label: "Being prepared",
    color: "bg-purple-100 text-purple-800",
    icon: Package,
    message: "Your order was accepted by the shop and is being prepared.",
  },
  ready: {
    label: "Prepared / Come and collect",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    message: "Your order is ready. Please come and collect it.",
  },
  out_for_delivery: {
    label: "Ready for pickup",
    color: "bg-indigo-100 text-indigo-800",
    icon: Truck,
    message: "Your order is ready for pickup.",
  },
  delivered: {
    label: "Completed",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle,
    message: "This order has been completed.",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
    message: "This order was cancelled.",
  },
};

export default function OrderPage() {
  const { clearCart } = useContext(CartContext);
  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.href.includes("clear-cart=1")) {
      clearCart();
    }

    if (id) {
      setLoadingOrder(true);
      fetch(`/api/orders/${id}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || "Failed to load order");
          }
          setOrder(data.order);
        })
        .catch((err) => {
          console.error("Error fetching order:", err);
          setError(err.message || "Failed to load order");
        })
        .finally(() => {
          setLoadingOrder(false);
        });
    }
  }, [id, clearCart]);

  const statusInfo = statusConfig[order?.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <section className="max-w-2xl mx-auto mt-16 mb-40">
      <div className="text-center">
        <SectionHeaders mainHeader="Your order" />
        <div className="mt-4 mb-8">
          <p>Thanks for your order.</p>
          <p>{statusInfo.message}</p>
        </div>
      </div>

      {loadingOrder && <div>Loading order...</div>}

      {error && !loadingOrder && (
        <div className="text-center text-red-600">{error}</div>
      )}

      {order && !loadingOrder && (
        <div className="grid md:grid-cols-2 md:gap-16">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold">{order.shopName}</h2>
              <div className="mt-2">
                <Badge className={statusInfo.color}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div key={item.menuItemId || index} className="flex items-center justify-between border-b py-4">
                  <div className="grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <div className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-lg font-semibold">
                    R{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-right py-4 text-gray-700">
              <div>
                Subtotal:
                <span className="text-black font-bold inline-block min-w-[90px] ml-2">
                  R{(order.subtotal || 0).toFixed(2)}
                </span>
              </div>
              <div>
                Service Fee:
                <span className="text-black font-bold inline-block min-w-[90px] ml-2">
                  R{(order.deliveryFee || 0).toFixed(2)}
                </span>
              </div>
              <div>
                Total:
                <span className="text-black font-bold inline-block min-w-[90px] ml-2">
                  R{(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" onClick={() => router.push("/orders")}>
                Back to orders
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Order details</h3>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Payment method:</span>{" "}
                  <span className="capitalize">{order.paymentMethod || "cash"}</span>
                </div>

                <div>
                  <span className="font-medium">Payment status:</span>{" "}
                  <span className="capitalize">{order.paymentStatus || "pending"}</span>
                </div>

                {order.notes ? (
                  <div>
                    <span className="font-medium">Notes:</span> {order.notes}
                  </div>
                ) : null}

                {order.deliveryAddress &&
                (order.deliveryAddress.street ||
                  order.deliveryAddress.city ||
                  order.deliveryAddress.postalCode ||
                  order.deliveryAddress.phone) ? (
                  <div className="pt-2">
                    <div className="font-medium mb-1">Customer details</div>
                    {order.deliveryAddress.street ? <div>{order.deliveryAddress.street}</div> : null}
                    {order.deliveryAddress.city ? <div>{order.deliveryAddress.city}</div> : null}
                    {order.deliveryAddress.postalCode ? <div>{order.deliveryAddress.postalCode}</div> : null}
                    {order.deliveryAddress.phone ? <div>{order.deliveryAddress.phone}</div> : null}
                  </div>
                ) : (
                  <div className="text-gray-500">No pickup details were required for this order.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}