import ChildInfo from "@/components/child/ChildInfo"
import StockDashboard from "@/components/stock/StockDashboard"
import MainNewsLayout from "@/layouts/MainNewsLayout"
import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"

function MainPage(): JSX.Element {
  const child = useAppSelector(selectChild)

  return (
    <div>
      {child.userId && <ChildInfo />}

      {/* 뉴스 레이아웃 */}
      <MainNewsLayout />

      {/* 주식 대시보드 */}
      <StockDashboard />
    </div>
  )
}

export default MainPage
