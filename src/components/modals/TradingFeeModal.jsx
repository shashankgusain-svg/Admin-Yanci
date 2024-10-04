import React from 'react'
import Modal from "@/components/modal/ModalIndex";
import Button from '../button/Button';

const TradingFeeModal = ({isModalOpen,setIsModalOpen}) => {
  return (
    <div className="fixed bottom-10 left-1/2 z-50 ">
    <Modal
      title={`Trading Fee`}
      type="confirmation"
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      className={'w-[448px]'}
    >
      <Modal.Content>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-sm text-primary-10'>Yansi fee</div>
            <input
              type="number"
              id="searchBar"
              name="searchBar"

              className=" border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[10px]"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-sm text-primary-10'>TTB fee</div>
            <input
              type="number"
              id="searchBar"
              name="searchBar"

              className=" border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[5px]"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-sm text-primary-10'>CSD fee</div>
            <input
              type="number"
              id="searchBar"
              name="searchBar"

              className=" border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[5px]"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-sm text-primary-10'>GSE fee</div>
            <input
              type="number"
              id="searchBar"
              name="searchBar"

              className=" border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[5px]"
            />
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className='text-sm text-primary-10'>SEC fee</div>
            <input
              type="number"
              id="searchBar"
              name="searchBar"

              className=" border-primary-3 border-2 rounded-md w-[68px] py-[7px] px-[5px]"
            />
          </div>
          <p className='text-xs mb-3 text-primary-10'>All the values are per transaction and in percentage % unit.</p>
        </div>

      </Modal.Content>
      <Modal.Footer>
        <Button onClick={() => setIsModalOpen(false)} className={'w-[144px] h-[40px] bg-white text-[#35BAB2]'}>
          Cancel
        </Button>
        <Button className='w-[144px] h-[40px]'>Apply</Button>

      </Modal.Footer>
    </Modal>
  </div>
  )
}

export default TradingFeeModal
