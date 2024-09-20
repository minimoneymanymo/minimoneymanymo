import { inquireBankCodes, inquireAccount, withdraw, deposit, authAccount, checkAuthCode } from "@/api/account-api.ts";
import { makeParam, getNow } from "@/utils/fin-utils";

function ParentPage(): JSX.Element {
  const param = makeParam(
    "inquireBankCodes",
     getNow()
  )
  
  const executeAPI = () => {
    inquireBankCodes(param, (res) => {
      console.log(res)
    }, (err) => {
      console.log(err)
    })
  }

  return (
    <>
      <div className="">ParentPage</div>
      <button onClick={executeAPI}>
        API 확인
      </button>
    </>
  )
}

export default ParentPage
