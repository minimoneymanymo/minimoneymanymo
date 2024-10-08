import { getMyChildAnalysisApi } from "@/api/analysis-api"
import { useChild } from "@/components/context/ChildContext"
import InvestmentMBTI from "@/components/investmentStyle/InvestmentMBTI"
import { AnalysisData } from "@/components/investmentStyle/types"
import { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"
import InvestmentStyle from "@/components/investmentStyle/InvestmentStyle"
import MyChildFeedback from "@/components/investmentStyle/MyChildFeedback"

const MyChildInvestStylePage = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null) // 초기값을 null로 설정
  const { child } = useChild()
  useEffect(() => {
    const fetchAnalysis = async () => {
      console.log("childrenId::::" + child?.childrenId)
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
        <div className="rounded-2xl bg-white p-6">
          {" "}
          {/* 수정된 부분 */}
          <InvestmentMBTI analysisData={analysisData} />
          {/* 수정된 부분 */}
          <MyChildFeedback analysisData={analysisData} />
        </div>
      </div>
      <Heading title="투자분석" />
      <div className="mt-4">
        <div className="rounded-2xl bg-white p-6">
          {" "}
          {/* 수정된 부분 */}
          <InvestmentStyle analysisData={analysisData} />
        </div>
      </div>
    </div>
  )
}

export default MyChildInvestStylePage
