import React, { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"
import AlertIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import {
  AccountInfoProps,
  MoneyInfoProps,
  RecordItemProps,
  WithdrawableMoneyProps,
} from "@/types/accountTypes"
import RegisterAccount from "@/components/common/mypage/RegisterAccount"
import ToggleList from "@/components/common/mypage/ToggleList"
import WithdrawablReqItem from "@/components/child/WithdrawalReqItem"
import RecordForm from "@/components/child/RecordForm"
import {
  getAllMoneyRecordsApi,
  getWithdrawListApi,
  requestWithdrawApi,
} from "@/api/fund-api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { inquireAccountApi, inquireBankCodesApi } from "@/api/account-api"
import { accountActions, selectAccount } from "@/store/slice/account"
import { selectChild } from "@/store/slice/child"
import LineChart from "./component/LineChart"
import { setMemberInfo } from "@/utils/user-utils"
import Swal from "sweetalert2"
import { alertBasic } from "@/utils/alert-util"

function ChildWalletPage(): JSX.Element {
  const child = useAppSelector(selectChild) // parent state 가져옴
  const account = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()

  const [withdrawList, setWithdrawList] = useState<WithdrawableMoneyProps[]>([])
  const [recordList, setRecordList] = useState<RecordItemProps[]>([])
  const [banks, setBanks] = useState([])

  useEffect(() => {
    // 출금요청내역, 머니사용내역
    const fetchChildInfo = async () => {
      try {
        await setMemberInfo(dispatch, 1)
      } catch (error) {
        // console.error("API 호출 중 오류 발생:", error)
      }
    }
    const fetchAccountInfo = async () => {
      try {
        // 계좌 조회
        if (child.accountNumber != null) {
          try {
            const res = await inquireAccountApi(
              child.accountNumber,
              child.userKey
            )
            // console.log(res)
            if (res != null) {
              const { bankName, accountNo, accountName, accountBalance } =
                res.REC

              const accountPayload = {
                bankName,
                accountNo,
                accountName,
                accountBalance,
              }
              dispatch(accountActions.setAccount(accountPayload))
            } else {
              console.error("계좌 정보 조회 실패")
            }
          } catch (error) {
            console.error("계좌 정보 조회 중 오류 발생:", error)
          }
        } else {
          // 은행 리스트 조회
          const res = await inquireBankCodesApi()
          if (res != null) {
            setBanks(res.REC)
          }
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
      }
    }
    const fetchFundList = async () => {
      try {
        const res1 = await getAllMoneyRecordsApi()
        const res2 = await getWithdrawListApi()
        if (res1.stateCode == 200) {
          // console.log(res1)
          setRecordList(res1.data)
        } else {
          console.error("머니내역 오류: ", res1)
          if (res1.message) {
            //alert(res1.message)
            // Swal.fire({
            //   title: "error",
            //   text: `${res1.message}`,
            //   icon: "error",
            // })
          } else {
            //alert("에러가 발생했습니다. 다시 시도해주세요")
            Swal.fire({
              title: "error",
              text: `에러가 발생했습니다. 다시 시도해주세요`,
              icon: "error",
            })
          }
        }
        if (res2.stateCode == 200) {
          // console.log(res2)
          setWithdrawList(res2.data)
        } else {
          // console.error("출금요청내역 오류: ", res2)
          if (res2.message) {
            //alert(res2.message)
            // Swal.fire({
            //   title: "error",
            //   text: `${res1.message}`,
            //   icon: "error",
            // })
          } else {
            //alert("에러가 발생했습니다. 다시 시도해주세요")
            Swal.fire({
              title: "error",
              text: `에러가 발생했습니다. 다시 시도해주세요`,
              icon: "error",
            })
          }
        }
      } catch (error) {
        console.error("오류 발생:", error)
      }
    }

    fetchChildInfo()
    fetchFundList()
    fetchAccountInfo()
  }, [])

  const deleteAccount = () => {
    dispatch(accountActions.clearAccount())
  }

  return (
    <>
      <Heading title="나의 지갑" />
      <div className="mb-4">
        <div className="mb-3 flex w-full justify-center px-8">
          <div className="flex flex-1">
            <MoneyInfo {...child} />
          </div>
          <div className="flex flex-1">
            <AccountInfo {...account} />
          </div>
        </div>
        <div className="px-8">
          <ToggleList title="출금 요청 내역">
            <div className="border-t-2 border-gray-100 p-4">
              {withdrawList.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  조회 결과가 없습니다.
                </div>
              ) : (
                withdrawList.map((item, index) => (
                  <WithdrawablReqItem key={index} {...item} />
                ))
              )}
            </div>
          </ToggleList>
          <div className="h-3" />
          {child.accountNumber ? (
            <ToggleList title="계좌 연동 해지">
              <div className="flex flex-row items-center justify-between p-4">
                <span>계좌 연결을 해지하시겠습니까?</span>
                <button
                  onClick={deleteAccount}
                  className="ml-4 rounded-xl bg-secondary-m2 px-4 py-2 text-white"
                >
                  계좌 해지
                </button>
              </div>
            </ToggleList>
          ) : (
            <ToggleList title="계좌 연동하기">
              <RegisterAccount banks={banks} userKey={child.userKey} />
            </ToggleList>
          )}
        </div>
      </div>

      <Heading title="나의 머니 사용 기록" />
      {recordList.length === 0 ? (
        <div className="p-3 text-center text-gray-500">
          조회 결과가 없습니다.
        </div>
      ) : (
        <div>
          <div className="m-2 bg-white">
            <LineChart data={getRecent7Days(recordList)} />
          </div>
          <div
            className={`${
              recordList.length >= 5
                ? "hidden-scrollbar max-h-[400px] overflow-y-auto"
                : ""
            }`}
          >
            <RecordForm data={recordList} isMoneyList={true} />
          </div>
        </div>
      )}
    </>
  )
}

// 데이터를 날짜별로 그룹화하는 함수
const groupByDate = (data: RecordItemProps[]) => {
  return data.reduce((acc: Record<string, RecordItemProps[]>, record) => {
    const date = record.createdAt.slice(0, 8)

    // 해당 날짜가 이미 있으면 배열에 추가, 없으면 새로 생성
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(record)

    return acc
  }, {})
}

const getRecent7Days = (data: RecordItemProps[]) => {
  const groupedData = groupByDate(data)

  const sortedData = Object.keys(groupedData)
    .sort((a, b) => {
      const yearA = parseInt(a.slice(0, 4), 10)
      const monthA = parseInt(a.slice(4, 6), 10) - 1
      const dayA = parseInt(a.slice(6, 8), 10)
      const dateA = new Date(yearA, monthA, dayA)

      const yearB = parseInt(b.slice(0, 4), 10)
      const monthB = parseInt(b.slice(4, 6), 10) - 1
      const dayB = parseInt(b.slice(6, 8), 10)
      const dateB = new Date(yearB, monthB, dayB)

      return dateB.getTime() - dateA.getTime() // 최신순으로 정렬
    })
    .slice(0, 7) // 상위 7개의 날짜만 가져오기

  const result = sortedData.reduce(
    (acc: Record<string, RecordItemProps[]>, dateKey) => {
      acc[dateKey] = groupedData[dateKey]
      return acc
    },
    {}
  )
  return result
}

const MoneyInfo: React.FC<MoneyInfoProps> = ({ money, withdrawableMoney }) => {
  const [withdrawMoney, setWithdrawMoney] = useState("")

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawMoney(e.target.value)
  }

  const requestWithdraw = async () => {
    if (Number(withdrawMoney) == 0) {
      //alert("1원 이상 입력해주세요.")
      alertBasic("cry.svg", "1원 이상 입력해주세요.")

      return
    }
    const res = await requestWithdrawApi(Number(withdrawMoney))
    if (res.stateCode === 201) {
      // console.log(res)
      window.location.reload()
    } else {
      // Swal.fire({
      //   title: res.data.message,
      //   icon: "warning",
      // })
      console.error("API 호출 중 에러가 발생했습니다")
    }
  }
  return (
    <div className="relative mt-5 flex flex-[3] flex-col items-center rounded-3xl bg-tertiary-50 p-6 shadow-md">
      <img
        src="/images/gold-pig.svg"
        alt="Left Bottom Image"
        className="absolute -bottom-6 left-0 h-[140px] w-[90px] object-contain"
      />

      <div>
        <div className="mb-4 text-center">
          <b>
            내 머니 <span className="mx-3 text-tertiary-m4">₩</span>
            <span className="mr-1 text-2xl font-black">
              {money.toLocaleString()}
            </span>
          </b>
          머니
        </div>

        <div className="mb-4 text-center">
          이번 달
          <b className="ml-2 mr-2">
            출금가능금액
            <span className="ml-3 text-xl">
              {withdrawableMoney.toLocaleString()}
            </span>
          </b>
          원
        </div>

        <div className="flex items-center">
          <input
            type="text"
            value={withdrawMoney}
            onChange={handleInputChange}
            className="w-[110px] border-b border-black bg-transparent text-center focus:border-b focus:border-black focus:outline-none"
          />
          원
          <button
            onClick={requestWithdraw}
            className="ml-4 rounded-xl bg-tertiary-m4 px-4 py-2 font-bold text-white"
          >
            출금 요청
          </button>
        </div>
      </div>
    </div>
  )
}

const AccountInfo: React.FC<AccountInfoProps> = (props) => {
  const { bankName, accoutNo, accountName, accountBalance } = props
  const hasAccountInfo = bankName || accoutNo || accountName || accountBalance

  return (
    <div
      className={`ml-8 mt-5 flex flex-[2] flex-col rounded-3xl bg-gray-100 p-6 shadow-md`}
    >
      {hasAccountInfo ? (
        <div className="flex h-full flex-col justify-between">
          <div className="flex flex-col">
            <div className="text-lg font-bold">{bankName}</div>
            <span className="pt-1 text-gray-500">{accountName}</span>
            <span className="text-dark-500 pt-1">{accoutNo}</span>
          </div>

          <span className="text-right">
            <b className="mr-1">
              <span className="mr-4 text-secondary-m2">₩ </span>
              <span className="text-2xl">
                {Number(accountBalance).toLocaleString()}
              </span>
            </b>
            원
          </span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <AlertIcon style={{ fontSize: 40 }} />
          <span className="mt-2 text-center">연결된 계좌가 없습니다.</span>
        </div>
      )}
    </div>
  )
}

export default ChildWalletPage
