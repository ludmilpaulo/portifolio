"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute requiredUserType="admin" redirectTo="/admin-login">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600 mb-6">Admin account details.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Username</div>
            <div className="text-gray-900 font-semibold">{user?.username ?? "-"}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Email</div>
            <div className="text-gray-900 font-semibold">{user?.email ?? "-"}</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Name</div>
            <div className="text-gray-900 font-semibold">
              {[user?.first_name, user?.last_name].filter(Boolean).join(" ") || "-"}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-sm text-gray-500">Role</div>
            <div className="text-gray-900 font-semibold">{user?.user_type ?? "admin"}</div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

