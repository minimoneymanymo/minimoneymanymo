
import { Child } from "./types"

interface MyChildItemProps {
  child: Child
}

function MyChildItem({child}: MyChildItemProps) {
  return (
    <>
      <p>Name: {child.name}</p>
      <p>Created At: {child.createdAt}</p>
      <p>Money: {child.money}</p>
      <p>Total Amount: {child.totalAmount}</p>
      <p>Withdrawable Money: {child.withdrawableMoney}</p>
      <p>User ID: {child.userId}</p>
      <p>Profile Image URL: {child.profileimgUrl || "No image available"}</p>
    </>
  )
}

export default MyChildItem
