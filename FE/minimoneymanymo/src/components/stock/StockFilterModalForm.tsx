// StockFilterModalForm.tsx
import Modal from "react-modal"
import { StockModalSidebar } from "./StockModalSidebar"

Modal.setAppElement("#root")

interface StockFilter {
  marketType: string | null
  marketCapSize: string | null
}

interface StockFilterFormProps {
  open: boolean
  handleOpen: () => void
  filters: StockFilter // 타입 지정
  updateFilters: (filters: StockFilter) => void
}

export function StockFilterModalForm({
  open,
  handleOpen,
  filters,
  updateFilters,
}: StockFilterFormProps) {
  return (
    <Modal
      isOpen={open}
      onRequestClose={handleOpen}
      className="flex h-[500px] w-[800px] items-center justify-center rounded-3xl bg-white shadow-lg"
      overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div className="flex flex-col p-4">
        <button
          onClick={handleOpen}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* 사이드바를 통한 필터 설정 */}
        <StockModalSidebar filters={filters} updateFilters={updateFilters} />
      </div>
    </Modal>
  )
}
