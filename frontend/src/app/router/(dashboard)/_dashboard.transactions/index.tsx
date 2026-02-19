/**
 * Example: Transactions page
 * - Viewing transactions is PUBLIC (no login required).
 * - "Thêm giao dịch" button requires auth → calls requireAuth() before opening.
 */
import { useState } from "react";
import { createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { requireAuth } from "@/shared/lib/require-auth";
import { Button } from "@/shared/ui/button";

export const Route = createFileRoute("/(dashboard)/_dashboard/transactions/")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [modalOpen, setModalOpen] = useState(false);

  function handleAddTransaction() {
    // Guard: redirect to /login?redirect=/transactions if not authenticated.
    // requireAuth() shows a toast automatically before navigating.
    if (!requireAuth({ navigate, from: pathname })) return;

    // User is authenticated — open the add-transaction modal / sheet
    setModalOpen(true);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Giao dịch</h1>

        {/* This button is visible to everyone, but triggers auth check on click */}
        <Button onClick={handleAddTransaction}>+ Thêm giao dịch</Button>
      </div>

      {/* Public transaction list rendered here regardless of auth state */}
      <p className="text-muted-foreground text-sm">
        Danh sách giao dịch (công khai — ai cũng xem được)
      </p>

      {/* Modal / Sheet would go here; only opened after requireAuth passes */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center">
          <div className="bg-white p-6 rounded-xl space-y-3 w-80">
            <h2 className="font-semibold">Thêm giao dịch</h2>
            <p className="text-sm text-muted-foreground">Form placeholder</p>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Đóng
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
