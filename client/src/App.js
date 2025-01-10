import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "../src/components/style/GlobalStyle";
import BuyMoney from "../src/components/views/BuyerPage/BuyMoney";
import Calculator from "../src/components/views/BuyerPage/CurrencyCalculator";
import SellerMatch from "../src/components/views/BuyerPage/SellerMatch";
import SellMoney from "../src/components/views/SellerPage/SellMoney";
import Chat from "../src/components/views/ChattingPage/Chat";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route exact path="/buy" element={<BuyMoney />} />
          <Route exact path="/SellerMatch" element={<SellerMatch />} />
          <Route exact path="/calculator" element={<Calculator />} />
          <Route exact path="/sell" element={<SellMoney />} />
          <Route exact path="/chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;