"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import WaterLoader from "@/components/loaders/WaterLoader";
import { FiClock } from "react-icons/fi";

export default function PaymentHistory() {
  const [payments, setPayments] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    fetch("/api/payments/history")
      .then((res) => res.json())
      .then(setPayments);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center space-x-2 text-2xl font-semibold mb-6"><div>Payment History</div> <div><FiClock /></div></div>
      <section className="max-w-5xl mx-auto px-4 py-10 py-12 bg-primary text-white rounded-md">
        <div className="px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center animate-fade-in">
            Student Payment History
          </h2>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          </div>
        </div>
      </section>
      <div className="mt-8">
        <table className="w-full border">
          <thead className="hidden md:table-header-group">
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Date</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
              <th className="text-left">Transaction</th>
              <th className="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr
                key={p.id}
                className="border-t block md:table-row mb-4 md:mb-0"
              >
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Date:{" "}
                  </span>
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Amount:{" "}
                  </span>
                  {p.amount.toLocaleString()} XAF
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Status:{" "}
                  </span>
                  {p.status}
                </td>
                <td className="p-2 block md:table-cell">
                  <span className="font-medium text-gray-600 md:hidden">
                    Transaction:{" "}
                  </span>
                  {p.momoTransactionId || "-"}
                </td>
                <td className="p-2 block md:table-cell space-x-2">
                  <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() =>
                      window.open(`/api/receipts/${p.id}`, "_blank")
                    }
                  >
                    Download
                  </Button>
                  {/* <a
                    href={`/api/receipts/${p.id}?preview=true`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn"
                  >
                    Preview
                  </a> */}
                   <Button
                      variant="secondary"
                      onClick={() => {
                        setSelectedId(p.id);
                        setPreviewLoading(true);
                        setPreviewOpen(true);
                      }}
                    >
                      Preview
                    </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {previewOpen && selectedId && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-[95%] max-w-5xl relative">

            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute right-0 top-3 text-2xl"
            >
              ✕
            </button>
            {previewLoading && (
              // <WaterLoader label="Loading..." />
              <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10 rounded-xl">
                <div className="flex flex-col items-center gap-2">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  <p className="text-sm text-gray-600">Loading receipt...</p>
                </div>
              </div>
            )}
            <iframe
              src={`/api/receipts/${selectedId}?preview=true`}
              onLoad={() => setPreviewLoading(false)}
              className="w-full h-[80vh] rounded border"
            />
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-end gap-2 mt-4">
                  {/* <Button
                    onClick={() => setPreviewOpen(false)}
                    className="absolute right-0 top-3 text-xl"
                  >
                    close
                  </Button> */}
                <Button
                  className="cursor-pointer"
                  variant="outline"
                  onClick={() =>
                    window.open(`/api/receipts/${selectedId}`, "_blank")
                  }
                >
                  Download
                </Button>
                <Button
                className="cursor-pointer"
                  onClick={() =>
                    document
                      .querySelector("iframe")
                      ?.contentWindow?.print()
                  }
                >
                  Print
                </Button>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
