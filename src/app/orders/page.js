'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { dbTimeForHuman } from "@/libs/datetime";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { loading, data: profile } = useProfile();

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders((data.orders || []).reverse());
        } else {
          console.error(data.message);
          setOrders([]);
        }
        setLoadingOrders(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoadingOrders(false);
      });
  }

  return (
    <section className="mt-20 max-w-2xl mx-auto mb-40">
      <UserTabs isAdmin={profile.admin} />

      <div className="mt-20">
        {loadingOrders && <div>Loading orders...</div>}

        {orders?.length > 0 && orders.map(order => (
          <div
            key={order._id}
            className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
          >
            <div className="grow flex flex-col md:flex-row items-center gap-6">

              {/* Payment Status */}
              <div>
                <div className={
                  (order.paymentStatus === 'paid'
                    ? 'bg-green-500'
                    : 'bg-yellow-500') +
                  ' p-2 rounded-md text-white w-24 text-center'
                }>
                  {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </div>
              </div>

              {/* Order Info */}
              <div className="grow">
                <div className="flex gap-2 items-center mb-1">
                  <div className="grow">{order.userEmail}</div>
                  <div className="text-gray-500 text-sm">
                    {dbTimeForHuman(order.createdAt)}
                  </div>
                </div>

                <div className="text-gray-500 text-xs">
                  {order.items?.map(p => p.name).join(', ')}
                </div>
              </div>
            </div>

            {/* View Order */}
            <div className="justify-end flex gap-2 items-center whitespace-nowrap">
              <Link href={"/orders/" + order._id} className="button">
                Show order
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}