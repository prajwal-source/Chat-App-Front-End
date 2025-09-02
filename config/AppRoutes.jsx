import { Route, Routes } from "react-router";

import ChatPage from "../component/ChatPage";
import App from "../src/App";
function AppRoute() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/about" element={<h1>Hii I am Routed About</h1>} />
      <Route path="/*" element={<h1>404 Not found</h1>} />

    </Routes>
  )
}
export default AppRoute