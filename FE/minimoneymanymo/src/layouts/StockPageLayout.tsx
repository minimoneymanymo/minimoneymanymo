import { useState } from "react";
import TradeForm from "@/components/trade/TradeForm"
import { Outlet } from "react-router-dom"

function StockPageLayout(): JSX.Element {
  const [closingPrice, setClosingPrice] = useState<number | null>(null);

  return (
    <div className="flex">
      <Outlet context={{ setClosingPrice }} /> {/* Outlet에 상태 변경 함수 전달 */}
      <TradeForm closingPrice={closingPrice} /> {/* closingPrice를 TradeForm에 전달 */}
    </div>
  )
}

export default StockPageLayout
