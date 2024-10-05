import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from ".."

const initialState = {
  isTooltipEnabled: true,
}

const tooltipSlice = createSlice({
  name: "tooltip",
  initialState,
  reducers: {
    toggleTooltip(state) {
      state.isTooltipEnabled = !state.isTooltipEnabled
    },
    setTooltip(state, action: PayloadAction<boolean>) {
      if (action.payload) {
        state.isTooltipEnabled = true
      } else {
        state.isTooltipEnabled = false
      }
    },
  },
})

export const tooltipActions = tooltipSlice.actions // reducer 내 액션 호출 시 사용
export const selectTooltip = (state: RootState) =>
  state.tooltip.isTooltipEnabled // state.[rootReduce에 등록한 reducer 이름].[state 내 속성] -> parent는 전체값을 갖고 올거라 속성은 명시 X
export default tooltipSlice.reducer // reducer가 디폴트로 import 됨
