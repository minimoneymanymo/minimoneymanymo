import { useAppSelector } from "@/store/hooks"
import { selectChild } from "@/store/slice/child"
import StockHeldSmallItem from "../stock/StockHeldSmallItem"
import { getStockApi } from "@/api/fund-api"
import { useEffect, useState, useRef } from "react"
import { StockHeld } from "@/types/stockTypes"
import ArrowPrev from "@mui/icons-material/ArrowBackIos"
import ArrowNext from "@mui/icons-material/ArrowForwardIos"
import Swal from "sweetalert2"

const ChildInfo: React.FC = () => {
  const child = useAppSelector(selectChild)
  const isVisible = child.userId !== ""
  const [stockList, setStockList] = useState<StockHeld[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchStockHeld = async () => {
      try {
        const res = await getStockApi()
        if (res.stateCode === 200) {
          setStockList(res.data)
        } else {
          //alert(res.message || "오류가 발생했습니다. 다시 시도해주세요.")
          Swal.fire({
            icon: "error",
            title: `오류가 발생했습니다. 다시 시도해주세요 : ${res.message}`,
            text: "Something went wrong!",
          })
        }
      } catch (error) {
        //console.error("API 호출 중 오류 발생:", error)
        Swal.fire({
          icon: "error",
          title: `API 호출 중 오류 발생 : ${error}`,
          text: "Something went wrong!",
        })
      }
    }

    fetchStockHeld()
  }, [])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -266, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 266, behavior: "smooth" })
    }
  }

  return (
    <div className="w-[1140px]">
      <div
        className={`mb-5 flex flex-row items-center rounded-3xl bg-tertiary-50 px-8 py-5 ${!isVisible ? "hidden" : ""}`}
      >
        <div className="mr-2 flex w-[280px] flex-col">
          <img
            className="mb-3 h-24 w-24 rounded-full object-cover"
            src={child.profileImgUrl || "/images/profile.jpg"}
            alt="프로필 이미지"
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
        <div className="relative flex w-[790px] flex-col">
          <b className="text-lg">보유주식</b>
          <div className="relative flex items-center">
            {stockList.length > 0 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-[-25px] z-10 p-2"
                >
                  <ArrowPrev
                    fontSize="inherit"
                    style={{ fontSize: "18px", color: "#B0B0B0" }}
                  />
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              className="flex w-full flex-row flex-nowrap overflow-x-hidden pb-1"
              style={{ scrollBehavior: "smooth" }}
            >
              {stockList.length > 0 ? (
                stockList.map((item, index) => (
                  <StockHeldSmallItem key={index} {...item} />
                ))
              ) : (
                <div className="h-[184px] pt-3 text-gray-500">
                  현재 보유한 주식이 없습니다. 주식을 한 번 구매해보세요! <br />
                  아직 보유한 주식이 없네요! 투자해보는 건 어떨까요?
                </div>
              )}
            </div>

            {stockList.length > 0 && (
              <>
                <button
                  onClick={scrollRight}
                  className="absolute right-[-25px] z-10 p-2"
                >
                  <ArrowNext
                    fontSize="inherit"
                    style={{ fontSize: "18px", color: "#B0B0B0" }}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChildInfo
