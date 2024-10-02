import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useChild } from "../context/ChildContext"
import {
  setWithdrawableMoneyForce,
  updateQuizBonusMoney,
  updateWithdrawableMoney,
} from "@/api/user-api"
import Heading from "../common/Heading"
import { giveAllowanceApi } from "@/api/fund-api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectParent } from "@/store/slice/parent"
import { setMemberInfo } from "@/utils/user-utils"
import InfoIcon from "@mui/icons-material/Info"

function MyChildMoneySetting(): JSX.Element {
  const { child, fetchChild } = useChild()
  const navigate = useNavigate()
  const [allowance, setAllowance] = useState<number | null>(null)
  const [withdrawableMoney, setWithdrawableMoney] = useState<number | null>(
    null
  )
  const [maxWithdrawableMoney, setmaxWithdrawableMoney] = useState<
    number | null
  >(null)
  const [maxAllowance, setMaxAllowance] = useState<number>(0)
  const [quizBonusMoney, setQuizBonusMoney] = useState<number | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<string>("allowance")
  const [inputValue, setInputValue] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)
  const parent = useAppSelector(selectParent) // 부모 상태 선택
  const dispatch = useAppDispatch()

  const getMyChildsetting = () => {
    setAllowance(child?.settingMoney || null)
    setWithdrawableMoney(child?.settingWithdrawableMoney || null)
    setQuizBonusMoney(child?.settingQuizBonusMoney || null)
    setmaxWithdrawableMoney(100000) //부모의 잔액 balance - 다른 자식의 최대출금가능금액 뺀값
    setMaxAllowance(parent.balance)
  }

  useEffect(() => {
    if (child) {
      getMyChildsetting()
    }
  }, [child])

  if (!child) return <div>Child data not available</div>

  const fetchData = async () => {
    setMemberInfo(dispatch, 0) //부모상태 업데이트
    await fetchChild() //자녀상태 업데이트
  }

  const handlegiveAllowance = async () => {
    const res = await giveAllowanceApi(child.childrenId, inputValue) // 용돈지급 api
    if (res.stateCode === 201) {
      setAllowance(inputValue === "" ? null : inputValue)
      setMaxAllowance(parent.balance)
      //상태 업데이트
      setMemberInfo(dispatch, 0)
      await fetchChild()

      console.log("용돈이 성공적으로 지급되었습니다:", res)
    } else if (res.status === 403) {
      alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      navigate("/login")
    } else {
      console.log("용돈 업데이트 실패:", res)
    }
  }

  //setting출금가능금액설정
  const handleUpdateWithdrawableMoney = async () => {
    const res = await updateWithdrawableMoney(child.childrenId, inputValue) // 용돈지급 api
    if (res.stateCode === 201) {
      setMemberInfo(dispatch, 0)
      await fetchChild()
      setWithdrawableMoney(child.settingWithdrawableMoney)
      console.log("settingwithdrawableMoney  업데이트 되었습니다:", res)
    } else if (res.status === 403) {
      alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      navigate("/login")
    } else {
      console.log("용돈 업데이트 실패:", res)
    }
  }

  //강제출금가능금액설정
  const handleSetWithdrawableMoney = async () => {
    const res = await setWithdrawableMoneyForce(child.childrenId, inputValue) // 용돈지급 api
    if (res.stateCode === 201) {
      setMemberInfo(dispatch, 0)
      await fetchChild()
      console.log("settingwithdrawableMoney  업데이트 되었습니다:", res)
    } else if (res.status === 403) {
      alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      navigate("/login")
    } else {
      console.log("용돈 업데이트 실패:", res)
    }
  }

  const handleSave = async () => {
    //유효성 검증
    const value = Number(inputValue)
    if (isNaN(value)) {
      setError("입력 값이 숫자가 아닙니다.")
      return
    }

    if (value <= 0) {
      setError("1원 이상의 값을 입력해주세요.")
      return
    }
    setError(null)

    //용돈 지급
    if (selectedMenu === "allowance") {
      const res = await giveAllowanceApi(child.childrenId, inputValue) // 용돈지급 api
      if (res.stateCode === 201) {
        setAllowance(inputValue === "" ? null : inputValue)
        setMaxAllowance(parent.balance)
        //상태 업데이트
        setMemberInfo(dispatch, 0)
        await fetchChild()

        console.log("용돈이 성공적으로 지급되었습니다:", res)
      } else if (res.status === 403) {
        alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
        navigate("/login")
      } else {
        console.log("용돈 업데이트 실패:", res)
      }
    }

    //출금가능금액
    else if (selectedMenu === "withdrawableMoney") {
      const res = await updateWithdrawableMoney(child.childrenId, inputValue)
      if (res.stateCode === 201) {
        setWithdrawableMoney(inputValue === "" ? null : inputValue)
        console.log("withdrawableMoney 성공적으로 업데이트 되었습니다:", res)
      } else if (res.status === 403) {
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
        alert("로그인이필요합니다.")
        navigate("/login")
      } else {
        console.log("용돈 업데이트 실패:", res)
      }
    }
    console.log(`${selectedMenu} saved:`, inputValue) // 상태 업데이트 확인
  }

  const showNotice = () => {
    if (selectedMenu === "withdrawableMoney") {
      return (
        <span>
          자녀가 다음달 출금할 수 있는 금액을 설정해주세요
          <br /> 출금가능금액은 매월1일 자녀의 지갑에 적용됩니다. <br />
          변경사항은 2024년 11월 01일 부터 적용됩니다.
          <br />
          즉시 반영시 자녀의 출금가능금액이 강제로 변경됩니다.
        </span>
      )
    } else if (selectedMenu === "allowance") {
      return (
        <span>
          자녀의 지갑에 머니가 지급됩니다. <br /> 마니모계좌에 충전한 금액안에서
          지급할 수 있습니다.
        </span>
      )
    }
    return (
      <span>
        자녀가 퀴즈를 풀고 받을 머니를 설정해주세요 <br /> 퀴즈의 정답을 맞히면
        자녀에게 머니가 지급되고, 마니모계좌 잔액에서 차감됩니다.
      </span>
    )
  }

  return (
    <div className="h-[1000px] space-y-8">
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
          <p className="font-bold">용돈 지급</p>
          <img src="/images/piggy-bank.svg" className="size-14" alt="용돈" />
          {allowance ? (
            <p className="">
              지급가능머니 <b>{maxAllowance.toLocaleString()}머니</b>
            </p>
          ) : (
            <p className="text-red-700">
              용돈지급을 위해 마니모계좌를 충전해주세요.
            </p>
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
            <p className="">
              다음달 <b>{withdrawableMoney.toLocaleString()}</b> 머니
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
            <p className="">
              1회 <b>{quizBonusMoney.toLocaleString()}</b> 머니
            </p>
          ) : (
            <p className="text-red-700">설정해주세요.</p>
          )}
        </button>
      </div>

      <div className="flex w-full justify-end px-12 text-xl font-bold">
        {selectedMenu && (
          <div>
            {selectedMenu === "allowance" && (
              <div className="flex items-center space-x-8">
                <span>지급할 머니</span>
                <div className="flex w-[350px] items-center">
                  <input
                    type="number"
                    value={inputValue}
                    min="0"
                    onChange={(e) =>
                      setInputValue(
                        e.target.value ? Number(e.target.value) : ""
                      )
                    }
                    className="h-[30px] w-[110px] border-b border-gray-400 text-right"
                  />
                  머니
                  <button
                    onClick={handlegiveAllowance}
                    className="m-2 ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                  >
                    지급
                  </button>
                </div>

                {error && (
                  <p className="text-base font-normal text-red-700">{error}</p>
                )}
              </div>
            )}
            {selectedMenu === "withdrawableMoney" && (
              <div>
                <div className="flex items-center space-x-8">
                  <span>한 달 출금 가능 금액</span>
                  <div className="flex w-[350px] items-center">
                    <input
                      type="number"
                      value={inputValue}
                      min="0"
                      onChange={(e) =>
                        setInputValue(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="h-[30px] w-[110px] border-b border-gray-400 text-right"
                    />
                    머니
                    <div className="flex">
                      <button
                        onClick={handleUpdateWithdrawableMoney}
                        className="m-2 ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                      >
                        저장
                      </button>
                      <button
                        onClick={handleSetWithdrawableMoney}
                        className="m-2 rounded-lg bg-secondary-m2 px-3.5 py-2 text-sm font-normal text-white"
                      >
                        즉시반영
                      </button>
                    </div>
                  </div>
                  {error && (
                    <p className="text-base font-normal text-red-700">
                      {error}
                    </p>
                  )}
                </div>
              </div>
            )}
            <div className="flex w-full justify-end">
              {selectedMenu === "quizBonusMoney" && (
                <div className="flex items-center space-x-8">
                  <span>한 달 퀴즈 보상 머니</span>
                  <div className="flex w-[350px] items-center">
                    <input
                      type="number"
                      value={inputValue}
                      onChange={(e) =>
                        setInputValue(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="h-[30px] w-[110px] border-b border-gray-400 text-right"
                    />
                    머니
                    <button
                      onClick={handleSave}
                      className="m-2 ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                    >
                      저장
                    </button>
                  </div>
                  {error && (
                    <p className="text-base font-normal text-red-700">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mx-8 flex items-start gap-4 rounded-lg border p-2 px-8">
        <InfoIcon style={{ color: "black", fontSize: 20 }} className="mt-2" />

        {showNotice()}
      </div>
    </div>
  )
}
export default MyChildMoneySetting
