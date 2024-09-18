import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

function MyChildMoneySetting(): JSX.Element {
   const location = useLocation()
   const child = location.state?.child

   const [allowance, setAllowance] = useState<number | null>(null)
   const [withdrawableMoney, setWithdrawableMoney] = useState<number | null>(
     null
   )
   const [quizBonusMoney, setQuizBonusMoney] = useState<number | null>(null)
   const [selectedMenu, setSelectedMenu] = useState<string | null>(null)
   const [inputValue, setInputValue] = useState<number | "">("")
   const getMyChildsetting = () => {
     setAllowance(child.allowance)
     setWithdrawableMoney(child.withdrawableMoney)
     setQuizBonusMoney(child.quizBonusMoney)
   }
   useEffect(() => {
     getMyChildsetting()
   }, [])

   const handleSave = () => {
     if (selectedMenu === "allowance") {
       setAllowance(inputValue === "" ? null : inputValue)
     } else if (selectedMenu === "withdrawableMoney") {
       setWithdrawableMoney(inputValue === "" ? null : inputValue)
     } else if (selectedMenu === "quizBonusMoney") {
       setQuizBonusMoney(inputValue === "" ? null : inputValue)
     }
     console.log(`${selectedMenu} saved:`, inputValue) // 상태 업데이트 확인
   }

    return  (<>
    <div className="grid grid-cols-3 gap-8 px-8">
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl border p-2 ${
            selectedMenu === "allowance" ? "bg-secondary-m3" : ""
          }`}
          onClick={() => {
            setSelectedMenu("allowance")
          }}
          >
          <p className="font-bold">용돈</p>
          <img src="/images/piggy-bank.svg" className="size-14" alt="용돈" />
          {allowance ? (
            <p className="font-bold">한 달 {allowance.toLocaleString()}머니</p>
          ) : (
            <p className="text-red-700">설정해주세요.</p>
          )}
        </button>
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl border p-2 ${
            selectedMenu === "withdrawableMoney" ? "bg-secondary-m3" : ""
          }`}
          onClick={() => {
            setSelectedMenu("withdrawableMoney")
          }}
          >
          <p className="font-bold">출금 가능 금액</p>

          <img
            src="/images/smartphone.svg"
            className="size-14"
            alt="smartphone"
            />
          {withdrawableMoney ? (
            <p className="font-bold">
              {withdrawableMoney.toLocaleString()}머니
            </p>
          ) : (
            <p className="text-red-700">설정해주세요.</p>
          )}
        </button>
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl border p-2 ${
            selectedMenu === "quizBonusMoney" ? "bg-secondary-m3" : ""
          }`}
          onClick={() => {
            setSelectedMenu("quizBonusMoney")
          }}
          >
          <p className="font-bold">퀴즈 보상 머니</p>

          <img src="/images/quiz.svg" className="size-14" alt="quiz" />
          {quizBonusMoney ? (
            <p className="font-bold">{quizBonusMoney.toLocaleString()}머니</p>
          ) : (
            <p className="text-red-700">설정해주세요.</p>
          )}
        </button>
      </div>
      <div className="flex w-full justify-end text-xl  font-bold">
        {selectedMenu &&
          ["allowance", "withdrawableMoney", "quizBonusMoney"].includes(
            selectedMenu
          ) && (
            <div>
              {selectedMenu === "allowance" && "한 달 용돈 "}
              {selectedMenu === "withdrawableMoney" && "한 달 출금 가능 금액 "}
              {selectedMenu === "quizBonusMoney" && "한 달 퀴즈 보상 머니 "}
              <input
                type="number"
                value={inputValue}
                onChange={(e) =>
                  setInputValue(e.target.value ? Number(e.target.value) : "")
                }
                className="border-b border-gray-400 text-right"
                style={{
                  WebkitAppearance: "none", // Chrome, Safari, Opera
                  appearance: "none",
                }}
                />
              머니
              <button
                onClick={handleSave}
                className="m-2 rounded-lg font-normal text-sm bg-secondary-m2 px-6 py-2 text-white"
                >
                저장
              </button>
            </div>
          )}
      </div>
          </> 
      )
}
export default MyChildMoneySetting
