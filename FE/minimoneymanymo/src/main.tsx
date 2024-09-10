import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import store, {persistor} from "./store/store.tsx" // store 파일 경로에 맞게 수정

import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <StrictMode>
          <App />
        </StrictMode>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)
