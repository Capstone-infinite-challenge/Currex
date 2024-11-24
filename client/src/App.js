import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "../src/components/style/GlobalStyle";
import BuyMoney from "../src/components/views/BuyerPage/BuyMoney";
import SellerMatch from "../src/components/views/BuyerPage/SellerMatch";

function App() {
  return (
    <div className="App">
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<BuyMoney />} />
          <Route exact path="/SellerMatch" element={<SellerMatch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
