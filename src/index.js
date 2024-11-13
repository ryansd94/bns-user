import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import { BrowserRouter } from "react-router-dom"
import { Provider } from "react-redux"
import "./i18n"
import * as serviceWorker from "./serviceWorker"
import store from "app/store"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename="">
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root"),
)

serviceWorker.unregister()
