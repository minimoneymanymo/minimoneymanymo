import React from "react"
import Heading from "@/components/common/Heading"
import AlertIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import {
  AccountInfoProps,
  MoneyInfoProps,
  RecordItemProps,
} from "@/types/accountTypes"
import RegisterAccount from "@/components/common/mypage/RegisterAccount"
import ToggleList from "@/components/common/mypage/ToggleList"
import WithdrawablReqItem from "@/components/child/WithdrawalReqItem"
import RecordForm from "@/components/child/RecordForm"

function ChildWalletPage(): JSX.Element {
  const accountInfo = {
    bankName: "우리은행",
    accoutNo: "1231-249-723984",
    accountName: "우리SUPER주거래통장",
    accountBalance: "120000",
  }

  const recordItem = {
    createdAt: "20240927140000",
    tradeType: "1",
    amount: "1000",
    balance: "30000",
    title: "삼성전자",
  }

  const dataList = [
    { createdAt: "20240927140000", amount: "10000", approvedAt: "" },
    {
      createdAt: "20240916140000",
      amount: "3000",
      approvedAt: "20240916140000",
    },
  ]

  const recordList = [
    {
      amount: 1000,
      tradeType: "1",
      createdAt: "20240928162204",
      companyName: null,
      tradeSharesCount: null,
      remainAmount: 4100,
    },
    {
      amount: 1300,
      tradeType: "4",
      createdAt: "20240924104254",
      companyName: "BGF리테일",
      tradeSharesCount: 0.04,
      remainAmount: 4100,
    },
    {
      amount: 3300,
      tradeType: "4",
      createdAt: "20240924104230",
      companyName: "BGF리테일",
      tradeSharesCount: 0.04,
      remainAmount: 5400,
    },
    {
      amount: 1300,
      tradeType: "4",
      createdAt: "20240924103641",
      companyName: "시프트업",
      tradeSharesCount: 0.5,
      remainAmount: 8700,
    },
    {
      amount: 30300,
      tradeType: "4",
      createdAt: "20240923103121",
      companyName: "시프트업",
      tradeSharesCount: 0.5,
      remainAmount: 0,
    },
    {
      amount: 30300,
      tradeType: "5",
      createdAt: "20240923102948",
      companyName: "시프트업",
      tradeSharesCount: 0.5,
      remainAmount: 30300,
    },
  ]
  return (
    <>
      <Heading title="나의 지갑" />
      <div className="mb-4">
        <div className="mb-3 flex w-full justify-center px-8">
          <div className="flex flex-1">
            <MoneyInfo money={32000} withdrawableMoney={132000} />
          </div>
          <div className="flex flex-1">
            <AccountInfo {...accountInfo} />
          </div>
        </div>
        <div className="px-8">
          <ToggleList title="출금 요청 내역">
            <div className="border-t-2 border-gray-100 p-4">
              {dataList.map((item, index) => (
                <WithdrawablReqItem
                  key={index}
                  createdAt={item.createdAt}
                  amount={item.amount}
                  approvedAt={item.approvedAt}
                />
              ))}
            </div>
          </ToggleList>
          <div className="h-3" />
          <ToggleList title="계좌 연동하기">
            <RegisterAccount banks={[]} />
          </ToggleList>
        </div>
      </div>

      <Heading title="나의 머니 사용 기록" />
      <RecordForm data={recordList} />
    </>
  )
}

const MoneyInfo: React.FC<MoneyInfoProps> = ({ money, withdrawableMoney }) => {
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
          원
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
            className="w-[110px] border-b border-black bg-transparent text-center focus:border-b focus:border-black focus:outline-none"
          />
          원
          <button className="ml-4 rounded-xl bg-tertiary-m4 px-4 py-2 font-bold text-white">
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
