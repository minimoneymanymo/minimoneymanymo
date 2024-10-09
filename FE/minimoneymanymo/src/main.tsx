import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import App from "./App.tsx"
import "./index.css"

// redux 설정
import { Provider } from "react-redux"
import store from "./store"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"

const persistor = persistStore(store)

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </BrowserRouter>
)
