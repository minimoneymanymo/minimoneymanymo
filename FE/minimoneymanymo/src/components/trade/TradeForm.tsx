import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"

import {Card, Button} from "@material-tailwind/react"

import {postTrade, getChildMoney} from "@/api/trade-api"
import {tradeData} from "./tradeData"

// closingPrice를 props로 받기 위해 인터페이스 정의
interface BuyFormProps {
  closingPrice: number | null // closingPrice가 null일 수도 있으므로 타입 지정
}

function BuyForm({closingPrice}: BuyFormProps): JSX.Element {
  const {stockCode} = useParams() // useParams로 stockCode 가져오기
  const [isBuyMode, setIsBuyMode] = useState<boolean>(true)

  //매수 시 사용
  const [money, setMoney] = useState<number | null>(null) // 보유머니
  const [inputMoney, setInputMoney] = useState<number>(0) // 매수할 머니
  const [tradeShares, setTradeShares] = useState<number>(0) // 머니 환산 주수 (매수할 머니 / 현재가)
  const [remainingMoney, setRemainingMoney] = useState<number | null>(null) // 매도 후 잔액 (남은 머니 : 보유머니 - 매수할 머니)
  const [reason, setReason] = useState<string>("") // 매매 이유

  // 매도 시 사용
  const [remainSharesCount, setRemainSharesCount] = useState<number>(0) // 보유 주식 수
  const [sellShares, setSellShares] = useState<number>(0) // 매도 주수
  const [sellMoney, setSellMoney] = useState<number>(0) // 매도 머니
  // 수익 머니

  // API 호출하여 보유 머니 가져오기
  const loadMoney = async () => {
    if (!stockCode) {
      console.error("stockCode is missing")
      return
    }

    try {
      const data = await getChildMoney(stockCode)
      console.log(data)
      setMoney(data.data.money)
      setRemainSharesCount(data.data.remainSharesCount) // 보유 주식 수 설정
    } catch (error) {
      console.error("Failed to load money:", error)
    }
  }

  useEffect(() => {
    loadMoney()
  }, [stockCode])

  // 입력된 금액에 따른 주 수와 잔액 계산
  useEffect(() => {
    if (closingPrice) {
      const shares = Math.floor((inputMoney / closingPrice) * 1e7) / 1e7 // closingPrice 사용
      setTradeShares(shares)
      if (money !== null) {
        setRemainingMoney(money - inputMoney)
      }
    }
  }, [inputMoney, money, closingPrice])

  // 매수 처리 함수
  const handleTrade = async () => {
    if (!stockCode) {
      // stockCode가 없으면 처리하지 않음
      console.error("stockCode is missing")
      return
    }

    const tradeDataObj: tradeData = {
      stockCode, // useParams에서 가져온 stockCode 사용
      amount: inputMoney,
      tradeSharesCount: isBuyMode
        ? Number(tradeShares.toFixed(6))
        : Number(sellShares.toFixed(6)), // 소수점 6자리로 표시
      reason,
      tradeType: isBuyMode ? "4" : "5",
    }

    try {
      const result = await postTrade(tradeDataObj)
      console.log("Trade successful:", result)
      // 거래가 성공하면 보유 머니 재로딩
      await loadMoney()
    } catch (error) {
      console.error("Trade failed:", error)
    }
  }

  // ***** 최대 구매 가능 주 수 계산
  const maxShares = closingPrice
    ? Math.floor(((money || 0) / closingPrice) * 1e7) / 1e7
    : 0 // 최대 구매 가능 주 수

  return (
    <div className="flex flex-col items-center">
      {" "}
      {/* 중앙 정렬 */}
      <div className="mb-4 flex space-x-4">
        {" "}
        {/* 수평 배열 및 간격 설정 */}
        <Button
          className="bg-red-500 text-white"
          onClick={() => setIsBuyMode(true)}
        >
          매수
        </Button>
        <Button
          className="bg-blue-500 text-white"
          onClick={() => setIsBuyMode(false)}
        >
          매도
        </Button>
      </div>
      <Card className="shadow-blue-gray-900/5 w-fit p-0 px-1 py-4">
        {/* 매수 모드일 때 */}
        {isBuyMode ? (
          <>
            <p>현재가 : {closingPrice} </p>
            <h2>
              보유 머니:{" "}
              {money !== null && money !== undefined
                ? money.toLocaleString("ko-KR", {
                    style: "currency",
                    currency: "KRW",
                  })
                : "로딩 중..."}
            </h2>

            <p className="availablePurchaseShares text-xs text-gray-500">
              최대 {maxShares.toFixed(6)} 주 매수 가능
            </p>
            <div className="flex items-center">
              <input
                className="appearance-none rounded bg-gray-300 px-2 py-1 text-black placeholder-white"
                type="number"
                value={inputMoney === 0 ? "" : inputMoney}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInputMoney(Number(e.target.value))
                }
                placeholder="매수할 머니"
              />
            </div>
            <p>{tradeShares.toFixed(6)} 주</p>
            {remainingMoney !== null && remainingMoney !== undefined && (
              <p>매도 후 잔액: {remainingMoney.toLocaleString()}</p>
            )}

            <input
              className="w-full rounded bg-gray-300 px-2 py-20 text-black placeholder-white"
              type="text"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReason(e.target.value)
              }
              placeholder="매수를 생각하게 된 이유를 적어주세요!"
            />
          </>
        ) : (
          <>
            {/***** 매도 모드일 때 *****/}
            <p>현재가 : {closingPrice} </p>
            <h2>보유 주식: {remainSharesCount.toFixed(6)} 주</h2>
            <p className="availableSellShares text-xs text-gray-500">
              최대 {remainSharesCount.toFixed(6)} 주 매도 가능
            </p>
            <div className="flex items-center">
              <input
                className="rounded bg-gray-300 px-2 py-1 text-black placeholder-white"
                type="number"
                value={sellShares === 0 ? "" : sellShares.toString()} // sellShares가 0일 때는 빈 문자열로 표시
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSellShares(Number(e.target.value))
                }
                placeholder="매도할 주 수"
              />
            </div>
            <p>{tradeShares.toFixed(6)} 머니</p>
            <p>**** 손익가격</p>
            <p>**** 매도 후 잔액 계산하기..</p>
            {remainingMoney !== null && (
              <p>매도 후 잔액: {remainingMoney.toLocaleString()}</p>
            )}
            <input
              className="w-full rounded bg-gray-300 px-2 py-20 text-black placeholder-white"
              type="text"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReason(e.target.value)
              }
              placeholder="매도를 생각하게 된 이유를 적어주세요!"
            />
          </>
        )}
        <p className="warning mt-2 text-xs text-red-500">
          투자의 책임은 본인에게 있습니다.
        </p>
        <Button
          className={isBuyMode ? "bg-red-500" : "bg-blue-500"}
          text-white
          onClick={() => handleTrade()}
        >
          {isBuyMode ? "매수" : "매도"}
        </Button>
      </Card>
    </div>
  )
}

export default BuyForm
