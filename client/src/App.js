import { BrowserRouter, Route, Routes } from "react-router-dom";
import GlobalStyle from "../src/components/style/GlobalStyle";
import BuyMoney from "../src/components/views/BuyerPage/BuyMoney";

function App() {
  return (
    <div className="App">
      <GlobalStyle /> 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<BuyMoney />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
