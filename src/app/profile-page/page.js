"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
ArrowLeft,
User,
MapPin,
CreditCard,
Clock,
Settings,
LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession, signOut } from "next-auth/react";
import { useAppContext } from "@/components/AppContext";

export default function ProfilePage() {
const router = useRouter();
const { data: session, status } = useSession();
const user = session?.user;

const [activeTab, setActiveTab] = useState("profile");
const [isEditing, setIsEditing] = useState(false);
const [formData, setFormData] = useState({
name: user?.name || "",
email: user?.email || "",
phone: user?.phone || "",
});

const handleInputChange = (e) => {
const { name, value } = e.target;
setFormData((prev) => ({
...prev,
[name]: value,
}));
};

const handleSaveProfile = () => {
setUser((prev) => ({
...prev,
...formData,
}));
setIsEditing(false);
};

const handleLogout = () => {
setUser(null);
router.push("/");
};

if (!user) {
return ( <div className="min-h-screen bg-gray-50 flex items-center justify-center"> <div className="text-center"> <h2 className="text-2xl font-bold text-gray-900 mb-4">
Please sign in </h2> <Link href="/login"> <Button>Sign In</Button> </Link> </div> </div>
);
}

const tabs = [
{ id: "profile", name: "Profile", icon: User },
{ id: "addresses", name: "Addresses", icon: MapPin },
{ id: "payment", name: "Payment", icon: CreditCard },
{ id: "orders", name: "Order History", icon: Clock },
{ id: "settings", name: "Settings", icon: Settings },
];

return ( <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm"> 
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> 
            <div className="flex items-center justify-between h-16"> 
                <h1 className="text-xl font-semibold">
                    My Profile
                </h1> 
            </div>
        </div> 
    </header>

  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar */}
      <div className="md:col-span-1">
        <Card>
          <CardContent className="p-0">
            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab.id
                        ? "bg-orange-50 text-orange-600 border-r-2 border-orange-600"
                        : "text-gray-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="md:col-span-3">
        {activeTab === "profile" && (
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                {isEditing ? (
                  <>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "addresses" && (
          <Card>
            <CardHeader>
              <CardTitle>Delivery Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Home</p>
                      <p className="text-gray-600">
                        123 Main Street, Cape Town, 8001
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Add New Address
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "payment" && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">**** **** **** 1234</p>
                      <p className="text-gray-600">Expires 12/25</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Add New Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "orders" && (
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Order #ORD-123456</p>
                      <p className="text-gray-600">
                        Burger Palace • R124.50
                      </p>
                      <p className="text-sm text-gray-500">
                        Delivered on Sep 28, 2025
                      </p>
                    </div>
                    <div className="text-right">
                      <Button variant="outline" size="sm" className="mb-2">
                        Reorder
                      </Button>
                      <br />
                      <Button variant="ghost" size="sm">
                        Rate & Review
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center py-8 text-gray-500">
                  <p>No more orders to show</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "settings" && (
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Notifications</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>Order updates</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Promotional offers</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>New restaurants</span>
                    <input type="checkbox" className="rounded" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Privacy</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>Share location data</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span>Personalized recommendations</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </label>
                </div>
              </div>

              <Button>Save Settings</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  </div>
</div>
);
}
