import {
  inquireBankCodesApi,
  inquireAccountApi,
  withdrawApi,
  depositApi,
  authAccountApi,
  checkAuthCodeApi,
} from "@/api/account-api.ts"
import {
  requestWithdrawApi,
  getWithdrawListApi,
  approveRequestApi,
  linkAccountApi,
} from "@/api/fund-api"
import { makeParam } from "@/utils/fin-utils"

function ParentPage(): JSX.Element {
  return (
    <>
      <div className="">ParentPage</div>
      <button>API 확인</button>
    </>
  )
}

export default ParentPage
