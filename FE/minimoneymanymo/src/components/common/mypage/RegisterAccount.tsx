import {
  authAccountApi,
  checkAuthCodeApi,
  inquireAccountApi,
} from "@/api/account-api"
import { linkAccountApi } from "@/api/fund-api"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { accountActions, selectAccount } from "@/store/slice/account"
import { Bank } from "@/types/accountTypes"
import React, { useState } from "react"
import Swal from "sweetalert2"

// 은행 리스트 받아오기
const RegisterAccount: React.FC<{ banks: Bank[]; userKey: string }> = ({
  banks,
  userKey,
}) => {
  const account = useAppSelector(selectAccount)
  const [checkAuth, setCheckAuth] = useState(false)
  const [accountNumber, setAccountNumber] = useState("") // 계좌번호
  const [selectedBank, setSelectedBank] = useState("") // 선택한 은행
  const [authCode, setAuthCode] = useState("") // 인증 번호
  const dispatch = useAppDispatch()

  const handleAuthClick = async () => {
    if (!accountNumber || !selectedBank) {
      //alert("계좌번호와 은행을 입력해주세요.")
      Swal.fire({
        text: "계좌번호와 은행을 입력해주세요.",
        icon: "warning",
      })
      return
    }

    // 1원 인증
    const res = await authAccountApi(accountNumber, "ssafy", userKey)
    if (res != null) {
      setCheckAuth(true)
    }
  }

  const verifyAuth = async () => {
    const res = await checkAuthCodeApi(
      accountNumber,
      "ssafy",
      authCode,
      userKey
    )
    if (res != null) {
      const res1 = await inquireAccountApi(accountNumber, userKey)
      console.log(res1)
      if (res1 != null) {
        const { bankName, accountNo, accountName, accountBalance } = res1.REC

        const accountPayload = {
          bankName,
          accountNo,
          accountName,
          accountBalance,
        }
        dispatch(accountActions.setAccount(accountPayload))
      }
      const res2 = await linkAccountApi(accountNumber)
      console.log(res2)
      if (res2.stateCode == 201) {
        //alert("계좌가 연결되었습니다.")
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "계좌가 연결되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        })
        console.log(account)
        // window.location.reload()
      } else {
        //alert("에러가 발생했습니다. 다시 시도해주세요.")
        Swal.fire({
          icon: "error",
          text: "에러가 발생했습니다. 다시 시도해주세요.",
        })
      }
    } else {
      //alert("인증번호가 일치하지 않습니다. 다시 입력해주세요.")
      Swal.fire({
        title: "인증번호가 일치하지 않습니다. 다시 입력해주세요.",
        icon: "warning",
      })
    }
  }

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex w-full">
        <div className="flex flex-1 flex-col space-y-4 pr-2">
          {/* 계좌번호 입력란 */}
          <div className="flex items-center space-x-2">
            <span className="w-20">계좌번호</span>
            <input
              type="text"
              placeholder="계좌번호를 입력하세요"
              className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
              value={accountNumber} // 계좌번호 상태 연결
              onChange={(e) => setAccountNumber(e.target.value)} // 상태 업데이트
            />
          </div>

          {/* 은행 선택란 */}
          <div className="flex items-center space-x-2">
            <span className="w-20">은행</span>
            <select
              className="flex-1 rounded-md border border-gray-300 p-2 text-gray-500 focus:outline-none focus:ring focus:ring-gray-300"
              value={selectedBank} // 선택한 은행 상태 연결
              onChange={(e) => setSelectedBank(e.target.value)} // 상태 업데이트
            >
              <option value="" disabled>
                은행
              </option>
              {banks.map((bank) => (
                <option key={bank.bankCode} value={bank.bankCode}>
                  {bank.bankName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 인증 버튼 */}
        <div className="ml-2 flex w-1/5 items-center">
          <button
            className="mt-2 rounded bg-secondary-600-m2 px-5 py-2 text-white"
            onClick={handleAuthClick} // 인증 버튼 클릭 시 checkAuth 값 변경
          >
            인증
          </button>
        </div>
      </div>

      {/* 1원 인증 검증 */}
      {checkAuth && ( // checkAuth가 true일 때만 표시
        <div className="ml-20 mt-2 text-gray-700">
          <div className="p-2">
            <p>
              고객님의 계좌 인증을 위해 <b>1원을 입금</b>하였습니다.
            </p>
            <p>입금자명을 확인한 후, 숫자 4개를 입력해주세요.</p>
          </div>
          <div className="p-2">
            <input
              type="text"
              placeholder="인증 번호"
              className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring focus:ring-gray-300"
              value={authCode} // 인증 번호 상태 연결
              onChange={(e) => setAuthCode(e.target.value)} // 상태 업데이트
            />
            <button
              onClick={verifyAuth} // 인증 버튼 클릭 시 verifyAuth 호출
              className="ml-2 rounded bg-secondary-600-m2 px-5 py-2 text-white"
            >
              인증
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default RegisterAccount
