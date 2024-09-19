import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {useChild} from "../context/ChildContext"
import {
  updateAllowance,
  updateQuizBonusMoney,
  updateWithdrawableMoney,
} from "@/api/user-api"
import Heading from "../common/Heading"

function MyChildMoneySetting(): JSX.Element {
  const {child} = useChild()
  const navigate = useNavigate()
  const [allowance, setAllowance] = useState<number | null>(null)
  const [withdrawableMoney, setWithdrawableMoney] = useState<number | null>(
    null
  )
  const [maxWithdrawableMoney, setmaxWithdrawableMoney] = useState<
    number | null
  >(null)
  const [quizBonusMoney, setQuizBonusMoney] = useState<number | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<string>("allowance")
  const [inputValue, setInputValue] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)

  const getMyChildsetting = () => {
    setAllowance(child?.settingMoney || null)
    setWithdrawableMoney(child?.settingWithdrawableMoney || null)
    setQuizBonusMoney(child?.settingQuizBonusMoney || null)
    setmaxWithdrawableMoney(100000) //부모의 잔액 balance - 다른 자식의 최대출금가능금액 뺀값
  }

  useEffect(() => {
    if (child) {
      getMyChildsetting()
    }
  }, [child])

  if (!child) return <div>Child data not available</div>

  const handleSave = async () => {
    //유효성 검증
    const value = Number(inputValue)
    if (isNaN(value)) {
      setError("입력 값이 숫자가 아닙니다.")
      return
    }

    if (value < 0) {
      setError("0 이상의 값을 입력해주세요.")
      return
    }
    setError(null)

    //용돈 설정
    if (selectedMenu === "allowance") {
      if (withdrawableMoney && value > withdrawableMoney) {
        setError("입력 값이 출금가능금액의 범위를 벗어났습니다.")
        return
      }
      const res = await updateAllowance(child.childrenId, inputValue)
      if (res.stateCode === 201) {
        setAllowance(inputValue === "" ? null : inputValue)
        console.log("용돈이 성공적으로 업데이트 되었습니다:", res)
      } else if (res.status === 403) {
        console.error("로그인이 필요합니다.", res)
        // 로그인 페이지로 리다이렉트
        alert("로그인이필요합니다.")
        navigate("/login")
      } else {
        console.log("용돈 업데이트 실패:", res)
      }
    }
    //출금가능금액
    else if (selectedMenu === "withdrawableMoney") {
      if (maxWithdrawableMoney && value > maxWithdrawableMoney) {
        setError("입력 값이 마니모 계좌의 범위를 벗어났습니다.")
        return
      }
      const res = await updateWithdrawableMoney(child.childrenId, inputValue)
      if (res.stateCode === 201) {
        setWithdrawableMoney(inputValue === "" ? null : inputValue)
        console.log("withdrawableMoney 성공적으로 업데이트 되었습니다:", res)
      } else if (res.status === 403) {
        console.error("로그인이 필요합니다.", res)
        // 로그인 페이지로 리다이렉트
        alert("로그인이필요합니다.")
        navigate("/login")
      } else {
        console.log("용돈 업데이트 실패:", res)
      }
    }

    //퀴즈 보상 머니 설정
    else if (selectedMenu === "quizBonusMoney") {
      const res = await updateQuizBonusMoney(child.childrenId, inputValue)
      if (res.stateCode === 201) {
        setQuizBonusMoney(inputValue === "" ? null : inputValue)

        console.log("quizBonusMoney 성공적으로 업데이트 되었습니다:", res)
      } else if (res.status === 403) {
        console.error("로그인이 필요합니다.", res)
        // 로그인 페이지로 리다이렉트
        alert("로그인이필요합니다.")
        navigate("/login")
      } else {
        console.log("용돈 업데이트 실패:", res)
      }
    }
    console.log(`${selectedMenu} saved:`, inputValue) // 상태 업데이트 확인
  }

  return (
    <div className="h-[500px] space-y-12 ">
      <Heading title="머니 설정" />
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
      <div className="flex w-full justify-end text-xl font-bold">
        {selectedMenu && (
          <div>
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
              />
              머니
              <button
                onClick={handleSave}
                className="m-2 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
              >
                저장
              </button>
              {error && (
                <p className="text-base font-normal text-red-700">{error}</p>
              )}
            </div>
          </div>
        )}
      </div>
      {(selectedMenu === "withdrawableMoney" ||
        selectedMenu === "allowance") && (
        <div className="mx-8 flex items-center justify-between rounded-lg border p-4 px-12 text-xl font-bold">
          최대금액
          <span className="flex items-center justify-between p-3 text-2xl text-secondary-m2">
            <span className="mr-8">₩</span>

            <span>
              {maxWithdrawableMoney &&
                selectedMenu === "withdrawableMoney" &&
                maxWithdrawableMoney.toLocaleString()}
              {withdrawableMoney &&
                selectedMenu === "allowance" &&
                withdrawableMoney.toLocaleString()}
              {selectedMenu === "allowance" && withdrawableMoney === null && (
                <p className="text-normal text-base text-red-700">
                  최대출금가능금액을 먼저 설정해주세요.
                </p>
              )}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
export default MyChildMoneySetting
