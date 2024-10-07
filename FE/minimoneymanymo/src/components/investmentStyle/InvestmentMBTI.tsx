import React from "react"
import { AnalysisData } from "./types"
import Heading from "../common/Heading"
import { useAppSelector } from "@/store/hooks" // Redux 훅 사용
import { selectParent } from "@/store/slice/parent"
import { selectChild } from "@/store/slice/child" // 자녀 상태 가져오기

// InvestmentTypeKeys 타입 정의
type InvestmentTypeKeys =
  | "느긋한 거북이"
  | "화끈한 불사조"
  | "모험심 가득한 사자"
  | "성장하는 새싹"
  | "없음"

// 이미지 경로와 설명을 investmentType에 따라 설정
const investmentTypeDetails: Record<
  InvestmentTypeKeys,
  { image: string; title: string; description: (name: string) => string }
> = {
  "느긋한 거북이": {
    image: "/images/report/turtle.png",
    title: "느긋한 거북이",
    description: (name) =>
      `${name}은 안정적 보수 투자자!<br /> 느긋하게, 하지만 안전하게 자산을 불리는 걸 좋아하는 ${name}은 리스크를 크게 감수하지 않고, 손실도 적어요.<br /> 주식보다는 현금을 조금 더 많이 가지고 있어요.<br /> 천천히 가지만 확실한 방법으로 자산을 지켜내는 ${name}은 바로 거북이!`,
  },
  "화끈한 불사조": {
    image: "/images/report/phoenix.png",
    title: "화끈한 불사조",
    description: (name) =>
      `${name}은 고위험 고수익형 투자자!<br /> 큰 수익을 추구하며 공격적으로 투자하는 ${name}은 주식에 적극적으로 투자하고, 현금보다는 주식에 집중해요.<br /> 때로는 큰 손실을 보기도 하지만, 도전을 멈추지 않는 ${name}은 바로 불사조!`,
  },
  "모험심 가득한 사자": {
    image: "/images/report/lion.png",
    title: "모험심 가득한 사자",
    description: (name) =>
      `${name}은 모험심 가득한 투자자!<br /> 리스크를 감수하고 도전하지만, 아직 큰 수익을 내지는 못하는 ${name}.<br /> 그래도 계속해서 도전하고 있죠! 주식에 많이 투자하고, 현금은 적게 보유하는 ${name}은 모험을 즐기는 사자!`,
  },
  "성장하는 새싹": {
    image: "/images/report/sprout.png",
    title: "성장하는 새싹",
    description: (name) =>
      `${name}은 적극적 성장형 투자자!<br /> 현재는 큰 수익을 내지 못하고 있지만, 주식에 꾸준히 투자하며 미래를 준비하고 있어요.<br /> 손실을 적게 보고 리스크 관리를 잘하는 ${name}은 앞으로 크게 성장할 새싹이에요!`,
  },
  없음: {
    image: "/images/report/none.png",
    title: "아직 정해지지 않은 투자 스타일",
    description: (name) =>
      `${name}의 투자 스타일은 아직 정해지지 않았어요.<br /> 미니머니마니모와 함께 성장해요!`,
  },
}

interface InvestmentStyleProps {
  analysisData: AnalysisData | null
}

const InvestmentMBTI: React.FC<InvestmentStyleProps> = ({ analysisData }) => {
  const parent = useAppSelector(selectParent) // 부모 상태 확인
  const child = useAppSelector(selectChild) // 자녀 상태 확인

  if (!analysisData || !analysisData.myStatistics) {
    return <div>데이터를 불러오는 중...</div>
  }

  const investmentType =
    (analysisData.myStatistics.investmentType as InvestmentTypeKeys) || "없음"

  const name = analysisData.myStatistics.name
  const { image, title, description } = investmentTypeDetails[investmentType]

  return (
    <div className="flex h-96 w-full flex-col items-center justify-center text-center">
      <div className="flex flex-col items-center">
        <img src={image} alt={investmentType} className="mb-4 w-64" />
        <p className="text-lg font-semibold">{title}</p>
        <p
          className="text p-4"
          dangerouslySetInnerHTML={{ __html: description(name) }}
        />
      </div>
    </div>
  )
}

export default InvestmentMBTI
