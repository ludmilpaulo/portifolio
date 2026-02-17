"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardSecurityPage() {
  return (
    <ProtectedRoute requiredUserType="admin" redirectTo="/admin-login">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Security</h1>
        <p className="text-gray-600 mb-6">
          Security settings for the admin dashboard.
        </p>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-gray-900 font-semibold mb-1">Session</div>
            <div className="text-gray-600 text-sm">
              Authentication is handled via backend token login and stored locally in the browser.
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-gray-900 font-semibold mb-1">Password resets</div>
            <div className="text-gray-600 text-sm">
              Password reset requests go through the backend endpoint and are proxied via ` /api/graphql `.
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

