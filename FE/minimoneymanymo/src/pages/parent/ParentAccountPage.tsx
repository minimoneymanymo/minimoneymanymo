import Heading from "@/components/common/Heading"
import RegisterAccount from "@/components/common/mypage/RegisterAccount"
import AlertIcon from "@mui/icons-material/ReportGmailerrorredOutlined"

interface MAccountInfoProps {
  name: string
  balance: number
}

interface AccountInfoProps {
  bankName?: string
  accoutNo?: string
  accountName?: string
  accountBalance?: string
}

const ParentAccountPage = () => {
  const name = "세민맘"
  const balance = 0
  const accountInfo = {
    bankName: "한국은행",
    accountNo: "0014082358175798",
    accountName: "한국은행 수시입출금 상품",
    accountBalance: "990001",
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <Heading title="연결 계좌 정보" />
      <AccountInfo {...accountInfo} />
      {/* {...accountInfo} */}
      <div className="h-1" />
      <Heading title="마니모 계좌" />
      <MAccountInfo name={name} balance={balance} />
      <div className="h-1" />
      <Heading title="계좌 관리" />
      <RegisterAccount />
    </div>
  )
}

const AccountInfo: React.FC<AccountInfoProps> = ({
  bankName,
  accoutNo,
  accountName,
  accountBalance,
}) => {
  // props 값이 없는 경우
  const hasAccountInfo = bankName || accoutNo || accountName || accountBalance

  return (
    <div
      className={`flex h-[176px] w-full rounded-3xl p-6 ${
        hasAccountInfo ? "bg-primary-50" : "bg-gray-100"
      }`}
    >
      {hasAccountInfo ? (
        <div className="flex w-full flex-col items-start justify-between">
          <div className="flex w-full items-center justify-start">
            <b className="mr-5 text-lg">{bankName}</b>
            <span className="ml-1">{accoutNo}</span>
          </div>
          <span className="text-dark-500 self-start pt-1">{accountName}</span>
          <span className="flex w-full flex-col items-end">
            <span className="text-right">
              <b className="mr-1">
                <span className="mr-5 text-primary-600">₩ </span>
                {Number(accountBalance).toLocaleString()}
              </b>
              원
            </span>
            <button className="mt-2 rounded bg-primary-m1 px-4 py-2 text-white">
              충전 ₩
            </button>
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

const MAccountInfo: React.FC<MAccountInfoProps> = ({ name, balance }) => {
  return (
    <div className="flex w-full flex-col items-end rounded-3xl bg-secondary-50 p-6">
      <div className="flex w-full items-center justify-start">
        <b className="text-lg">{name}</b>
        <span className="ml-1">님의 잔액</span>
      </div>
      <span className="flex w-full flex-col items-end">
        <span className="text-right">
          <b className="mr-1">
            <span className="mr-5 text-secondary-600-m2">₩ </span> {balance}
          </b>
          원
        </span>
        <button className="mt-2 rounded bg-secondary-600-m2 px-4 py-2 text-white">
          환불 ↻
        </button>
      </span>
    </div>
  )
}

export default ParentAccountPage
