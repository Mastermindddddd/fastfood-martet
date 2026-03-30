'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Package, CheckCircle, Truck, XCircle } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Order received',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    message: 'Your order has been received and is waiting for the shop to accept it.'
  },
  confirmed: {
    label: 'Accepted by shop',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle,
    message: 'Your order was accepted by the shop and will be prepared shortly.'
  },
  preparing: {
    label: 'Being prepared',
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
    message: 'Your order was accepted by the shop and is being prepared.'
  },
  ready: {
    label: 'Prepared / Come and collect',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    message: 'Your order is ready. Please come and collect it.'
  },
  out_for_delivery: {
    label: 'Ready for pickup',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Truck,
    message: 'Your order is ready for pickup.'
  },
  delivered: {
    label: 'Completed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    message: 'This order has been completed.'
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    message: 'This order was cancelled.'
  }
};

export default function OrderPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoadingOrder(true);
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();

        if (!data.success) {
          setError(data.message || 'Failed to load order');
          return;
        }

        setOrder(data.order);
      } catch (err) {
        setError('Failed to load order');
      } finally {
        setLoadingOrder(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loadingOrder) {
    return <div className="max-w-2xl mx-auto mt-8">Loading order...</div>;
  }

  if (error) {
    return <div className="max-w-2xl mx-auto mt-8 text-red-600">{error}</div>;
  }

  if (!order) {
    return <div className="max-w-2xl mx-auto mt-8">Order not found.</div>;
  }

  const statusInfo = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = statusInfo.icon;

  return (
    <section className="max-w-2xl mx-auto mt-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your order</h1>
        <p className="mt-3 text-gray-600">Thanks for your order.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{order.shopName}</span>
            <Badge className={statusInfo.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusInfo.label}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">{statusInfo.message}</p>

          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">R{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-right text-sm">
            <p>Subtotal: <span className="font-semibold">R{order.subtotal.toFixed(2)}</span></p>
            <p>Service Fee: <span className="font-semibold">R{order.deliveryFee.toFixed(2)}</span></p>
            <p className="text-lg font-bold">Total: R{order.total.toFixed(2)}</p>
          </div>

          {order.deliveryAddress && (
            <div>
              <h3 className="font-semibold mb-2">Delivery / Pickup Details</h3>
              <p className="text-gray-700">
                {order.deliveryAddress.street}<br />
                {order.deliveryAddress.city} {order.deliveryAddress.postalCode}<br />
                {order.deliveryAddress.phone}
              </p>
            </div>
          )}

          <div className="pt-4">
            <Button variant="outline" onClick={() => router.push('/orders')}>
              Back to my orders
            </Button>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}