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
    "자녀는 안정적인 투자를 추구하고 있으며, 리스크를 회피하는 경향이 있습니다. 너무 안전에만 치중하다 보면 성장을 놓칠 수 있다는 점을 강조해 주세요. 자녀에게 적절한 리스크를 감수하는 방법과 장기적인 투자 전략을 세우는 방법을 함께 이야기해 보세요. 자산 배분에 대해 교육하고, 조금씩 다양한 자산에 도전해보도록 격려해 주는 것도 좋습니다.",

  "화끈한 불사조":
    "자녀는 고위험 고수익을 추구하며 적극적인 투자 성향을 보입니다. 자녀에게 지나치게 공격적인 투자 전략이 때로는 큰 손실을 가져올 수 있음을 상기시켜 주시면 좋습니다. 리스크 관리의 중요성을 알려주고, 수익을 추구하면서도 손실을 최소화할 수 있는 방법에 대해 이야기해 주세요. 예를 들어, 이익 실현 시점을 정하거나, 손절매 기준을 미리 정해 놓는 방법을 설명해 주면 좋습니다.",

  "모험심 가득한 사자":
    "자녀는 모험심이 강한 투자자로, 장기적인 수익보다는 빠른 성과를 추구합니다. 자녀에게 단기적인 이익보다 장기적인 성장을 더 중요하게 생각해야 함을 설명해 주세요. 성과를 너무 조급하게 판단하지 않도록 격려하고, 꾸준히 공부하고 시장을 지켜보는 자세의 중요성을 강조해 주세요. 또한, 자산을 꾸준히 쌓아가는 습관이 결국 큰 성과로 이어질 수 있음을 알려주세요.",

  "성장하는 새싹":
    "자녀는 아직 투자 초기 단계지만, 꾸준히 성장 가능성을 보이고 있습니다. 실패를 두려워하지 말고, 꾸준히 배우고 경험을 쌓아가는 것이 중요하다는 점을 강조해 주세요. 다양한 투자 전략을 시도해 보고, 실수를 통해 배울 수 있는 기회를 제공해 주시면 좋습니다. 자녀에게 지속적인 학습과 함께 투자 일기를 쓰는 습관을 기르도록 도와주시는 것도 도움이 될 수 있습니다.",

  없음: "자녀의 투자 스타일이 아직 확정되지 않았습니다. 앞으로의 성장이 기대됩니다. 자녀가 다양한 투자 스타일을 경험해보고, 자신에게 맞는 전략을 찾을 수 있도록 격려해 주세요. 다양한 투자 방식을 시도해 보고 그에 대한 생각과 배움을 기록하도록 독려하면 좋습니다. 투자에 대한 자신감을 키울 수 있도록 작은 성공 경험을 만들어 주는 것도 좋은 방법입니다.",
}
const MyChildFeedback: React.FC<MyChildFeedbackProps> = ({ analysisData }) => {
  if (!analysisData || !analysisData.myStatistics) {
    return <div>데이터를 불러오는 중...</div>
  }

  const investmentType = analysisData.myStatistics.investmentType || "없음"

  return (
    <div className="mt-4 rounded-lg bg-gray-100 p-8">
      <div className="flex items-center">
        <HelpOutlineIcon className="mr-2" />
        <p className="text-lg font-semibold">추가 피드백</p>
      </div>
      <p className="mt-2">{feedbackDetails[investmentType]}</p>
    </div>
  )
}

export default MyChildFeedback
