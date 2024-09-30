import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from ".."

// state 타입 지정
interface ParentState {
  userId: string
  phoneNumber: string
  accountNumber: string
  name: string
  balance: number
  profileImgUrl: string
  userKey: string
}

const initialState: ParentState = {
  userId: "",
  phoneNumber: "",
  accountNumber: "",
  name: "",
  balance: 0,
  profileImgUrl: "",
  userKey: "",
}

export const parentSlice = createSlice({
  name: "parent",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    setUserInfo: (state, action: PayloadAction<object>) => {
      return { ...state, ...action.payload }
    },
    setUserKey: (state, action: PayloadAction<string>) => {
      state.userKey = action.payload
    },
    clearParent(state) {
      return initialState // 상태를 초기 상태로 리셋
    },
  },
})

export const parentActions = parentSlice.actions // reducer 내 액션 호출 시 사용
export const selectParent = (state: RootState) => state.parent // state.[rootReduce에 등록한 reducer 이름].[state 내 속성] -> parent는 전체값을 갖고 올거라 속성은 명시 X
export default parentSlice.reducer // reducer가 디폴트로 import 됨
