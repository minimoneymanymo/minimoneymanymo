import MyChildMoneySetting from "@/components/my-children/MyChildMoneySetting"
import MyChildWithdrawList from "@/components/my-children/MyChildWithdrawList"

function MyChildFinancePage(): JSX.Element {
  return (
    <>
      <MyChildMoneySetting />
      <MyChildWithdrawList />
    </>
  )
}

export default MyChildFinancePage
