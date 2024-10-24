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
import { Alert } from "@mui/material"
import Swal from "sweetalert2"
import { alertBasic } from "@/utils/alert-util"

function MyChildMoneySetting(): JSX.Element {
  const { child, fetchChild } = useChild()
  const navigate = useNavigate()
  const [allowance, setAllowance] = useState<number | null>(null)
  const [withdrawableMoney, setWithdrawableMoney] = useState<number | null>(
    null
  )
  const [maxAllowance, setMaxAllowance] = useState<number>(0)
  const [quizBonusMoney, setQuizBonusMoney] = useState<number | null>(null)
  const [selectedMenu, setSelectedMenu] = useState<string>("allowance")
  const [inputValue, setInputValue] = useState<number | "">("")
  const [error, setError] = useState<string | null>(null)
  const parent = useAppSelector(selectParent) // 부모 상태 선택
  const dispatch = useAppDispatch()

  const getMyChildsetting = () => {
    setAllowance(parent?.balance || null)
    setWithdrawableMoney(child?.settingWithdrawableMoney || null)
    setQuizBonusMoney(child?.settingQuizBonusMoney || null)
    setMaxAllowance(parent.balance)
  }

  useEffect(() => {
    if (child) {
      getMyChildsetting()
    }
  }, [child])
  useEffect(() => {
    setInputValue("")
  }, [selectedMenu])

  if (!child) return <div>Child data not available</div>

  const handlegiveAllowance = async () => {
    const res = await giveAllowanceApi(child.childrenId, inputValue) // 용돈지급 api
    if (res.stateCode === 201) {
      setAllowance(inputValue === "" ? null : inputValue)
      setMaxAllowance(parent.balance)
      setMemberInfo(dispatch, 0)
      await fetchChild()
      // Swal.fire({
      //   title: "용돈이 성공적으로 지급되었습니다",
      //   icon: "success",
      // })
      alertBasic("piggy-bank.svg", "용돈이 지급되었습니다")
    } else if (res.status === 403) {
      //alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      Swal.fire({
        title: "로그인이필요합니다.",
        icon: "warning",
        confirmButtonText: "로그인",
      }).then(() => {
        navigate("/login")
      })
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
      setInputValue("")

      console.log("settingwithdrawableMoney  업데이트 되었습니다:", res)
      alertBasic("smartphone.svg", "다음달 출금가능금액이 설정되었습니다")
    } else if (res.status === 403) {
      //alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      Swal.fire({
        title: "로그인이필요합니다.",
        icon: "warning",
        confirmButtonText: "로그인",
      }).then(() => {
        navigate("/login")
      })
    } else {
      alertBasic("smartphone.svg", "다음달 출금가능금액이 설정되었습니다")
      console.log("용돈 업데이트 실패:", res)
    }
  }

  //강제출금가능금액설정
  const handleSetWithdrawableMoney = async () => {
    const res = await setWithdrawableMoneyForce(child.childrenId, inputValue) // 용돈지급 api
    if (res.stateCode === 201) {
      setMemberInfo(dispatch, 0)
      await fetchChild()
      setInputValue("")

      alertBasic("smartphone.svg", "출금가능금액이 변경되었습니다")
    } else if (res.status === 403) {
      //alert("로그인이필요합니다.") // 로그인 페이지로 리다이렉트
      Swal.fire({
        title: "로그인이필요합니다.",
        icon: "warning",
        confirmButtonText: "로그인",
      }).then(() => {
        navigate("/login")
      })
    } else {
      alertBasic("smartphone.svg", "출금가능금액 변경을 실패하였습니다")

      console.log("용돈 업데이트 실패:", res)
    }
  }

  const handleSettingQuiz = async () => {
    const res = await updateQuizBonusMoney(child.childrenId, inputValue)
    if (res.stateCode === 201) {
      setQuizBonusMoney(inputValue === "" ? null : inputValue)
      console.log("quizBonusMoney 성공적으로 업데이트 되었습니다:", res)
      alertBasic("quiz.svg", "퀴즈보상가능머니가 변경되었습니다")
      setInputValue("")
    } else if (res.status === 403) {
      //alert("로그인이필요합니다.")
      Swal.fire({
        title: "로그인이필요합니다.",
        icon: "warning",
        confirmButtonText: "로그인",
      }).then(() => {
        navigate("/login")
      })
    } else {
      alertBasic("quiz.svg", "퀴즈보상머니 변경을 실패하였습니다")
      console.log("용돈 업데이트 실패:", res)
    }
  }

  const showNotice = () => {
    if (selectedMenu === "withdrawableMoney") {
      return (
        <span>
          자녀가 다음 달 출금할 수 있는 금액을 설정해주세요.
          <br /> 출금 가능 금액은 매월 1일 자녀의 지갑에 적용됩니다.
          <br /> 변경 사항은 2024년 11월 1일부터 적용됩니다.
          <br /> 즉시 반영을 원하시면, 즉시반영을 눌러주세요. 자녀의 출금 가능
          금액이 즉시 변경됩니다.
        </span>
      )
    } else if (selectedMenu === "allowance") {
      return (
        <span>
          자녀의 지갑에 머니가 지급됩니다.
          <br /> 지급할 금액은 마니모 계좌에 충전된 금액 내에서 가능합니다.
        </span>
      )
    }
    return (
      <span>
        자녀가 퀴즈를 풀고 받을 머니를 설정해주세요.
        <br /> 자녀가 퀴즈의 정답을 맞히면, 해당 머니가 자녀에게 지급되고,
        마니모 계좌 잔액에서 차감됩니다.
      </span>
    )
  }

  return (
    <div className="mb-10 space-y-8">
      <Heading title="머니 설정" />
      <div className="grid grid-cols-3 gap-8 px-8">
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl p-2 shadow-md ${
            selectedMenu === "allowance" ? "bg-secondary-m3" : "bg-white"
          }`}
          onClick={() => {
            setSelectedMenu("allowance")
          }}
        >
          <p className="font-bold">용돈 지급</p>
          {allowance ? (
            <>
              <img
                src="/images/piggy-bank.svg"
                className="size-14"
                alt="용돈"
              />
              <p className="">
                지급 가능 머니 <b>{maxAllowance.toLocaleString()}</b> 머니
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <img
                src="/images/piggy-bank.svg"
                className="size-14"
                alt="용돈"
              />
              <p className="mt-0 text-red-700">
                용돈지급을 위해 <br />
                마니모계좌를 충전해주세요.
              </p>
            </div>
          )}
        </button>
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl p-2 shadow-md ${
            selectedMenu === "withdrawableMoney"
              ? "bg-secondary-m3"
              : "bg-white"
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
              다음 달 <b>{withdrawableMoney.toLocaleString()}</b> 머니
            </p>
          ) : (
            <p className="text-red-700">출금가능금액을 설정해주세요.</p>
          )}
        </button>
        <button
          className={`col-span-1 m-2 flex flex-col items-center gap-4 rounded-xl p-2 shadow-md ${
            selectedMenu === "quizBonusMoney" ? "bg-secondary-m3" : "bg-white"
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
            <p className="text-red-700">퀴즈보상머니를 설정해주세요.</p>
          )}
        </button>
      </div>

      <div className="flex w-full justify-end px-10 text-xl font-bold">
        {selectedMenu && (
          <div>
            {selectedMenu === "allowance" && (
              <div className="flex items-center space-x-8">
                <span>용돈</span>
                <div className="flex w-[350px] items-center">
                  <input
                    type="tel"
                    className="h-[35px] w-full border-b border-gray-400 bg-transparent text-right"
                    value={
                      inputValue === 0 ? "" : inputValue.toLocaleString("ko-KR")
                    } // 숫자 세 자리마다 쉼표
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, "") // 숫자 이외의 값 제거
                      setInputValue(Number(onlyNumbers)) // 상태 업데이트
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
                  />
                  <div className="flex w-[230px] items-center justify-end">
                    <span>머니</span>
                    <button
                      onClick={handlegiveAllowance}
                      className="ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                    >
                      지급
                    </button>
                  </div>
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
                      type="tel"
                      className="h-[35px] w-full border-b border-gray-400 bg-transparent text-right"
                      value={
                        inputValue === 0
                          ? ""
                          : inputValue.toLocaleString("ko-KR")
                      } // 숫자 세 자리마다 쉼표
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "") // 숫자 이외의 값 제거
                        setInputValue(Number(onlyNumbers)) // 상태 업데이트
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
                    />
                    <div className="flex w-[550px] items-center justify-end space-x-3">
                      <span>머니</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleUpdateWithdrawableMoney}
                          className="rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                        >
                          저장
                        </button>
                        <button
                          onClick={handleSetWithdrawableMoney}
                          className="rounded-lg bg-secondary-m2 px-3.5 py-2 text-sm font-normal text-white"
                        >
                          즉시반영
                        </button>
                      </div>
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
                      type="tel"
                      className="h-[35px] w-full border-b border-gray-400 bg-transparent text-right"
                      value={
                        inputValue === 0
                          ? ""
                          : inputValue.toLocaleString("ko-KR")
                      } // 숫자 세 자리마다 쉼표
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const onlyNumbers = e.target.value.replace(/\D/g, "") // 숫자 이외의 값 제거
                        setInputValue(Number(onlyNumbers)) // 상태 업데이트
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
                    />
                    <div className="flex w-[230px] items-center justify-end">
                      <span>머니</span>
                      <button
                        onClick={handleSettingQuiz}
                        className="ml-4 rounded-lg bg-secondary-m2 px-6 py-2 text-sm font-normal text-white"
                      >
                        저장
                      </button>
                    </div>
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
      <Alert
        className="mx-10 rounded-lg px-4 py-2"
        severity="success"
        icon={<InfoIcon />}
      >
        {showNotice()}
      </Alert>
    </div>
  )
}
export default MyChildMoneySetting
