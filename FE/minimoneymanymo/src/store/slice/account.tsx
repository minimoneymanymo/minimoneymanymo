import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from ".."
import { AccountState } from "@/types/accountTypes"

const initialState: AccountState = {
  bankName: "",
  accountNo: "",
  accountName: "",
  accountBalance: "",
}

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<object>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const accountActions = accountSlice.actions // reducer 내 액션 호출 시 사용
export const selectAccount = (state: RootState) => state.account // state.[rootReduce에 등록한 reducer 이름].[state 내 속성] -> parent는 전체값을 갖고 올거라 속성은 명시 X
export default accountSlice.reducer // reducer가 디폴트로 import 됨
