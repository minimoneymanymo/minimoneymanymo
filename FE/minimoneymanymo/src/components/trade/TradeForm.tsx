import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Card, Button } from "@material-tailwind/react"

import { postTrade, getChildMoney } from "@/api/trade-api"
import { getStockApi } from "@/api/fund-api"
import { tradeData } from "./tradeData"
import { useAppDispatch } from "@/store/hooks"
import { setMemberInfo } from "@/utils/user-utils"

// closingPrice를 props로 받기 위해 인터페이스 정의
interface TradeFormProps {
  closingPrice: number | null // closingPrice가 null일 수도 있으므로 타입 지정
}

interface CustomError extends Error {
  data?: {
    message: string
  }
}

function TradeForm({ closingPrice }: TradeFormProps): JSX.Element {
  const { stockCode } = useParams() // useParams로 stockCode 가져오기
  const [isBuyMode, setIsBuyMode] = useState<boolean>(true)
  const dispatch = useAppDispatch()

  //매수 시 사용
  const [money, setMoney] = useState<number | null>(null) // 보유머니
  const [inputMoney, setInputMoney] = useState<number>(0) // 매수할 머니
  const [tradeShares, setTradeShares] = useState<number>(0) // 머니 환산 주수 (매수할 머니 / 현재가)
  const [remainingMoney, setRemainingMoney] = useState<number | null>(null) // 매수 후 잔액 (남은 머니 : 보유머니 - 매수할 머니)
  const [reason, setReason] = useState<string>("") // 매매 이유
  const maxShares = closingPrice
    ? Math.floor(((money || 0) / closingPrice) * 1e7) / 1e7
    : 0 // 최대 구매 가능 주 수

  // 매도 시 사용
  const [remainSharesCount, setRemainSharesCount] = useState<number>(0) // 보유 주식 수
  const [sellShares, setSellShares] = useState<string>("") // 매도 주수
  const [sellMoney, setSellMoney] = useState<number>(0) // 매도 머니
  const [profitLoss, setProfitLoss] = useState<string>("") // 손익가격 : ( 현재가 - 평단 ) * 매도주수

  useEffect(() => {
    const fetchGetStockData = async () => {
      if (remainSharesCount <= 0) {
        setProfitLoss("계산할 수 있는 주식이 없습니다. ")
      }

      try {
        const userStockData = await getStockApi()

        const matchedStock = userStockData.data.find(
          (stock: any) => stock.stockCode === stockCode
        )

        if (matchedStock) {
          const averagePrice = matchedStock.averagePrice
          console.log(averagePrice)
          // 입력된 매도 주식 수를 숫자로 변환
          const sellSharesNumber = parseFloat(sellShares)

          // 손익 계산: (현재가 - 평균가) * 매도할 주식 수
          if (!isNaN(sellSharesNumber) && closingPrice !== null) {
            const profitLossValue =
              (closingPrice - averagePrice) * sellSharesNumber
            setProfitLoss(profitLossValue.toLocaleString()) // 손익 가격을 포맷하여 저장
          }
        } else {
          setProfitLoss("매도할 수 있는 값이 없습니다.")
        }
      } catch (error) {
        console.error("Error fetching stock data:", error)
        setProfitLoss("데이터를 불러오는 중 오류가 발생했습니다.")
      }
    }

    if (sellShares) {
      fetchGetStockData()
    }
  }, [sellShares, closingPrice, stockCode])

  // API 호출하여 보유 머니 가져오기
  const loadMoney = useCallback(async () => {
    if (!stockCode) {
      console.error("stockCode is missing")
      return
    }

    try {
      const data = await getChildMoney(stockCode)
      console.log(data)
      setMoney(data.data.money)
      setRemainSharesCount(data.data.remainSharesCount)
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to load money:", error)
        // 타입 단언 사용
        const customError = error as CustomError
        alert(customError.data?.message || "알 수 없는 오류가 발생했습니다.")
      } else {
        console.error("Trade failed:", error)
      }
    }
  }, [stockCode]) // stockCode를 의존성으로 설정

  useEffect(() => {
    loadMoney()
  }, [loadMoney])

  // 입력된 금액에 따른 주 수와 잔액 계산
  useEffect(() => {
    if (closingPrice) {
      if (inputMoney > 0) {
        const shares = Math.floor((inputMoney / closingPrice) * 1e7) / 1e7 // closingPrice 사용
        setTradeShares(shares)
      } else {
        setTradeShares(0) // ***** 추가: inputMoney가 0일 경우 tradeShares를 0으로 설정
      }
      if (money !== null) {
        setRemainingMoney(money - inputMoney)
      }
    }
  }, [inputMoney, money, closingPrice])

  // 입력된 매도 주 수에 따른 매도 금액 계산
  useEffect(() => {
    if (closingPrice !== null && closingPrice > 0 && sellShares !== "") {
      const calculatedSellMoney =
        Math.floor(closingPrice * Number(sellShares) * 1e7) / 1e7
      setSellMoney(calculatedSellMoney)
    } else {
      setSellMoney(0)
    }
  }, [sellShares, closingPrice])

  // 매매 함수
  const handleTrade = async () => {
    if (!stockCode) {
      // stockCode가 없으면 처리하지 않음
      console.error("stockCode is missing")
      return
    }

    // 유효성 검사 추가
    if (isBuyMode) {
      if (inputMoney <= 0 || tradeShares <= 0) {
        alert("0 이상의 매수 금액과 주 수를 입력하세요.")
        return
      }
    } else {
      if (sellShares === "" || Number(sellShares) <= 0) {
        alert("0 이상의 매도 주 수를 입력하세요.")
        return
      }
    }

    // reason 유효성 검사 추가
    if (reason.trim() === "") {
      alert("거래 이유를 입력해 주세요.")
      return
    }

    const tradeDataObj: tradeData = {
      stockCode, // useParams에서 가져온 stockCode 사용
      amount: isBuyMode ? inputMoney : sellMoney,
      tradeSharesCount: isBuyMode
        ? Number(tradeShares.toFixed(6))
        : Number(Number(sellShares).toFixed(6)), // sellShares도 숫자로 변환 후 처리
      reason,
      tradeType: isBuyMode ? "4" : "5",
    }

    try {
      const result = await postTrade(tradeDataObj)
      console.log("거래 성공", result)

      setInputMoney(0)
      setTradeShares(0)
      setReason("") // textarea 초기화

      // 매도 모드일 때 주수 입력창 초기화
      if (!isBuyMode) {
        setSellShares("") // 매도 주수 입력창 초기화
      }

      alert("거래가 성공적으로 완료되었습니다!")
      await loadMoney()
      await setMemberInfo(dispatch, 1)
      console.log("🎅🤶👼🧔👲")
    } catch (error) {
      if (error instanceof Error) {
        console.error("Trade failed:", error.message) // 오류 메시지 출력
        alert("거래에 실패했습니다: " + error.message) // 사용자에게 오류 메시지 표시
      } else {
        console.error("Trade failed: 알 수 없는 오류 발생", error) // 알 수 없는 오류 처리
        alert("거래에 실패했습니다: 알 수 없는 오류 발생") // 사용자에게 알 수 없는 오류 메시지 표시
      }
    }
  }

  // isBuyMode가 변경될 때마다 값 출력
  useEffect(() => {
    console.log(`Buy mode activated: ${isBuyMode}`)
  }, [isBuyMode])

  return (
    <div className="relative flex h-full w-[340px] flex-col p-2">
      {/* 매수매도 버튼 */}
      <div className="absolute mt-14 flex h-[80px] w-[310px] justify-end space-x-4">
        <Button
          className="z-10 h-16 bg-buy pb-6"
          onClick={() => setIsBuyMode(true)}
          style={{ paddingTop: "0.1px" }}
        >
          매수
        </Button>
        <Button
          className="z-10 h-16 bg-sell pb-6 pt-4"
          style={{ paddingTop: "0.1px" }}
          onClick={() => {
            setIsBuyMode(false) // 매도 모드로 변경
            // remainSharesCount를 체크하여 조건에 맞는 경우 setProfitLoss 호출
            if (remainSharesCount <= 0) {
              setProfitLoss("매도할 주식이 없습니다.") // 메시지 설정
            } else {
              setProfitLoss("매도할 주수를 입력해주세요")
            }
          }}
        >
          매도
        </Button>
      </div>
      {/* 매매 카드 */}
      {/* 매매 카드 */}
      {/* 매매 카드 */}
      <div className="absolute">
        <Card className="shadow-blue-gray-900/5 z-20 mt-24 h-[520px] w-[330px] max-w-md border p-0 px-5 py-6">
          {/* 매수 모드 카드 */}
          {/* 매수 모드 카드 */}
          {/* 매수 모드 카드 */}
          {isBuyMode ? (
            <>
              <div className="flex w-full items-end justify-between">
                <p className="text-base-16 text-left">현재가</p>
                <p className="ml-2 text-right text-lg">
                  {closingPrice !== null
                    ? closingPrice.toLocaleString()
                    : "현재가를 불러올 수 없습니다"}{" "}
                  머니
                </p>
              </div>
              <div className="flex w-full items-end justify-between">
                <p className="text-base-16 text-left">보유 머니</p>
                <p className="text-right text-lg">
                  {money !== null && money !== undefined
                    ? money.toLocaleString()
                    : "로딩 중..."}{" "}
                  머니
                </p>
              </div>
              <p className="availablePurchaseShares mb-1 text-right text-sm text-gray-300">
                최대 {maxShares.toFixed(6)} 주 매수 가능
              </p>
              {/* <br /> */}
              <div className="flex items-center">
                <input
                  type="tel"
                  className="w-full appearance-none rounded bg-gray-300 px-2 py-1 text-black placeholder-white"
                  value={
                    inputMoney === 0 ? "" : inputMoney.toLocaleString("ko-KR")
                  } // 숫자 세 자리마다 쉼표
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const onlyNumbers = e.target.value.replace(/\D/g, "") // 숫자 이외의 값 제거
                    setInputMoney(Number(onlyNumbers)) // 상태 업데이트
                  }}
                  onKeyDown={(e) => {
                    if (
                      !/^[0-9]$/.test(e.key) && // 숫자키가 아닌 경우
                      e.key !== "Backspace" && // 백스페이스 허용
                      e.key !== "ArrowLeft" && // 왼쪽 화살표 허용
                      e.key !== "ArrowRight" // 오른쪽 화살표 허용
                    ) {
                      e.preventDefault() // 그 외의 입력을 막음
                    }
                  }}
                  placeholder="매수할 머니"
                  style={{
                    height: "36px",
                    maxHeight: "35px",
                    overflow: "hidden",
                  }} // 높이 35px로 설정
                />
              </div>
              <div className="flex w-full items-end justify-end text-right">
                <p className="text-right underline">
                  {tradeShares.toFixed(6)}{" "}
                </p>
                <p className="ml-1 mt-1">주</p>
              </div>
              <div className="mb-2 flex w-full items-end justify-between">
                <p className="text-left text-base">매수 후 잔액</p>
                {/* 이 부분 */}
                <p className="text-right text-base">
                  {remainingMoney !== null && remainingMoney !== undefined
                    ? remainingMoney.toLocaleString()
                    : "로딩 중..."}{" "}
                  머니
                </p>
              </div>

              <input
                type="tel"
                className="h-[200px] w-full rounded bg-gray-300 p-4 text-black placeholder-white"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReason(e.target.value)
                }
                placeholder="매수를 생각하게 된 이유를 적어주세요!"
              />
            </>
          ) : (
            <>
              {/********** 매도 모드일 때 ***********/}
              {/********** 매도 모드일 때 ***********/}
              <div className="flex w-full items-end justify-between">
                <p className="text-base-16 text-left">현재가</p>
                <p className="ml-2 text-right text-lg">
                  {closingPrice !== null
                    ? closingPrice.toLocaleString()
                    : "현재가를 불러올 수 없습니다"}{" "}
                  머니
                </p>
              </div>
              <div className="flex w-full items-end justify-between">
                <p className="text-base-16 text-left">보유 주식</p>
                <p className="text-right text-lg">
                  {remainSharesCount.toFixed(6)} 주
                </p>
              </div>
              <p className="availablePurchaseShares mb-1 text-right text-sm text-gray-300">
                최대 {remainSharesCount.toFixed(6)} 주 매도 가능
              </p>
              <div className="flex items-center">
                <input
                  type="tel"
                  className="sellSharesInputBox w-full appearance-none rounded bg-gray-300 px-2 py-1 text-black placeholder-white"
                  value={sellShares} // 기존의 sellShares 값 사용
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value

                    // 유효한 숫자 형식(정수 또는 소수점 포함)을 확인하고, 소수점 뒤 최대 6자리 허용
                    if (/^\d*\.?\d{0,6}$/.test(value) || value === "") {
                      setSellShares(value) // 입력값이 유효하면 상태에 저장
                    }
                    // sellShares가 빈 문자열이 되면 예상 손익과 매도 금액 초기화
                    if (value === "") {
                      setSellMoney(0) // 매도 금액 초기화
                      setProfitLoss("매도할 주수를 입력해주세요") // 예상 손익 초기 메시지로 설정
                    }
                  }}
                  placeholder="매도할 주 수"
                  style={{
                    height: "36px",
                    maxHeight: "35px",
                    overflow: "hidden",
                  }} // 높이 35px로 설정
                />
              </div>
              <div className="flex w-full items-end justify-end">
                <p className="sellMoney text-right underline">
                  {sellMoney.toLocaleString()}
                </p>
                <p className="ml-1 mt-1">머니</p>
              </div>
              <div className="mb-2 flex w-full items-end justify-between">
                <p className="text-left text-base">예상손익머니</p>
                <p
                  className={`text-right text-base ${Number(profitLoss) >= 0 ? "buy" : "sell"}`}
                >
                  {Number(profitLoss) >= 0
                    ? `+${profitLoss.toLocaleString()}`
                    : `${profitLoss.toLocaleString()}`}
                </p>
              </div>

              <input
                type="tel"
                className="h-[200px] w-full rounded bg-gray-300 p-4 text-black placeholder-white"
                value={reason}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setReason(e.target.value)
                }
                placeholder="매도를 생각하게 된 이유를 적어주세요!"
              />
            </>
          )}
          <p className="warning mb-1 mb-2 mt-0.5 p-2 text-right text-xs text-red-500">
            투자의 책임은 본인에게 있습니다.
          </p>
          <Button
            className={isBuyMode ? "bg-buy" : "bg-sell"}
            text-white="true"
            onClick={() => handleTrade()}
          >
            {isBuyMode ? "매수하겠습니다" : "매도하겠습니다"}
          </Button>
        </Card>
      </div>
    </div>
  )
}

export default TradeForm
