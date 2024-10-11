import React from "react"
import { AnalysisData } from "./types"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"

// 피드백 타입 정의
interface MyChildFeedbackProps {
  analysisData: AnalysisData | null
}

// 자녀 투자 성향에 따른 피드백 정의
const feedbackDetails: Record<string, string> = {
  "느긋한 거북이":
    "자녀에게 자산의 보존과 안정성의 중요성을 가르치면서, 너무 보수적인 접근이 기회 손실을 초래할 수 있다는 점도 설명해주세요. 안전 자산만이 아니라, 중장기적 목표를 설정하여 일부 자산을 성장형 투자로 배분하는 방법을 교육하세요. 자산 다각화 전략과 위험 대비 수익의 개념을 함께 가르쳐 주는 것이 좋습니다.",

  "화끈한 불사조":
    "공격적인 투자 성향을 가진 자녀에게는 큰 손실을 감수할 준비가 되어 있을지라도, 리스크 대비 수익률을 분석하는 능력이 중요함을 가르쳐주세요. 높은 리스크를 감수할 때는 반드시 리스크 관리 전략을 함께 세워야 하며, 특히 분산 투자, 헤지 전략, 옵션 같은 고급 투자 기법을 통해 리스크를 완화할 수 있는 방법을 교육하세요. 고위험 투자에 대한 통제력과 위험 한도를 설정하는 습관을 길러주세요.",

  // "모험심 가득한 사자":
  //   "자녀는 모험심이 강한 투자자로, 장기적인 수익보다는 빠른 성과를 추구합니다. 자녀에게 단기적인 이익보다 장기적인 성장을 더 중요하게 생각해야 함을 설명해 주세요. 성과를 너무 조급하게 판단하지 않도록 격려하고, 꾸준히 공부하고 시장을 지켜보는 자세의 중요성을 강조해 주세요. 또한, 자산을 꾸준히 쌓아가는 습관이 결국 큰 성과로 이어질 수 있음을 알려주세요.",

  "신중한 바다 코끼리":
    "현금 비중을 높게 유지하는 자녀에게는 인플레이션과 기회비용에 대한 개념을 설명하며, 장기적으로 현금만 보유하는 것이 자산 가치를 훼손할 수 있음을 교육하세요. 리스크를 최소화하면서도 투자 기회를 활용할 수 있는 방법으로 채권, 배당주, 대체 자산 투자 등의 안전한 자산 활용법을 알려주어 리스크 관리 능력을 키워주세요.",

  "빠른 치타":
    "자녀가 기회를 빠르게 포착해 수익을 내는 능력을 강화하는 동시에, 지나치게 단기적인 시각을 피할 수 있도록 교육하세요. 자산을 빠르게 회전시키는 전략이 유효할 수 있지만, 시장 변동성에 취약할 수 있음을 알려주고, 장기적으로 안정적인 자산 배분 전략의 중요성을 가르쳐 주세요. 리스크 관리, 손절매 전략, 기술적 분석과 기본적 분석을 조합한 투자 방식을 함께 교육하는 것도 좋습니다.",

  "성장하는 새싹":
    "자녀가 리스크를 피하려는 경향이 있지만, 적절한 리스크 관리는 성장의 필수 요소임을 설명해주세요. 위험을 감수하면서도 보수적인 접근 방식을 유지할 수 있도록, 분산 투자와 복리의 효과에 대해 가르쳐주세요. 장기적으로 지속 가능한 성장을 목표로 하는 포트폴리오 구성의 중요성을 알려주세요.",

  없음: "자녀의 투자 스타일이 아직 확정되지 않았습니다. 앞으로의 성장이 기대됩니다. 자녀가 다양한 투자 스타일을 경험해보고, 자신에게 맞는 전략을 찾을 수 있도록 격려해 주세요. 다양한 투자 방식을 시도해 보고 그에 대한 생각과 배움을 기록하도록 독려하면 좋습니다. 투자에 대한 자신감을 키울 수 있도록 작은 성공 경험을 만들어 주는 것도 좋은 방법입니다.",
}
const MyChildFeedback: React.FC<MyChildFeedbackProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.myStatistics) {
    return <div>데이터를 불러오는 중...</div>
  }

  const investmentType = analysisData.myStatistics.investmentType || "없음"

  return (
    <div className="mt-4 rounded-lg bg-gray-50 p-8 shadow-md">
      <div className="flex items-center">
        <HelpOutlineIcon className="mr-2" />
        <p className="text-lg font-semibold">추가 피드백</p>
      </div>
      <p className="mt-2">{feedbackDetails[investmentType]}</p>
    </div>
  )
}

export default MyChildFeedback
