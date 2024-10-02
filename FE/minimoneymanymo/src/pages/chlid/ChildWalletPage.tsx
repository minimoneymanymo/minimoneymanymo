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
import { useNavigate } from "react-router-dom"
import { childActions, selectChild } from "@/store/slice/child"
import LineChart from "./component/LineChart"
import { setMemberInfo } from "@/utils/user-utils"

function ChildWalletPage(): JSX.Element {
  const child = useAppSelector(selectChild) // parent state 가져옴
  const account = useAppSelector(selectAccount)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [withdrawList, setWithdrawList] = useState<WithdrawableMoneyProps[]>([])
  const [recordList, setRecordList] = useState<RecordItemProps[]>([])
  const [banks, setBanks] = useState([])

  useEffect(() => {
    // 출금요청내역, 머니사용내역
    const fetchChildInfo = async () => {
      try {
        await setMemberInfo(dispatch, 1)
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
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
            console.log(res)
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
          console.log(res1)
          setRecordList(res1.data)
        } else console.error("머니내역 오류: ", res1)

        if (res2.stateCode == 200) {
          console.log(res2)
          setWithdrawList(res2.data)
        } else console.error("출금요청내역 오류: ", res1)
      } catch (error) {
        console.error("오류 발생:", error)
      }
    }

    fetchChildInfo()
    fetchFundList()
    fetchAccountInfo()
  }, [])

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
                  <WithdrawablReqItem
                    key={index}
                    createdAt={item.createdAt}
                    amount={item.amount}
                    approvedAt={item.approvedAt}
                  />
                ))
              )}
            </div>
          </ToggleList>
          <div className="h-3" />
          {child.accountNumber ? (
            <ToggleList title="계좌 연동 해지">
              <div>계좌 연결을 해지하시겠습니까?</div>
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
          <RecordForm data={recordList} isMoneyList={true} />
        </div>
      )}
    </>
  )
}

// 데이터를 날짜별로 그룹화하는 함수
const groupByDate = (data: RecordItemProps[]) => {
  return data.reduce((acc: Record<string, RecordItemProps[]>, record) => {
    // 날짜 부분만 추출 (yyyyMMdd 형식)
    const date = record.createdAt.slice(0, 8)

    // 해당 날짜가 이미 있으면 배열에 추가, 없으면 새로 생성
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(record)

    return acc
  }, {})
}

// 최근 7일 데이터를 필터링하는 함수
const getRecent7Days = (data: RecordItemProps[]) => {
  const groupedData = groupByDate(data)
  const today = new Date()
  const past7Days = new Date()
  past7Days.setDate(today.getDate() - 7)
  console.log(groupedData)
  return Object.keys(groupedData)
    .filter((dateKey) => {
      const year = parseInt(dateKey.slice(0, 4), 10)
      const month = parseInt(dateKey.slice(4, 6), 10) - 1 // month는 0부터 시작
      const day = parseInt(dateKey.slice(6, 8), 10)
      const date = new Date(year, month, day)

      // 최근 7일 내의 날짜인지 확인
      return date >= past7Days && date <= today
    })
    .reduce((acc: Record<string, RecordItemProps[]>, dateKey) => {
      acc[dateKey] = groupedData[dateKey]
      return acc
    }, {})
}

const MoneyInfo: React.FC<MoneyInfoProps> = ({ money, withdrawableMoney }) => {
  const [withdrawMoney, setWithdrawMoney] = useState("")

  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWithdrawMoney(e.target.value)
  }

  const requestWithdraw = async () => {
    if (Number(withdrawMoney) == 0) {
      alert("1원 이상 입력해주세요.")
      return
    }
    const res = await requestWithdrawApi(Number(withdrawMoney))
    if (res.stateCode === 201) {
      console.log(res)
      window.location.reload()
    } else {
      console.error("API 호출 중 에러가 발생했습니다")
    }
  }
  return (
    <div className="relative mt-5 flex flex-[3] flex-col items-center rounded-3xl bg-tertiary-50 p-6 shadow-md">
      <img
        src="/images/gold-pig.svg" // 이미지 경로 설정
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
          이번달
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
            value={withdrawMoney} // 입력값을 상태에 바인딩
            onChange={handleInputChange} // 입력값 변경 핸들러 연결
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
  // props 값이 없는 경우
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
              <span className="mr-4 text-primary-600">₩ </span>
              <span className="text-2xl">
                {Number(accountBalance).toLocaleString()}
              </span>
            </b>
            원
          </span>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <AlertIcon style={{ fontSize: 40 }} /> {/* 아이콘 크기 증가 */}
          <span className="mt-2 text-center">연결된 계좌가 없습니다.</span>
        </div>
      )}
    </div>
  )
}

export default ChildWalletPage
