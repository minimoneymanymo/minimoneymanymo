import { getStockApi, getTradeListApi } from "@/api/fund-api"
import RecordForm from "@/components/child/RecordForm"
import Heading from "@/components/common/Heading"
import StockHeldItem from "@/components/stock/StockHeldItem"
import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import { MoneyInfoProps, RecordItemProps } from "@/types/accountTypes"
import { StockHeld } from "@/types/stockTypes"
import React, { useEffect, useState } from "react"

function ChildStockPage(): JSX.Element {
  const child = useAppSelector(selectChild) // parent state 가져옴
  const [stockList, setStockList] = useState<StockHeld[]>([])
  const [tradeList, setTradeList] = useState<RecordItemProps[]>([])

  useEffect(() => {
    // 보유주식, 거래내역
    const fetchStockHeld = async () => {
      try {
        const res = await getStockApi()
        if (res.stateCode === 200) {
          console.log(res)
          setStockList(res.data)
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
      }
    }

    const fetchTradeList = async () => {
      try {
        const res = await getTradeListApi(2024, 10)
        if (res.stateCode === 200) {
          console.log(res)
          setTradeList(res.data)
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
      }
    }

    fetchStockHeld()
    fetchTradeList()
  }, [])
  return (
    <>
      <MoneyInfo {...child} />
      <Heading title="나의 주식" />
      <div className="grid grid-cols-2 gap-5 py-6">
        {stockList.map((stock) => (
          <StockHeldItem key={stock.stockCode} {...stock} />
        ))}
      </div>
      <Heading title="나의 거래 기록" />
      <div className="p-3">
        거래 내역을 클릭하면 더 많은 정보와 매매 이유를 볼 수 있습니다.
      </div>

      <RecordForm data={tradeList} isMoneyList={false} />
    </>
  )
}

const MoneyInfo: React.FC<MoneyInfoProps> = ({ money, withdrawableMoney }) => {
  return (
    <div className="relative my-4 flex flex-row items-center rounded-3xl bg-tertiary-50 p-8 text-xl">
      <img
        src="/images/gold-pig.svg" // 이미지 경로 설정
        className="absolute h-[80px] w-[80px] object-contain"
      />
      <div className="ml-28 font-bold">
        내 머니 <span className="mx-5 text-tertiary-m4">₩</span>
        {money.toLocaleString()} 머니
      </div>
      <div className="ml-auto">
        {/* ml-auto를 사용하여 오른쪽으로 밀어줍니다 */}
        이번 달 <b className="ml-2 mr-8">출금가능금액</b>
        <b>{withdrawableMoney.toLocaleString()} </b>원
      </div>
    </div>
  )
}

export default ChildStockPage
