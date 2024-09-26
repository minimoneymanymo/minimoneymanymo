import { useChild } from "../context/ChildContext"
import { Children } from "./types"

interface MyChildProps {
  child: Children | Children
}

function MyChildItem({ child }: MyChildProps): JSX.Element {
  return (
    <div className="m-5 h-44 rounded-lg border">
      <p>Profile Image URL: {child.profileimgUrl || "No image available"}</p>
      <p>Name: {child.name}</p>
      {/* <p>User ID: {child.userId}</p> */}
      <p>보유머니: {child.money}</p>
      <p>평가금: {child.totalAmount}</p>
      <p>출금가능금액: {child.withdrawableMoney}</p>
    </div>
  )
}

export default MyChildItem
