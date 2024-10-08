import { getMyChildAnalysisApi } from "@/api/analysis-api"
import { useChild } from "@/components/context/ChildContext"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"
import ToggleList from "@/components/common/ToggleList" // ToggleList 임포트
import IndicatorDescriptions from "@/components/investmentStyle/IndicatorDescriptions" // 설명 컴포넌트 임포트
import InvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import MyChildFeedback from "@/components/investmentStyle/MyChildFeedback"

const MyChildInvestStylePage = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null) // 초기값을 null로 설정
  const { child } = useChild()

  console.log("⭐childrenId::::" + child?.childrenId)

  useEffect(() => {
    const fetchAnalysis = async () => {
      const res = await getMyChildAnalysisApi(child!.childrenId)
      if (res.data) {
        setAnalysisData(res.data)
        console.log(res.data)
      }
    }
    fetchAnalysis()
  }, [])

  return (
    <div className="mb-24 flex w-full flex-col space-y-4">
      <Heading title="투자성향" />
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-2 pb-6">
          {" "}
          <InvestmentMBTI analysisData={analysisData} />
          <div className="mt-12">
            <MyChildFeedback analysisData={analysisData} />
          </div>
        </div>
      </div>
      <Heading title="투자분석" />
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-6">
          {" "}
          <InvestmentStyle analysisData={analysisData} />
        </div>
      </div>
      <div className="mt-4">
        <ToggleList title="지표 상세 보기">
          <IndicatorDescriptions />
        </ToggleList>
      </div>
    </div>
  )
}

export default MyChildInvestStylePage
