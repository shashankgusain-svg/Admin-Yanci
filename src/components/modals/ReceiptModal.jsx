import Button from "@/components/button/Button";
import Modal from "@/components/modal/ModalIndex";
import { formatGhs, recordedFee, recordedWhen, yanciIdOf } from "@/lib/adminView.mjs";

const personName = (row) => {
  if (row?.user) return `${row.user.firstName || ""} ${row.user.lastName || ""}`.trim();
  return row?.name || "";
};

export function receiptText(row, kind = "Transaction") {
  const amount = row?.amount ?? row?.totalTransactionAmount;
  const fee = recordedFee(row);
  const when = recordedWhen(row);
  const date = when ? new Date(when) : null;
  const lines = [
    "Yanci receipt",
    kind,
    `Name: ${personName(row) || "—"}`,
    `Yanci ID: ${yanciIdOf(row) || "—"}`,
    `Email: ${row?.user?.email || row?.email || "—"}`,
    `Date: ${date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : "—"}`,
    `Amount: ${amount === undefined || amount === null || amount === "" ? "—" : formatGhs(amount)}`,
    `Fee: ${fee === null ? "Not recorded" : formatGhs(fee)}`,
    `Status: ${row?.status || row?.paymentStatus || "—"}`,
    `Reference: ${row?.reference || row?.paystackReference || row?.transactionId || "—"}`,
  ];
  if (fee !== null && amount !== undefined && amount !== null && amount !== "" && !Number.isNaN(Number(amount))) {
    lines.push(`Amount after fee: ${formatGhs(Number(amount) - fee)}`);
  }
  return lines.join("\n");
}

export default function ReceiptModal({ row, kind, onClose }) {
  if (!row) return null;

  const download = () => {
    const blob = new Blob([receiptText(row, kind)], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `yanci-receipt-${yanciIdOf(row) || "transaction"}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Modal isOpen type="confirmation" title={`${kind} receipt`} onClose={onClose}>
      <Modal.Content>
        <pre className="whitespace-pre-wrap text-body-2 text-navy">{receiptText(row, kind)}</pre>
      </Modal.Content>
      <Modal.Footer>
        <Button design="secondary" className="h-9" onClick={onClose}>Close</Button>
        <Button design="primary" className="h-9" onClick={download}>Download</Button>
      </Modal.Footer>
    </Modal>
  );
}
