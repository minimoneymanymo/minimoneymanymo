import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import StockHeldSmallItem from "../stock/StockHeldSmallItem"
import { getStockApi } from "@/api/fund-api"
import { useEffect, useState } from "react"
import { StockHeld } from "@/types/stockTypes"

const ChildInfo: React.FC = () => {
  const child = useAppSelector(selectChild)
  const isVisible = child.userId !== ""
  const [stockList, setStockList] = useState<StockHeld[]>([])

  useEffect(() => {
    const fetchStockHeld = async () => {
      try {
        const res = await getStockApi()
        if (res.stateCode === 200) {
          console.log(res)
          setStockList(res.data)
        } else {
          if (res.message) {
            alert(res.message)
          } else {
            alert("오류가 발생했습니다. 다시 시도해주세요.")
          }
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
      }
    }

    fetchStockHeld()
  }, [])

  return (
    <div
      className={`mb-5 flex flex-row items-center rounded-3xl bg-tertiary-50 px-8 py-5 ${!isVisible ? "hidden" : ""}`}
    >
      <div className="mr-4 flex flex-[1] flex-col">
        <img
          className="mb-3 h-24 w-24 rounded-full object-cover"
          src={child.profileImgUrl || "/images/profile.jpg"}
          alt=""
        />
        <div className="flex w-full items-center justify-between pr-10">
          <span className="mr-5 text-lg font-bold">총 머니</span>
          <span>
            <span className="mr-2 text-xl font-bold text-tertiary-m4">₩</span>
            <span className="mr-2 text-2xl font-bold">
              {child.money.toLocaleString()}
            </span>
            머니
          </span>
        </div>
        <div className="mt-1 flex w-full items-center justify-between pr-10">
          <span className="mr-5 text-lg font-bold">출금 가능 금액</span>
          <span>
            <span className="mr-2 text-2xl font-bold">
              {child.withdrawableMoney.toLocaleString()}
            </span>
            원
          </span>
        </div>
      </div>
      <div className="flex flex-[3] flex-col">
        <b className="text-lg">보유주식</b>
        <div className="flex flex-row">
          {stockList.map((item, index) => (
            <StockHeldSmallItem key={index} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChildInfo
