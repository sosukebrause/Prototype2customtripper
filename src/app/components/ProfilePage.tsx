import { useState } from "react";
import { Header } from "./Header";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  CreditCard,
  Bell,
  Lock,
  Save,
  Edit,
  Check
} from "lucide-react";

export function ProfilePage() {
  // Personal/Company Info
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    companyName: "Acme Corporation",
    companyAddress: "123 Business St, Tokyo, Japan",
  });
  const [tempPersonalInfo, setTempPersonalInfo] = useState(personalInfo);

  // Payment Method
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "**** **** **** 4242",
    cardHolder: "John Smith",
    expiryDate: "12/25",
    billingAddress: "123 Business St, Tokyo, Japan",
  });
  const [tempPaymentInfo, setTempPaymentInfo] = useState(paymentInfo);

  // Notification Preferences
  const [notifications, setNotifications] = useState({
    emailBookingConfirmation: true,
    emailTripReminders: true,
    emailPromotions: false,
    smsBookingConfirmation: true,
    smsTripReminders: false,
  });

  // Password Change
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSavePersonalInfo = () => {
    setPersonalInfo(tempPersonalInfo);
    setIsEditingInfo(false);
  };

  const handleCancelPersonalInfo = () => {
    setTempPersonalInfo(personalInfo);
    setIsEditingInfo(false);
  };

  const handleSavePayment = () => {
    setPaymentInfo(tempPaymentInfo);
    setIsEditingPayment(false);
  };

  const handleCancelPayment = () => {
    setTempPaymentInfo(paymentInfo);
    setIsEditingPayment(false);
  };

  const handleChangePassword = () => {
    // In a real app, this would call an API
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Personal/Company Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="size-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Personal & Company Info</h2>
                  <p className="text-sm text-gray-500">Your contact and company details</p>
                </div>
              </div>
              {!isEditingInfo ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingInfo(true)}>
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelPersonalInfo}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSavePersonalInfo}>
                    <Check className="size-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    value={isEditingInfo ? tempPersonalInfo.name : personalInfo.name}
                    onChange={(e) => setTempPersonalInfo({...tempPersonalInfo, name: e.target.value})}
                    disabled={!isEditingInfo}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    value={isEditingInfo ? tempPersonalInfo.email : personalInfo.email}
                    onChange={(e) => setTempPersonalInfo({...tempPersonalInfo, email: e.target.value})}
                    disabled={!isEditingInfo}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    value={isEditingInfo ? tempPersonalInfo.phone : personalInfo.phone}
                    onChange={(e) => setTempPersonalInfo({...tempPersonalInfo, phone: e.target.value})}
                    disabled={!isEditingInfo}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    value={isEditingInfo ? tempPersonalInfo.companyName : personalInfo.companyName}
                    onChange={(e) => setTempPersonalInfo({...tempPersonalInfo, companyName: e.target.value})}
                    disabled={!isEditingInfo}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Company Address</label>
                <Input
                  value={isEditingInfo ? tempPersonalInfo.companyAddress : personalInfo.companyAddress}
                  onChange={(e) => setTempPersonalInfo({...tempPersonalInfo, companyAddress: e.target.value})}
                  disabled={!isEditingInfo}
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CreditCard className="size-5 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                  <p className="text-sm text-gray-500">Manage your payment information</p>
                </div>
              </div>
              {!isEditingPayment ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingPayment(true)}>
                  <Edit className="size-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelPayment}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSavePayment}>
                    <Check className="size-4 mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Card Number</label>
                <Input
                  value={isEditingPayment ? tempPaymentInfo.cardNumber : paymentInfo.cardNumber}
                  onChange={(e) => setTempPaymentInfo({...tempPaymentInfo, cardNumber: e.target.value})}
                  disabled={!isEditingPayment}
                  placeholder="**** **** **** ****"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Card Holder</label>
                <Input
                  value={isEditingPayment ? tempPaymentInfo.cardHolder : paymentInfo.cardHolder}
                  onChange={(e) => setTempPaymentInfo({...tempPaymentInfo, cardHolder: e.target.value})}
                  disabled={!isEditingPayment}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Expiry Date</label>
                <Input
                  value={isEditingPayment ? tempPaymentInfo.expiryDate : paymentInfo.expiryDate}
                  onChange={(e) => setTempPaymentInfo({...tempPaymentInfo, expiryDate: e.target.value})}
                  disabled={!isEditingPayment}
                  placeholder="MM/YY"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">CVV</label>
                <Input
                  type="password"
                  disabled={!isEditingPayment}
                  placeholder="***"
                  maxLength={3}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-2 block">Billing Address</label>
                <Input
                  value={isEditingPayment ? tempPaymentInfo.billingAddress : paymentInfo.billingAddress}
                  onChange={(e) => setTempPaymentInfo({...tempPaymentInfo, billingAddress: e.target.value})}
                  disabled={!isEditingPayment}
                />
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Bell className="size-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
                <p className="text-sm text-gray-500">Choose how you want to be notified</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">Email - Booking Confirmation</div>
                  <div className="text-sm text-gray-500">Receive confirmation emails for new bookings</div>
                </div>
                <Switch
                  checked={notifications.emailBookingConfirmation}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailBookingConfirmation: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">Email - Trip Reminders</div>
                  <div className="text-sm text-gray-500">Get reminders before your scheduled trips</div>
                </div>
                <Switch
                  checked={notifications.emailTripReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailTripReminders: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">Email - Promotions</div>
                  <div className="text-sm text-gray-500">Receive promotional offers and updates</div>
                </div>
                <Switch
                  checked={notifications.emailPromotions}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, emailPromotions: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div>
                  <div className="font-medium text-gray-900">SMS - Booking Confirmation</div>
                  <div className="text-sm text-gray-500">Receive SMS for booking confirmations</div>
                </div>
                <Switch
                  checked={notifications.smsBookingConfirmation}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, smsBookingConfirmation: checked})
                  }
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-gray-900">SMS - Trip Reminders</div>
                  <div className="text-sm text-gray-500">Get SMS reminders before your trips</div>
                </div>
                <Switch
                  checked={notifications.smsTripReminders}
                  onCheckedChange={(checked) => 
                    setNotifications({...notifications, smsTripReminders: checked})
                  }
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <Button>
                <Save className="size-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </Card>

          {/* Password Change */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                <Lock className="size-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
                <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
              </div>
            </div>

            {!isChangingPassword ? (
              <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
                Change Password
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({currentPassword: "", newPassword: "", confirmPassword: ""});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleChangePassword}
                    disabled={
                      !passwordData.currentPassword || 
                      !passwordData.newPassword || 
                      passwordData.newPassword !== passwordData.confirmPassword
                    }
                  >
                    Update Password
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
