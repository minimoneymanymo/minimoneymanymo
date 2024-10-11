import React from "react"
import { AnalysisData } from "./types"
import Heading from "../common/Heading"
import { useAppSelector } from "@/store/hooks" // Redux 훅 사용
import { selectParent } from "@/store/slice/parent"
import { selectChild } from "@/store/slice/child" // 자녀 상태 가져오기

const getLastMonthEnd = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 0)
}

type InvestmentTypeKeys =
  | "느긋한 거북이"
  | "화끈한 불사조"
  // | "모험심 가득한 사자"
  | "성장하는 새싹"
  | "신중한 바다 코끼리"
  | "빠른 치타"
  | "없음"

const investmentTypeDetails: Record<
  InvestmentTypeKeys,
  { image: string; title: string; description: (name: string) => string }
> = {
  "느긋한 거북이": {
    image: "/images/report/turtle.png",
    title: "느긋한 거북이",
    description: (name) =>
      `${name}은 느긋하고 소극적인 투자자!<br /> 리스크를 최소화하고 안전하게 자산을 유지하려고 해요.<br /> 손실도 적고, 수익도 적으며, 현금을 많이 보유해요.<br /> ${name}은 천천히 자산을 보호하는 거북이!`,
  },
  "화끈한 불사조": {
    image: "/images/report/phoenix.png",
    title: "화끈한 불사조",
    description: (name) =>
      `${name}은 고위험 고수익형 투자자!<br /> 큰 수익을 추구하며 공격적으로 투자하는 ${name}은 주식에 집중적으로 투자해요.<br /> 큰 손실을 감수하면서도 도전을 멈추지 않는 ${name}은 바로 불사조!`,
  },
  // "모험심 가득한 사자": {
  //   image: "/images/report/lion.png",
  //   title: "모험심 가득한 사자",
  //   description: (name) =>
  //     `${name}은 모험심 가득한 투자자!<br /> 리스크를 감수하고 도전하지만, 아직 큰 수익을 내지는 못하는 ${name}.<br /> 그래도 계속해서 도전하고 있죠! 주식에 많이 투자하고, 현금은 적게 보유하는 ${name}은 모험을 즐기는 사자!`,
  // },
  "성장하는 새싹": {
    image: "/images/report/sprout.png",
    title: "성장하는 새싹",
    description: (name) =>
      `${name}은 조심스럽게 성장하는 투자자!<br /> 아직 큰 수익은 내지 못하고 있지만, 꾸준히 주식에 투자해 미래를 준비하는 ${name}은 앞으로 크게 성장할 가능성이 있어요!`,
  },
  "신중한 바다 코끼리": {
    image: "/images/report/walrus.png",
    title: "신중한 바다코끼리",
    description: (name) =>
      `${name}은 신중하고 보수적인 투자자!<br /> 손실은 많지만, 현금을 많이 보유해 리스크를 최소화하고 있어요.<br /> 안전하게 자산을 유지하며 위험을 관리하는 ${name}은 바다코끼리처럼 신중한 투자자!`,
  },
  "빠른 치타": {
    image: "/images/report/cheetah2.png",
    title: "빠른 치타",
    description: (name) =>
      `${name}은 빠르고 효율적인 투자자!<br /> 손실을 최소화하고, 빠르게 수익을 내는 ${name}은 기회를 빠르게 포착하는 투자 성향을 가지고 있어요.<br /> 목표를 정확히 달성하는 ${name}은 바로 치타!`,
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

  // 저번 달 말일 계산
  const lastMonthEndDate = getLastMonthEnd()
  const formattedDate = `${lastMonthEndDate.getFullYear()}년 ${lastMonthEndDate.getMonth() + 1}월 ${lastMonthEndDate.getDate()}일`

  return (
    <div className="relative flex h-96 w-full flex-col justify-center text-center">
      {/* 날짜를 우측 상단에 고정 */}
      <div className="absolute right-0 top-0 mb-4 text-sm text-gray-500">
        <p>{formattedDate} 기준 통계</p>
      </div>

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
