import React from "react"
import Modal from "react-modal"
import AlertIcon from "@mui/icons-material/ErrorOutlineOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"

Modal.setAppElement("#root")

interface ModalComponentProps {
  isOpen: boolean
  onRequestClose: () => void
  title: string
  content: string
  onSave: () => void
}

const PriceModal: React.FC<ModalComponentProps> = (props) => {
  const { isOpen, onRequestClose, title, content, onSave } = props

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={title}
      overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center"
      className="flex w-full min-w-[450px] max-w-xs flex-col rounded-xl bg-white p-4"
    >
      <div className="flex items-center justify-between border-b border-gray-300 pb-3">
        <span className="text-lg">
          <AlertIcon className="mr-2" /> {title} {/* 제목 표시 */}
        </span>
        <CloseIcon onClick={onRequestClose} style={{ cursor: "pointer" }} />
      </div>

      <div className="flex flex-col items-center p-2">
        <span className="my-4 text-xl">{content}</span>
        <input
          type="text"
          placeholder="금액 입력"
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
        />
        <div className="ml-5 mt-1 w-full pl-20 text-sm">
          <span className="text-gray-400">잔액 </span>
          <span className="text-gray-500"> 300,000 원</span>
        </div>
      </div>

      <div className="mt-4 flex w-full justify-center">
        <button
          onClick={onRequestClose} // 취소 버튼 클릭 시 모달 닫기
          className="rounded border border-primary-m1 bg-transparent px-4 py-2 text-primary-m1 hover:bg-primary-m1 hover:text-white"
        >
          취소
        </button>
        <button
          onClick={onSave}
          className="ml-6 rounded bg-primary-m1 px-4 py-2 text-white"
        >
          저장
        </button>
      </div>
    </Modal>
  )
}

export default PriceModal
