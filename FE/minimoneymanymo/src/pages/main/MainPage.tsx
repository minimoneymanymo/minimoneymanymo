import StockDashboard from "@/components/stock/StockDashboard"
import MainNewsLayout from "@/layouts/MainNewsLayout"

function MainPage(): JSX.Element {
  return (
    <div>
      {/* 뉴스 레이아웃 */}
      <MainNewsLayout />

      {/* 주식 대시보드 */}
      <StockDashboard />
    </div>
  )
}

export default MainPage
