import React, { useEffect, useState } from "react"
import Heading from "@/components/common/Heading"
import RegisterAccount from "@/components/common/mypage/RegisterAccount"
import AlertIcon from "@mui/icons-material/ReportGmailerrorredOutlined"
import ToggleList from "@/components/common/mypage/ToggleList"
import PriceModal from "@/components/common/PriceModal"
import { depositBalanceApi, refundBalanceApi } from "@/api/fund-api"
import { inquireAccountApi, inquireBankCodesApi } from "@/api/account-api"
import { getMemberInfo } from "@/api/user-api"
import { useNavigate } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectParent, parentActions } from "@/store/slice/parent"
import { accountActions, selectAccount } from "@/store/slice/account"
import { AccountInfoProps, MAccountInfoProps } from "@/types/accountTypes"

const ParentAccountPage = () => {
  const parent = useAppSelector(selectParent) // parent state 가져옴
  const account = useAppSelector(selectAccount)
  const dispatch = useAppDispatch() // state 값 변경(action 실행) 시 사용
  // dispatch(parentActions.setUserInfo({userInfo 객체}))
  const navigate = useNavigate()
  const [isChargeOpen, setIsChargeOpen] = useState(false)
  const [isRefundOpen, setIsRefundOpen] = useState(false)
  const [banks, setBanks] = useState([])

  const openChargeModal = () => {
    setIsChargeOpen(true)
  }

  const closeChargeModal = () => {
    setIsChargeOpen(false)
  }

  const openRefundModal = () => {
    setIsRefundOpen(true)
  }

  const closeRefundModal = () => {
    setIsRefundOpen(false)
  }

  const name = "세민맘"
  const balance = 0
  const accountInfo = {
    bankName: "한국은행",
    accountNo: "0014082358175798",
    accountName: "한국은행 수시입출금 상품",
    accountBalance: "990001",
  }

  useEffect(() => {
    // 사용자 정보 조회 -> 계좌번호 있으면 계좌 조회
    //                 -> 없으면 은행리스트 조회
    const fetchMemberInfo = async () => {
      try {
        const res = await getMemberInfo()
        if (res.stateCode === 200) {
          console.log(res)
          const {
            userId,
            phoneNumber,
            accountNumber,
            name,
            balance,
            profileImgUrl,
            userKey,
          } = res.data

          const payload = {
            userId,
            phoneNumber,
            accountNumber,
            name,
            balance,
            profileImgUrl,
            userKey,
          }
          dispatch(parentActions.setUserInfo(payload))

          // 계좌 조회
          if (accountNumber != null) {
            try {
              console.log("🎈🎈🎈🎈")
              console.log(accountNumber + " " + userKey)
              const res = await inquireAccountApi(accountNumber, userKey)
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
        } else if (res.status === 403) {
          console.error("로그인이 필요합니다.", res)
          alert("로그인이 필요합니다.")
          navigate("/login")
        } else {
          console.log("사용자 정보 조회 실패:", res)
        }
      } catch (error) {
        console.error("API 호출 중 오류 발생:", error)
      }
    }
    fetchMemberInfo() // 함수 호출
  }, [])

  const handleCharge = async (amount: number) => {
    try {
      console.log(amount)
      // 부모-계좌 충전 -> 계좌 출금(부모)
      const res = await depositBalanceApi(
        amount,
        parent.accountNumber,
        parent.userKey
      )
      if (res.stateCode === 201) {
        console.log(res)
        dispatch(
          parentActions.setUserInfo({ balance: parent.balance + amount })
        )
        dispatch(
          accountActions.setAccount({
            accountBalance: Number(account.accountBalance) - amount,
          })
        )
        alert("마니모 계좌에 머니가 충전되었습니다.") // 성공
      } else {
        alert("충전에 실패했습니다. 다시 시도해주세요.") // 실패
      }
    } catch (err) {
      console.log(err)
      alert("충전에 실패했습니다. 다시 시도해주세요.") // 예외 처리
    } finally {
      closeChargeModal() // 모달 닫기
    }
  }

  const handleRefund = async (amount: number) => {
    console.log(amount)
    // 부모-계좌 충전 -> 계좌 출금(부모)
    try {
      const res = await refundBalanceApi(
        amount,
        parent.accountNumber,
        parent.userKey
      )
      if (res.stateCode === 201) {
        console.log(res)
        alert("마니모 계좌의 머니가 환불되었습니다.") // 성공
        dispatch(
          parentActions.setUserInfo({ balance: parent.balance - amount })
        )
        dispatch(
          accountActions.setAccount({
            accountBalance: Number(account.accountBalance) + amount,
          })
        )
      } else {
        alert("환불에 실패했습니다. 다시 시도해주세요.") // 실패
      }
    } catch (err) {
      console.log(err)
      alert("환불에 실패했습니다. 다시 시도해주세요.") // 예외 처리
    } finally {
      closeRefundModal()
    }
  }

  if (!parent || !account) {
    return <div>로딩 중...</div> // 로딩 상태를 표시
  }

  return (
    <div className="flex w-full flex-col space-y-4">
      <Heading title="연결 계좌 정보" />
      <AccountInfo {...account} modalOnClick={openChargeModal} />
      {/* {...accountInfo} */}
      <div className="h-1" />

      <Heading title="마니모 계좌" />
      <MAccountInfo
        name={parent.name}
        balance={parent.balance}
        modalOnClick={openRefundModal}
      />
      <div className="h-1" />

      <Heading title="계좌 관리" />
      {parent.accountNumber ? (
        <ToggleList title="계좌 연동 해지">
          <div>계좌 연결을 해지하시겠습니까?</div>
        </ToggleList>
      ) : (
        <ToggleList title="계좌 연동하기">
          <RegisterAccount banks={banks} />
        </ToggleList>
      )}

      <PriceModal
        isOpen={isChargeOpen}
        title="충전"
        content="충전할 금액을 입력해주세요"
        balance={Number(account.accountBalance)}
        onRequestClose={closeChargeModal}
        onSave={(amount) => handleCharge(amount)}
      />

      <PriceModal
        isOpen={isRefundOpen}
        title="환불"
        content="환불할 금액을 입력해주세요"
        balance={parent.balance}
        onRequestClose={closeRefundModal}
        onSave={(amount) => handleRefund(amount)}
      />
    </div>
  )
}

const AccountInfo: React.FC<AccountInfoProps> = (props) => {
  const { bankName, accoutNo, accountName, accountBalance, modalOnClick } =
    props
  // props 값이 없는 경우
  const hasAccountInfo = bankName || accoutNo || accountName || accountBalance

  return (
    <div
      className={`flex h-[176px] w-full rounded-3xl p-6 shadow-md ${
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
            <button
              onClick={modalOnClick}
              className="mt-2 rounded-xl bg-primary-m1 px-4 py-2 text-white"
            >
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

const MAccountInfo: React.FC<MAccountInfoProps> = (props) => {
  const { name, balance, modalOnClick } = props
  return (
    <div className="flex w-full flex-col items-end rounded-3xl bg-secondary-50 p-6 shadow-md">
      <div className="flex w-full items-center justify-start">
        <b className="text-lg">{name}</b>
        <span className="ml-1">님의 잔액</span>
      </div>
      <span className="flex w-full flex-col items-end">
        <span className="text-right">
          <b className="mr-1">
            <span className="mr-5 text-secondary-600-m2">₩ </span>
            {Number(balance).toLocaleString()}
          </b>
          원
        </span>
        <button
          onClick={modalOnClick}
          className="mt-2 rounded-xl bg-secondary-600-m2 px-4 py-2 text-white"
        >
          환불 ↻
        </button>
      </span>
    </div>
  )
}

export default ParentAccountPage
