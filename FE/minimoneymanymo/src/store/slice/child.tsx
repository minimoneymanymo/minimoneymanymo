import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from ".."

interface ChildState {
  childrenId: number
  userId: string
  name: string
  profileImgUrl: string
  money: number // 보유머니
  withdrawableMoney: number // 출금가능금액
  totalAmount: number // 평가금 총합(주식보유내역의 가격총합의 합)
  userKey: number
  createdAt: string
  accountNumber: number
}

const initialState: ChildState = {
  childrenId: 0,
  userId: "",
  name: "",
  profileImgUrl: "",
  money: 0, // 보유머니
  withdrawableMoney: 0, // 출금가능금액
  totalAmount: 0, // 평가금 총합(주식보유내역의 가격총합의 합)
  userKey: 0,
  createdAt: "",
  accountNumber: 0,
}
export const childSlice = createSlice({
  name: "child",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserInfo: (state, action: PayloadAction<object>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const childActions = childSlice.actions // reducer 내 액션 호출 시 사용
export const selectChild = (state: RootState) => state.child
export default childSlice.reducer
