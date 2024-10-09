import React, { useState } from "react"
import CloseIcon from "@mui/icons-material/CloseOutlined"
import FaqToggle from "./FaqToggle"

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={handleOverlayClick}
    >
      {/* 모달 본체 */}
      <div className="fixed bottom-16 right-4 flex h-[80vh] w-[420px] max-w-full flex-col rounded-2xl bg-white p-4 shadow-2xl">
        <button
          className="absolute right-2 top-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
        <h2 className="text-lg font-semibold tracking-wider">사용법</h2>
        <p>하단의 탭을 클릭하여 사용 방법을 확인하세요!</p>

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
        <div className="hidden-scrollbar mt-4 flex-1 overflow-y-auto">
          {/* 탭에 따른 콘텐츠 */}
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
          <FaqToggle title="마니모 계좌는 무엇인가요?">
            <div className="p-2 text-gray-600">
              마니모 계좌는 자녀의 자금 관리에 사용되는 가상 계좌입니다.
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="자금 관련 용어에 대해 설명해주세요!">
            <div className="p-2 text-gray-600">
              <ul className="ml-4 list-disc p-0 text-gray-500">
                <li className="pb-1">
                  머니: 자녀의 모든 경제 활동이 이뤄지는 가상의 재화
                </li>
                <li className="pb-1">용돈: 자녀에게 지급되는 금액</li>
                <li className="pb-1">
                  출금 가능 금액: 월별 최대 출금할 수 있는 금액 <br />
                  금액을 <b>저장</b>하면 다음 달부터 적용되며,
                  <b> 즉시 반영</b> 시 현재 자녀의 출금 가능 금액이 입력된
                  금액으로 즉시 반영됩니다. <br />
                  또한, 출금 가능 금액은 매월 1일 자동으로 갱신되니
                  참고해주세요!
                </li>
                <li className="pb-1">
                  퀴즈 보상 머니: 뉴스 퀴즈를 맞추면 지급되는 머니
                </li>
                <li className="pb-1">
                  출금 요청: 자녀의 출금 요청을 승인하면 부모의 마니모 계좌에서
                  자녀의 연결 계좌로 금액이 송금됩니다.
                </li>
              </ul>
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="용돈은 어떻게 하면 더 얻을 수 있나요?">
            <div className="p-2 text-gray-600">
              첫 번째로 투자를 통해 수익을 낸 경우 얻을 수 있습니다. 두 번째로는
              보상을 통해 얻을 수 있어요! <br />
              뉴스 퀴즈를 풀거나 투자 이유를 통해 보상으로 머니를 얻을 수
              있답니다.
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="투자 성향 분석은 어떤 방식인가요?">
            <div className="p-2 text-gray-600">
              투자 성향은 투자 거래 내역을 바탕으로 분석됩니다. <br />
              투자 성향은 총 4가지로, 성장하는 새싹, 화끈한 불사조, 느긋한
              거북이, 모험심 가득한 사자가 있습니다.
              <br />
              <div className="mt-1">투자를 통해 자신의 성향을 알아보세요!</div>
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="매매할 때마다 이유를 꼭 써야하나요?">
            <div className="p-2 text-gray-600">
              네! 이유를 적으면서 투자 결정에 대해 더 깊이 생각해볼 수 있고,
              무분별한 투자를 막을 수 있어요. <br /> 또한, 투자 일기를 보며
              과거의 결정을 되돌아볼 수도 있답니다. <br />
              이를 통해 올바른 투자 습관을 기를 수 있도록 돕고 있어요!
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>
        <li>
          <FaqToggle title="실시간 거래가 아닌 이유가 있나요?">
            <div className="p-2 text-gray-600">
              저희 서비스는 청소년 투자 교육을 목표로 하고 있습니다. <br />
              따라서 국내 주식 장이 열리는 시간(8:30 ~ 15:30)에는 수업에 집중할
              수 있도록 실시간 데이터는 제공하지 않고 있습니다.
            </div>
          </FaqToggle>
          <hr className="w-full border-t border-gray-200" />
        </li>

        <li>
          <FaqToggle title="주식 현재 가격은 어떻게 정해진건가요?">
            <div className="p-2 text-gray-600">
              주식 가격은 한국투자증권 데이터를 사용하고 있습니다. 매일 오후 4시
              반에 당일 거래 종가로 가격이 업데이트 됩니다.
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
        <li className="mb-4">
          <div className="font-bold">계좌 등록</div>
          <div>
            마니모 계좌 충전에 사용할 실계좌를 등록해주세요.
            <div className="pt-1 text-sm text-gray-500">
              🔍 마이페이지 {">"} 내 계좌 관리 {">"} 계좌 관리 {">"} 계좌 연동
              연결
            </div>
          </div>
        </li>
        <li className="mb-4">
          <div className="font-bold">마니모 계좌 충전</div>
          <div>
            마니모 계좌에 돈을 충전해주세요.
            <br /> 충전된 금액은 자녀 자금 관리에 사용됩니다.
            <div className="pt-1 text-sm text-gray-500">
              🔍 마이페이지 {">"} 내 계좌 관리 {">"} 연결 계좌 정보 {">"} 충전
              연결
            </div>
          </div>
        </li>
        <li className="mb-4">
          <div className="font-bold">자녀 등록</div>
          대기 중인 자녀를 확인하고 수락해주세요.
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 나의 자녀 관리 {">"} 등록 대기중인 자녀
          </div>
        </li>
        <li className="mb-4">
          <div className="font-bold">자녀 별 자금 관리</div>
          <div className="pb-1">
            용돈, 출금 가능 금액, 퀴즈 보상 머니를 설정해주세요.
          </div>
          출금 요청 내역에는 자녀가 요청한 내역이 표시돼요!
          <br /> 요청을 승인하면 요청 금액이 마니모 계좌에서 자녀의 연결 계좌로
          입금됩니다.
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 나의 자녀 관리 {">"} 등록된 자녀 선택 {">"} 자금
            관리
          </div>
        </li>
        <li className="mb-2">
          <div className="font-bold">자녀 관리</div>
          자녀의 투자일기, 투자 성향을 통해 자녀의 투자 습관에 대해 확인할 수
          있습니다.
          <br />
          투자일기를 읽고 보상 머니를 지급해 자녀를 응원해주세요!
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 나의 자녀 관리 {">"} 등록된 자녀 선택 {">"} 투자
            성향 / 일기체크
          </div>
        </li>
      </ol>
    </div>
  )
}

const ChildContent = () => {
  return (
    <div>
      <ol className="list-decimal pl-5 text-gray-600">
        <li className="mb-4">
          <div className="font-bold">계좌 등록</div>
          <div>
            용돈 받을 때 사용할 실계좌를 등록해주세요.
            <div className="pt-1 text-sm text-gray-500">
              🔍 마이페이지 {">"} 마이 데이터 {">"} 나의 지갑 {">"} 계좌 연동
              연결
            </div>
          </div>
        </li>
        <li className="mb-4">
          <div className="font-bold">자금 관리</div>
          투자에 사용할 머니, 출금 가능 금액을 확인하세요. <br />
          뉴스 퀴즈를 풀면 머니를 더 받을 수 있어요! <br />
          또한, 투자 이유를 통해서도 보상을 받을 수 있답니다! <br />
          이유가 구체적이고 논리적일수록 더 많은 보상을 기대할 수 있겠죠?
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 마이 데이터
          </div>
        </li>
        <li className="mb-4">
          <div className="font-bold">매매 기능</div>
          투자를 통해 용돈을 더 많이 받아보세요. <br />
          실제 주식 데이터를 통해 거래할 수 있습니다. <br />잘 모르는 용어에
          마우스를 올리면 설명을 확인할 수 있어요!
        </li>
        <li className="mb-4">
          <div className="font-bold">뉴스 퀴즈</div>
          매일 뉴스 기사를 바탕으로 퀴즈가 제공됩니다!
          <br />
          뉴스를 읽는 습관을 기르고 보상도 받아보세요.
        </li>
        <li className="mb-4">
          <div className="font-bold">투자 성향</div>
          자신의 거래 내역을 바탕으로 투자 성향 분석 결과를 확인할 수 있어요!{" "}
          <br />
          투자 습관을 되돌아보고 더 나은 투자자가 되어보세요!
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 투자 성향
          </div>
        </li>
        <li>
          <div className="font-bold">투자 일기</div>
          매매 시 작성한 이유를 모아 일기처럼 확인할 수 있어요!
          <br />
          어떤 종목을 어떤 이유로 샀는지 되돌아볼 수 있습니다.
          <div className="pt-1 text-sm text-gray-500">
            🔍 마이페이지 {">"} 투자 일기
          </div>
        </li>
      </ol>
    </div>
  )
}

export default Modal
