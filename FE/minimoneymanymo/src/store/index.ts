import { configureStore, combineReducers } from "@reduxjs/toolkit"
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist"
import storageSession from "redux-persist/lib/storage/session"
import parentReducer from "./slice/parent"
import accountReducer from "./slice/account"

// reducer를 여기에 추가하시면 됩니다
const rootReducer = combineReducers({
  parent: parentReducer,
  account: accountReducer,
})

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["parent", "account"], // 세션에 저장할 리듀서만 추가
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

// Redux 스토어의 state를 나타내는 타입
export type RootState = ReturnType<typeof store.getState>
// Redux 액션을 dispatch하는 함수의 타입
export type AppDispatch = typeof store.dispatch
export default store
