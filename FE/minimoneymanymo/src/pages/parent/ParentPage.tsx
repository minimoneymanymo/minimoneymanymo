import {
  inquireBankCodesApi,
  inquireAccountApi,
  withdrawApi,
  depositApi,
  authAccountApi,
  checkAuthCodeApi,
} from "@/api/account-api.ts"
import {
  depositBalanceApi,
  refundBalanceApi,
  requestWithdrawApi,
  getWithdrawListApi,
  approveRequestApi,
  linkAccountApi,
} from "@/api/fund-api"
import { makeParam } from "@/utils/fin-utils"

function ParentPage(): JSX.Element {
  const param = makeParam("inquireBankCodes")

  // 은행코드 불러오기
  const getBankCodes = () => {
    inquireBankCodesApi(
      param,
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 1원 인증
  const authAccount = () => {
    authAccountApi(
      makeParam("openAccountAuth", {
        accountNo: "입력한 계좌번호",
        authText: "ssafy",
      }),
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 1원 인증 검증 -> 계좌 연결
  const checkAuthCode = () => {
    checkAuthCodeApi(
      makeParam("inquireDemandDepositAccount", {
        accountNo: "입력한 계좌번호",
        authText: "ssafy",
        authCode: "확인한 인증코드",
      }),
      (res) => {
        console.log(res)
        linkAccountApi(
          { accountNumber: "입력한 계좌번호", bankCode: "123" },
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log(err)
          }
        )
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 계좌 조회
  const inquireAccount = () => {
    inquireAccountApi(
      makeParam("inquireDemandDepositAccount", {
        accountNo: "입력한 계좌번호",
      }),
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 계좌 입금
  const deposit = () => {
    depositApi(
      makeParam("updateDemandDepositAccountDeposit", {
        accountNo: "입력한 계좌번호",
        transactionBalance: "입금할 금액",
      }),
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 계좌 출금
  const withdraw = () => {
    withdrawApi(
      makeParam("updateDemandDepositAccountWithdrawal", {
        accountNo: "입력한 계좌번호",
        transactionBalance: "출금할 금액",
      }),
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 아래는 mmmm API
  let data = 1000
  // 부모-계좌 충전 -> 계좌 출금(부모)
  const depositBalance = () => {
    depositBalanceApi(
      data, // 잔액
      (res) => {
        console.log("mmmm -> " + res)
        withdrawApi(
          makeParam("updateDemandDepositAccountWithdrawal", {
            accountNo: "부모 계좌번호",
            transactionBalance: "출금할 금액",
          }),
          (res) => {
            console.log("fin -> " + res)
          },
          (err) => {
            console.log(err)
          }
        )
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 부모-계좌 환불 -> 계좌 입금(부모)
  const refundBalance = () => {
    refundBalanceApi(
      data,
      (res) => {
        console.log(res)
        depositApi(
          makeParam("updateDemandDepositAccountDeposit", {
            accountNo: "부모 계좌번호",
            transactionBalance: "입금할 금액",
          }),
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log(err)
          }
        )
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 자식-출금 요청
  const requestWithdraw = () => {
    requestWithdrawApi(
      { withdrawableMoney: 1000 },
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 자식-출금 요청 내역
  const getWithdrawList = () => {
    getWithdrawListApi(
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 부모-출금 요청 승인 -> 계좌 입금(자식)
  let body = {
    childrenId: 1,
    creaatedAt: "20240923124100",
    amount: 12000,
  }
  const approveRequest = () => {
    approveRequestApi(
      body,
      (res) => {
        console.log(res)
        depositApi(
          makeParam("updateDemandDepositAccountDeposit", {
            accountNo: "자식 계좌번호",
            transactionBalance: "입금할 금액",
          }),
          (res) => {
            console.log(res)
          },
          (err) => {
            console.log(err)
          }
        )
      },
      (err) => {
        console.log(err)
      }
    )
  }

  // 계좌 연결
  const linkAccount = () => {
    linkAccountApi(
      { accountNumber: "123123123", bankCode: "123" },
      (res) => {
        console.log(res)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  return (
    <>
      <div className="">ParentPage</div>
      <button onClick={getBankCodes}>API 확인</button>
    </>
  )
}

export default ParentPage
