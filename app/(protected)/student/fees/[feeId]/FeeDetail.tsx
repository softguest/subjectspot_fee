// "use client";

// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import WaterLoader from "@/components/loaders/WaterLoader";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// type PayTarget =
//   | { type: "FULL" }
//   | { type: "INSTALLMENT"; installmentId: string };

// export default function FeeDetail({ feeId }: { feeId: string }) {
//   const [data, setData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [paying, setPaying] = useState<string | null>(null);

//   /* -------- PAYMENT MODAL STATE -------- */
//   const [showPayModal, setShowPayModal] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<
//     "BANK" | "MOMO" | null
//   >(null);
//   const [momoNumber, setMomoNumber] = useState("");
//   const [payTarget, setPayTarget] = useState<PayTarget | null>(null);

//   /* -------- FETCH DATA -------- */
//   useEffect(() => {
//     fetch(`/api/student/fees/${feeId}`)
//       .then((res) => res.json())
//       .then(setData)
//       .finally(() => setLoading(false));
//   }, [feeId]);

//   if (loading) return <WaterLoader label="Loading Fee Details..." />;
//   if (data.error) return <p>{data.error}</p>;

//   const { fee, installments, payments, totalPaid, balance, status } = data;

//   /* -------- HELPERS -------- */
//   function isInstallmentPaid(installmentId: string) {
//     return payments?.some(
//       (p: any) =>
//         p.installmentId === installmentId && p.status === "success"
//     );
//   }

//   function isInstallmentPending(installmentId: string) {
//     return payments?.some(
//       (p: any) =>
//         p.installmentId === installmentId && p.status === "pending"
//     );
//   }

//   /* -------- CONFIRM PAYMENT -------- */
//   async function handleConfirmPayment() {
//     if (!payTarget || !paymentMethod) return;

//     setShowPayModal(false);
//     setPaying("PROCESSING");

//     try {
//       /* FULL PAYMENT */
//       if (payTarget.type === "FULL") {
//         await fetch(`/api/student/fees/${fee.id}/pay`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: balance,
//             method: paymentMethod,
//             momoNumber:
//               paymentMethod === "MOMO" ? momoNumber : null,
//           }),
//         });
//       }

//       /* INSTALLMENT PAYMENT */
//       if (payTarget.type === "INSTALLMENT") {
//         const inst = installments.find(
//           (i: any) => i.id === payTarget.installmentId
//         );

//         await fetch(
//           `/api/student/installments/${payTarget.installmentId}/pay`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               amount: inst.amount,
//               method: paymentMethod,
//               momoNumber:
//                 paymentMethod === "MOMO" ? momoNumber : null,
//             }),
//           }
//         );
//       }

//       window.location.reload();
//     } catch (err) {
//       alert("Payment failed. Please try again.");
//       setPaying(null);
//     }
//   }

//   return (
//     <div className="space-y-6">

//       {/* -------- FEE SUMMARY -------- */}
//       <div className="border rounded p-4">
//         <h1 className="text-xl font-semibold">{fee.name}</h1>
//         <hr className="my-2" />
//         <p className="text-gray-600">{fee.term}</p>

//         <div className="text-white mt-4 p-2 bg-primary/70 space-y-1 rounded-md">
//           <p>
//             Total Fee: <b>{fee.totalAmount.toLocaleString()} XAF</b>
//           </p>
//           <p>
//             Paid: <b>{totalPaid.toLocaleString()} XAF</b>
//           </p>
//           <p>
//             Balance: <b>{balance.toLocaleString()} XAF</b>
//           </p>
//         </div>

//         <span
//           className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
//             status === "PAID"
//               ? "bg-green-100 text-green-700"
//               : status === "PARTIALLY PAID"
//               ? "bg-yellow-100 text-yellow-700"
//               : "bg-red-100 text-red-700"
//           }`}
//         >
//           {status}
//         </span>
//       </div>

//       {/* -------- INSTALLMENTS -------- */}
//       {installments.length > 0 && (
//         <div className="border rounded p-4">
//           <h2 className="font-semibold mb-3">Installments</h2>

//           <ul className="space-y-3">
//             {installments.map((inst: any) => {
//               const paid = isInstallmentPaid(inst.id);
//               const pending = isInstallmentPending(inst.id);

//               return (
//                 <li
//                   key={inst.id}
//                   className="flex justify-between items-center border p-3 rounded"
//                 >
//                   <div>
//                     <p className="font-medium">{inst.name}</p>
//                     <p className="text-sm text-gray-500">
//                       {inst.amount.toLocaleString()} XAF
//                     </p>
//                   </div>

//                   {paid ? (
//                     <span className="text-green-600 font-semibold">
//                       PAID
//                     </span>
//                   ) : pending ? (
//                     <span className="text-yellow-600 font-semibold border border-yellow-600/50 p-2">
//                       In Review
//                     </span>
//                   ) : (
//                     <Button
//                       size="sm"
//                       onClick={() => {
//                         setPayTarget({
//                           type: "INSTALLMENT",
//                           installmentId: inst.id,
//                         });
//                         setShowPayModal(true);
//                       }}
//                     >
//                       Pay
//                     </Button>
//                   )}
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       )}

//       {/* -------- FULL PAYMENT -------- */}
//       {status !== "PAID" && (
//         <Button
//           className="w-full"
//           onClick={() => {
//             setPayTarget({ type: "FULL" });
//             setShowPayModal(true);
//           }}
//         >
//           Pay Full Balance
//         </Button>
//       )}

//       {/* -------- PAYMENT MODAL -------- */}
//       <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Select Payment Method</DialogTitle>
//           </DialogHeader>

//           <div className="space-y-4">
//             <div className="flex gap-3">
//               <button
//                 className={`border rounded p-3 w-full ${
//                   paymentMethod === "BANK"
//                     ? "border-primary bg-primary/10"
//                     : ""
//                 }`}
//                 onClick={() => setPaymentMethod("BANK")}
//               >
//                 🏦 Bank (UBA)
//               </button>

//               <button
//                 className={`border rounded p-3 w-full ${
//                   paymentMethod === "MOMO"
//                     ? "border-primary bg-primary/10"
//                     : ""
//                 }`}
//                 onClick={() => setPaymentMethod("MOMO")}
//               >
//                 📱 Mobile Money
//               </button>
//             </div>

//             {paymentMethod === "MOMO" && (
//               <div className="space-y-2">
//                 <Label>Mobile Money Number</Label>
//                 <Input
//                   placeholder="6XXXXXXXX"
//                   value={momoNumber}
//                   onChange={(e) => setMomoNumber(e.target.value)}
//                 />
//               </div>
//             )}

//             {paymentMethod === "BANK" && (
//               <div className="bg-muted p-3 rounded text-sm">
//                 <p className="font-semibold">UBA Account Details</p>
//                 <p>Account Name: Your School Name</p>
//                 <p>Account Number: 20XXXXXXXXX</p>
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Use student name as payment reference
//                 </p>
//               </div>
//             )}

//             <Button
//               className="w-full cursor-pointer"
//               disabled={
//                 !paymentMethod ||
//                 (paymentMethod === "MOMO" && momoNumber.length < 9)
//               }
//               onClick={handleConfirmPayment}
//             >
//               Continue to Pay
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

  "use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import WaterLoader from "@/components/loaders/WaterLoader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PayTarget =
  | { type: "FULL" }
  | { type: "INSTALLMENT"; installmentId: string };

export default function FeeDetail({ feeId }: { feeId: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState<string | null>(null);

  /* -------- PAYMENT MODAL STATE -------- */
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    "BANK" | "MOMO" | null
  >(null);

  /* MOMO */
  const [momoNumber, setMomoNumber] = useState("");

  /* BANK */
  const [bankName, setBankName] = useState("UBA");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankReference, setBankReference] = useState("");

  const [payTarget, setPayTarget] = useState<PayTarget | null>(null);

  /* -------- FETCH DATA -------- */
  useEffect(() => {
    fetch(`/api/student/fees/${feeId}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [feeId]);

  if (loading) return <WaterLoader label="Loading Fee Details..." />;
  if (data.error) return <p>{data.error}</p>;

  const { fee, installments, payments, totalPaid, balance, status } = data;

  /* -------- HELPERS -------- */
  function isInstallmentPaid(installmentId: string) {
    return payments?.some(
      (p: any) =>
        p.installmentId === installmentId && p.status === "success"
    );
  }

  function isInstallmentPending(installmentId: string) {
    return payments?.some(
      (p: any) =>
        p.installmentId === installmentId && p.status === "pending"
    );
  }

  /* -------- CONFIRM PAYMENT -------- */
  async function handleConfirmPayment() {
    if (!payTarget || !paymentMethod) return;

    setShowPayModal(false);
    setPaying("PROCESSING");

    const payload = {
      method: paymentMethod,
      momoNumber:
        paymentMethod === "MOMO" ? momoNumber : null,
      bankDetails:
        paymentMethod === "BANK"
          ? {
              bankName,
              accountName,
              accountNumber,
              reference: bankReference,
            }
          : null,
    };

    try {
      /* FULL PAYMENT */
      if (payTarget.type === "FULL") {
        await fetch(`/api/student/fees/${fee.id}/pay`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: balance,
            ...payload,
          }),
        });
      }

      /* INSTALLMENT PAYMENT */
      if (payTarget.type === "INSTALLMENT") {
        const inst = installments.find(
          (i: any) => i.id === payTarget.installmentId
        );

        await fetch(
          `/api/student/installments/${payTarget.installmentId}/pay`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: inst.amount,
              ...payload,
            }),
          }
        );
      }

      window.location.reload();
    } catch (err) {
      alert("Payment failed. Please try again.");
      setPaying(null);
    }
  }

  return (
    <div className="space-y-6">

      {/* -------- FEE SUMMARY -------- */}
      <div className="border rounded p-4">
        <h1 className="text-xl font-semibold">{fee.name}</h1>
        <hr className="my-2" />
        <p className="text-gray-600">{fee.term}</p>

        <div className="text-white mt-4 p-2 bg-primary/70 space-y-1 rounded-md">
          <p>
            Total Fee: <b>{fee.totalAmount.toLocaleString()} XAF</b>
          </p>
          <p>
            Paid: <b>{totalPaid.toLocaleString()} XAF</b>
          </p>
          <p>
            Balance: <b>{balance.toLocaleString()} XAF</b>
          </p>
        </div>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded text-sm ${
            status === "PAID"
              ? "bg-green-100 text-green-700"
              : status === "PARTIALLY PAID"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      {/* -------- INSTALLMENTS -------- */}
      {installments.length > 0 && (
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-3">Installments</h2>

          <ul className="space-y-3">
            {installments.map((inst: any) => {
              const paid = isInstallmentPaid(inst.id);
              const pending = isInstallmentPending(inst.id);

              return (
                <li
                  key={inst.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <div>
                    <p className="font-medium">{inst.name}</p>
                    <p className="text-sm text-gray-500">
                      {inst.amount.toLocaleString()} XAF
                    </p>
                  </div>

                  {paid ? (
                    <span className="text-green-600 font-semibold">
                      PAID
                    </span>
                  ) : pending ? (
                    <span className="text-yellow-600 font-semibold border border-yellow-600/50 p-2">
                      In Review
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => {
                        setPayTarget({
                          type: "INSTALLMENT",
                          installmentId: inst.id,
                        });
                        setShowPayModal(true);
                      }}
                    >
                      Pay
                    </Button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* -------- FULL PAYMENT -------- */}
      {status !== "PAID" && (
        <Button
          className="w-full"
          onClick={() => {
            setPayTarget({ type: "FULL" });
            setShowPayModal(true);
          }}
        >
          Pay Full Balance
        </Button>
      )}

      {/* -------- PAYMENT MODAL -------- */}
      <Dialog open={showPayModal} onOpenChange={setShowPayModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Payment Method</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                className={`border rounded p-3 w-full ${
                  paymentMethod === "BANK"
                    ? "border-primary bg-primary/10"
                    : ""
                }`}
                onClick={() => setPaymentMethod("BANK")}
              >
                🏦 Bank (UBA)
              </button>

              <button
                className={`border rounded p-3 w-full ${
                  paymentMethod === "MOMO"
                    ? "border-primary bg-primary/10"
                    : ""
                }`}
                onClick={() => setPaymentMethod("MOMO")}
              >
                📱 Mobile Money
              </button>
            </div>

            {/* MOMO INPUT */}
            {paymentMethod === "MOMO" && (
              <div className="space-y-2">
                <Label>Your Mobile Money Number</Label>
                <Input
                  placeholder="6XXXXXXXX"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                />
              </div>
            )}

            {/* BANK INPUTS */}
            {paymentMethod === "BANK" && (
              <div className="space-y-3">
                <div className="bg-muted p-3 rounded text-sm">
                  <p className="font-semibold">UBA Account Details</p>
                  <p>Account Name: Your School Name</p>
                  <p>Account Number: 20XXXXXXXXX</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use student name as payment reference
                  </p>
                </div>
                <div>
                  <Label>Account Holder Name</Label>
                  <Input
                    placeholder="Student / Parent Name"
                    value={accountName}
                    onChange={(e) =>
                      setAccountName(e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={bankName}
                    onChange={(e) =>
                      setBankName(e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Account Number</Label>
                  <Input
                    placeholder="20XXXXXXXXX"
                    value={accountNumber}
                    onChange={(e) =>
                      setAccountNumber(e.target.value)
                    }
                  />
                </div>

                <div>
                  <Label>Payment Reference (optional)</Label>
                  <Input
                    placeholder="Student name / Fee term"
                    value={bankReference}
                    onChange={(e) =>
                      setBankReference(e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            <Button
              className="w-full"
              disabled={
                !paymentMethod ||
                (paymentMethod === "MOMO" &&
                  momoNumber.length < 9) ||
                (paymentMethod === "BANK" &&
                  (!accountName || !accountNumber))
              }
              onClick={handleConfirmPayment}
            >
              Continue to Pay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
