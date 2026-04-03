/**
 * Share Modal - Document Collaboration
 *
 * Allows document owners to invite collaborators
 * Max 4 invited users (5 total including owner)
 *
 * SAFE: NEW component, doesn't modify existing code
 */

import React, { useState, useEffect } from "react";
import { X, Mail, Check, Loader2, Trash2 } from "lucide-react";
import api from "../../lib/api";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  documentId,
  documentTitle,
}: ShareModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [loading, setLoading] = useState(false);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [inviteMessage, setInviteMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (isOpen && documentId) {
      fetchCollaborators();
    }
  }, [isOpen, documentId]);

  const fetchCollaborators = async () => {
    try {
      const response = await api.get(
        `/collaborations/${documentId}/collaborators`,
      );
      if (response.data.status === "success") {
        setCollaborators(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
    }
  };

  const handleInvite = async () => {
    if (!email || loading) return;

    try {
      setLoading(true);
      setSuccessMessage("");

      const response = await api.post("/collaborations/invite", {
        documentId,
        email,
        role,
        message: inviteMessage,
      });

      if (response.data.status === "success") {
        const userRegistered = response.data.data?.userRegistered;
        const successMsg = userRegistered
          ? `✅ Invitation sent to ${email}! They will receive an email.`
          : `✅ Invitation sent to ${email}! They'll need to sign up first.`;

        setSuccessMessage(successMsg);
        setEmail("");
        setInviteMessage("");

        // Refresh collaborators list
        setTimeout(() => {
          fetchCollaborators();
          setSuccessMessage("");
        }, 3000);

        console.log(`📧 Invite sent successfully:`, response.data.data);
        console.log(`📍 Invite link: ${response.data.data.inviteLink}`);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "Failed to send invitation";
      console.error("❌ Invite error:", errorMsg);
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    if (!confirm("Remove this collaborator?")) return;

    try {
      await api.delete(`/collaborations/${documentId}/user/${userId}`);
      fetchCollaborators();
    } catch (error) {
      alert("Failed to remove collaborator");
    }
  };

  const getRoleColor = (role: string) => {
    if (role === "owner") return "bg-purple-100 text-purple-800";
    if (role === "editor") return "bg-blue-100 text-blue-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    if (status === "accepted")
      return <span className="text-green-600 text-xs">Active</span>;
    if (status === "pending")
      return <span className="text-yellow-600 text-xs">Pending...</span>;
    return <span className="text-gray-400 text-xs">Inactive</span>;
  };

  if (!isOpen) return null;

  const acceptedCount = collaborators.filter(
    (c) => c.status === "accepted" || c.status === "pending",
  ).length;
  const canInviteMore = acceptedCount < 5;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Share "{documentTitle}"
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Invite up to 4 people to collaborate
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 80px)" }}
        >
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Invite Section */}
          {canInviteMore ? (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Invite collaborators ({acceptedCount}/5)
              </label>
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && handleInvite()}
                  />
                </div>
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "editor" | "viewer")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={handleInvite}
                  disabled={!email || loading}
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Mail size={16} />
                  )}
                  Invite
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Editors can make changes. Viewers can only read.
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                Maximum collaborators reached (5/5)
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Remove a collaborator to invite someone new
              </p>
            </div>
          )}

          {/* Current Collaborators */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Who has access
            </label>
            <div className="space-y-2">
              {collaborators.map((collab) => (
                <div
                  key={collab.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {(collab.users?.full_name ||
                        collab.users?.email ||
                        "U")[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {collab.users
                          ? `${collab.users.first_name || ""} ${collab.users.last_name || ""}`.trim() ||
                            collab.users.email
                          : "User"}
                        {collab.role === "owner" && (
                          <span className="text-gray-500 ml-1">(You)</span>
                        )}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${getRoleColor(collab.role)}`}
                        >
                          {collab.role.charAt(0).toUpperCase() +
                            collab.role.slice(1)}
                        </span>
                        {getStatusBadge(collab.status)}
                      </div>
                    </div>
                  </div>
                  {collab.role !== "owner" && (
                    <button
                      onClick={() => handleRemove(collab.user_id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              {collaborators.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No collaborators yet. Invite someone to get started!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
