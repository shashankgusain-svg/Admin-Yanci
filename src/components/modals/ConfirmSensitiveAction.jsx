import React, { useEffect, useState } from "react";
import Modal from "@/components/modal/ModalIndex";
import Button from "@/components/button/Button";

/**
 * Spec §8.4 sensitive action confirmation — reason required when requireReason.
 */
export default function ConfirmSensitiveAction({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm action",
  message = "This action will be recorded in the audit log.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  requireReason = true,
  destructive = false,
  isLoading = false,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const canSubmit = !requireReason || reason.trim().length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} message={message} type="confirmation">
      <div className="px-6 pb-6 flex flex-col gap-4">
        {requireReason ? (
          <label className="flex flex-col gap-2">
            <span className="text-body-2 font-medium text-navy">Reason</span>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-input border border-black-5 p-3 text-body-2 focus:outline-none focus:outline-2 focus:outline-primary-6"
              placeholder="Describe why you are taking this action"
            />
          </label>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button design="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            design="primary"
            style={destructive ? "negative" : undefined}
            disabled={!canSubmit || isLoading}
            isLoading={isLoading}
            onClick={() => onConfirm(requireReason ? reason.trim() : undefined)}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
