import React from 'react'
import Modal from "@/components/modal/ModalIndex";
import Button from '../button/Button';
import { updateTradingFees } from '@/services/api/tradingService';

const TradingFeeModal = ({ isModalOpen, setIsModalOpen }) => {
  const [fees, setFees] = React.useState({
    yanciFee: "", ttbFee: "", csdFee: "", gseFee: "", secFee: "", depositFeePaystack: "",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFees((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async () => {
    setLoading(true);
    const payload = Object.fromEntries(
      Object.entries(fees).filter(([, v]) => v !== "").map(([k, v]) => [k, parseFloat(v)])
    );
    await updateTradingFees(payload);
    setLoading(false);
    setIsModalOpen(false);
  };

  const fields = [
    { label: "Yanci fee", name: "yanciFee" },
    { label: "TTB fee", name: "ttbFee" },
    { label: "CSD fee", name: "csdFee" },
    { label: "GSE fee", name: "gseFee" },
    { label: "SEC fee", name: "secFee" },
    { label: "Deposit fee (Paystack)", name: "depositFeePaystack" },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 z-50">
      <Modal
        title="Trading Fee"
        type="confirmation"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="w-[448px]"
      >
        <Modal.Content>
          <div>
            {fields.map(({ label, name }) => (
              <div key={name} className="flex items-center justify-between mb-6">
                <div className="text-sm text-primary-10">{label}</div>
                <input
                  type="number"
                  name={name}
                  value={fees[name]}
                  onChange={handleChange}
                  className="border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[10px]"
                />
              </div>
            ))}
            <p className="text-xs mb-3 text-primary-10">All values are per transaction and in percentage % unit.</p>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <Button onClick={() => setIsModalOpen(false)} className="w-[144px] h-[40px] bg-white text-[#35BAB2]">
            Cancel
          </Button>
          <Button onClick={handleApply} isLoading={loading} className="w-[144px] h-[40px]">Apply</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TradingFeeModal;
