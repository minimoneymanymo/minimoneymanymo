import React, { useState } from "react"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import FaqToggle from "./FAQToggle"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"p" | "c" | "f">("p") // 활성화된 탭 관리

  if (!isOpen) return null // 모달이 열려있지 않으면 아무것도 렌더링하지 않음

  // 모달 외부 클릭 시 모달 닫기 처리
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50" // 배경 딤 효과는 bg-black bg-opacity-30
      onClick={handleOverlayClick} // 배경 클릭 시 모달 닫기
    >
      {/* 반투명 배경 */}
      <div className="fixed bottom-16 right-4 h-[80vh] w-[400px] max-w-full rounded-2xl bg-white p-4 shadow-2xl">
        <button
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <h2 className="text-lg font-semibold">How to use</h2>
        하단의 탭을 클릭하여 사용 방법을 확인하세요!
        {/* 탭 버튼들 */}
        <div className="mt-4 flex border-b">
          <button
            className={`mr-4 pb-2 ${
              activeTab === "p"
                ? "border-b-2 border-secondary-m2 font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("p")}
          >
            부모
          </button>
          <button
            className={`mr-4 pb-2 ${
              activeTab === "c"
                ? "border-b-2 border-secondary-m2 font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("c")}
          >
            자녀
          </button>
          <button
            className={`pb-2 ${
              activeTab === "f"
                ? "border-b-2 border-secondary-m2 font-bold"
                : ""
            }`}
            onClick={() => setActiveTab("f")}
          >
            FAQ
          </button>
        </div>
        {/* 탭에 따른 컨텐츠 렌더링 */}
        <div className="hidden-scrollbar mt-4 h-[420px] overflow-auto">
          {/* 높이를 지정하고 스크롤 추가 */}
          {activeTab === "p" && <ParentContent />}
          {activeTab === "c" && <ChildContent />}
          {activeTab === "f" && <FAQContent />}
        </div>
      </div>
    </div>
  )
}

// FAQContent 컴포넌트 추가
const FAQContent: React.FC = () => {
  return (
    <div>
      <ul className="space-y-1">
        {/* 질문 간의 간격을 위해 space-y 추가 */}
        <li>
          <FaqToggle title="질문에 대한 답변을 어떻게 확인할 수 있나요?">
            <div className="p-2 text-gray-600">
              답변: 질문을 클릭하면 답변이 펼쳐집니다. 다시 클릭하면 답변이
              닫힙니다.
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="자녀 계좌 등록은 어떻게 하나요?">
            <div className="p-4 text-gray-600">
              답변: 마니모 앱에서 계좌번호와 은행을 선택한 후 1원 인증을 통해
              실계좌를 등록할 수 있습니다.
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="출금 가능 금액은 어떻게 설정하나요?">
            <div className="p-4 text-gray-600">
              답변: 자녀 별 출금 가능 금액을 설정하고 저장 버튼을 누르면 다음
              달부터 적용됩니다. 즉시 반영을 선택하면 즉시 적용됩니다.
            </div>
          </FaqToggle>
        </li>
        {/* 추가적인 FAQ 내용들 */}
      </ul>
    </div>
  )
}
const ParentContent = () => {
  return (
    <div>
      <ol className="list-decimal pl-5 text-gray-600">
        <li className="mb-2">
          <div className="font-bold">계좌 등록</div>
          <span className="text-sm text-gray-500">
            마니모 계좌 충전에 사용할 실계좌를 등록해주세요.
            <br /> 계좌번호와 은행 선택 후 1원 인증을 통해 등록할 수 있습니다.
            <br /> <b>마니모 계좌</b>는 자녀의 자금 관리에 사용되는 가상
            계좌입니다.
          </span>
        </li>
        <li className="mb-2">
          <div className="font-bold">마니모 계좌 충전</div>
          <span className="text-sm text-gray-500">
            마니모 계좌에 충전해주세요.
            <br /> 충전된 금액은 용돈, 보상 머니 등 자녀 자금 관리에 사용됩니다.
            <br /> <b>마니모 계좌</b>는 자녀의 자금 관리에 사용되는 가상
            계좌입니다.
          </span>
        </li>
        <li className="mb-2">
          <div className="font-bold">자녀 등록</div>
          <span className="text-sm text-gray-500">
            대기 중인 자녀를 확인하고 수락해주세요.
          </span>
        </li>
        <li className="mb-2">
          <div className="font-bold">자녀 별 자금 관리</div>

          <ul className="list-disc pl-5 text-sm text-gray-500">
            <li className="pb-1">용돈: 자녀에게 지급되는 금액</li>
            <li className="pb-1">
              출금 가능 금액: 월별 최대 출금할 수 있는 금액 <br />
              금액을 <b>저장</b>하면 다음 달부터 적용되며,
              <b> 즉시 반영</b> 시 현재 자녀의 출금 가능 금액이 입력된 금액으로
              즉시 반영됩니다. <br />
              출금 가능 금액은 매월 1일 자동으로 갱신됩니다.
            </li>
            <li className="pb-1">
              퀴즈 보상 머니: 뉴스 퀴즈를 맞추면 보상으로 머니가 지급됩니다.
            </li>
            <li className="pb-1">
              출금 요청: 자녀의 출금 요청을 승인하면 부모의 마니모 계좌에서
              자녀의 연결 계좌로 금액이 송금됩니다.
            </li>
          </ul>
        </li>
        <li className="mb-2">
          <div className="font-bold">자녀 관리</div>
          <ul className="list-disc pl-5 text-sm text-gray-500">
            <li>
              투자 일기: 일기를 읽고 일기에 따른 보상 머니를 지급할 수 있습니다.
            </li>
            <li>투자 성향</li>
          </ul>
        </li>
      </ol>
    </div>
  )
}

const ChildContent = () => {
  return (
    <div>
      <ol className="list-decimal pl-5 text-gray-600">
        <li className="mb-2">
          <div className="font-bold">계좌 등록</div>
          <span className="text-sm text-gray-500">
            계좌번호와 은행 선택 후 1원 인증을 통해 실계좌를 등록해주세요.
          </span>
        </li>
        <li className="mb-2">
          <div className="font-bold">자금 관리</div>
          <ul className="list-disc pl-5 text-sm text-gray-500">
            <li className="pb-1">용돈: 부모님에게서 받는 용돈</li>
            <li className="pb-1">
              출금 가능 금액: 월별 최대 출금할 수 있는 금액 <br />
              용돈을 기반으로 투자를 해 돈을 더 불려보세요!
            </li>
            <li className="pb-1">
              퀴즈 보상 머니: 뉴스 퀴즈를 맞추면 보상으로 머니가 지급돼요!
            </li>
            <li className="pb-1">
              투자 이유 보상 머니: 투자 이유를 부모님이 보고 보상으로 머니를
              지급해요. <br />
              이유가 구체적이고 논리적일수록 더 많은 보상을 받을 수 있습니다!
            </li>
          </ul>
        </li>
        <li>
          <div className="font-bold">매매 기능</div>
          <span className="text-sm text-gray-500">
            실제 주식 데이터를 통해 주식 투자 경험을 쌓아보세요!
            <br /> 매일 4시 반 기준으로 당일 주식 종가로 매매할 수 있습니다.{" "}
            <br />
            매매 시 이유를 적어 투자에 대해 신중히 생각해볼 수 있어요!
          </span>
        </li>
        <li>
          <div className="font-bold">뉴스 퀴즈</div>
          <span className="text-sm text-gray-500">
            매일 뉴스 기사를 바탕으로 퀴즈가 제공됩니다!
            <br />
            뉴스를 읽는 습관을 기르고 보상도 받아보세요.
          </span>
        </li>
        <li>
          <div className="font-bold">투자 성향</div>
          <span className="text-sm text-gray-500">
            자신의 거래 내역을 바탕으로 투자 성향 및 투자 MBTI를 확인할 수
            있어요! <br />
            자신의 투자 습관을 되돌아보고 더 나은 투자자가 되어보세요!
          </span>
        </li>
        <li>
          <div className="font-bold">투자 일기</div>
          <span className="text-sm text-gray-500">
            매매 시 작성한 이유를 모아 일기처럼 확인할 수 있어요!
            <br />
            어떤 종목을 어떤 이유로 샀는지 되돌아볼 수 있습니다.
          </span>
        </li>
      </ol>
    </div>
  )
}

export default Modal
