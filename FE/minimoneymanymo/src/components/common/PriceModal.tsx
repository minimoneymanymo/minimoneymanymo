import React, { useState } from "react"
import Modal from "react-modal"
import AlertIcon from "@mui/icons-material/ErrorOutlineOutlined"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import { selectAccount } from "@/store/slice/account"
import { selectParent } from "@/store/slice/parent"
import { useAppSelector } from "@/store/hooks"

Modal.setAppElement("#root")

interface ModalComponentProps {
  isOpen: boolean
  title: string
  content: string
  balance: number
  onRequestClose: () => void
  onSave: (amount: number) => void
}

const PriceModal: React.FC<ModalComponentProps> = (props) => {
  const parent = useAppSelector(selectParent) // parent state 가져옴
  const account = useAppSelector(selectAccount)
  const { isOpen, title, content, balance, onRequestClose, onSave } = props
  const [inputValue, setInputValue] = useState<string>("") // 입력값을 상태로 관리

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  // 저장 버튼 클릭 핸들러
  const handleSave = () => {
    const amount = parseFloat(inputValue)
    if (!isNaN(amount)) {
      // TODO: 잔액보다 크면 안되게 하기
      if (amount > balance) alert("요청금액이 잔액보다 큽니다.")
      else onSave(amount)
    } else {
      alert("유효한 금액을 입력해주세요.")
    }
    setInputValue("")
  }

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
          value={inputValue} // 입력값을 상태에 바인딩
          onChange={handleInputChange} // 입력값 변경 핸들러 연결
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
        />
        <div className="ml-5 mt-1 w-full pl-20 text-sm">
          <span className="text-gray-400">잔액 </span>
          <span className="text-gray-500"> {balance.toLocaleString()} 원</span>
        </div>
      </div>

      <div className="mt-4 flex w-full justify-center">
        <button
          onClick={onRequestClose} // 취소 버튼 클릭 시 모달 닫기
          className="rounded-xl border border-primary-m1 bg-transparent px-4 py-2 text-primary-m1 hover:bg-primary-m1 hover:text-white"
        >
          취소
        </button>
        <button
          onClick={handleSave} // 저장 버튼 클릭 시 handleSave 호출
          className="ml-6 rounded-xl bg-primary-m1 px-4 py-2 text-white"
        >
          저장
        </button>
      </div>
    </Modal>
  )
}

export default PriceModal
