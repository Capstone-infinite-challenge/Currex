import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";

function CurrencyCalculator() {
  const [currency, setCurrency] = useState("JPY"); // 기본 선택된 통화
  const [exchangeRates, setExchangeRates] = useState({}); // 모든 환율 저장
  const [coinData, setCoinData] = useState([]);
  const [billData, setBillData] = useState([]);
  const [totalCoin, setTotalCoin] = useState(0);
  const [totalBill, setTotalBill] = useState(0);

  const navigate = useNavigate();

  // 통화별 데이터 설정
  const currencyConfig = {
    JPY: {
      symbol: "\u00a5",
      coins: [
        { denomination: 1, amount: 0 },
        { denomination: 5, amount: 0 },
        { denomination: 10, amount: 0 },
        { denomination: 50, amount: 0 },
        { denomination: 100, amount: 0 },
        { denomination: 500, amount: 0 },
      ],
      bills: [
        { denomination: 1000, amount: 0 },
        { denomination: 5000, amount: 0 },
        { denomination: 10000, amount: 0 },
      ],
    },
    USD: {
      symbol: "\u0024",
      coins: [
        { denomination: 0.01, amount: 0 },
        { denomination: 0.05, amount: 0 },
        { denomination: 0.1, amount: 0 },
        { denomination: 0.25, amount: 0 },
        { denomination: 0.5, amount: 0 },
        { denomination: 1, amount: 0 },
      ],
      bills: [
        { denomination: 1, amount: 0 },
        { denomination: 5, amount: 0 },
        { denomination: 10, amount: 0 },
        { denomination: 20, amount: 0 },
        { denomination: 50, amount: 0 },
        { denomination: 100, amount: 0 },
      ],
    },
    EUR: {
      symbol: "\u20ac",
      coins: [
        { denomination: 0.01, amount: 0 },
        { denomination: 0.02, amount: 0 },
        { denomination: 0.05, amount: 0 },
        { denomination: 0.1, amount: 0 },
        { denomination: 0.2, amount: 0 },
        { denomination: 0.5, amount: 0 },
        { denomination: 1, amount: 0 },
        { denomination: 2, amount: 0 },
      ],
      bills: [
        { denomination: 5, amount: 0 },
        { denomination: 10, amount: 0 },
        { denomination: 20, amount: 0 },
        { denomination: 50, amount: 0 },
        { denomination: 100, amount: 0 },
        { denomination: 200, amount: 0 },
        { denomination: 500, amount: 0 },
      ],
    },
  };

  // 환율 API 호출
  useEffect(() => {
    axios
      .get("https://api.exchangerate-api.com/v4/latest/KRW")
      .then((response) => {
        setExchangeRates(response.data.rates);
      })
      .catch((error) => console.error("환율 API 호출 실패:", error));
  }, []);

  // 통화 변경 시 데이터 업데이트
  useEffect(() => {
    if (currencyConfig[currency]) {
      setCoinData(currencyConfig[currency].coins);
      setBillData(currencyConfig[currency].bills);
    }
  }, [currency]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleCoinChange = (index, value) => {
    const updatedCoins = [...coinData];
    updatedCoins[index].amount = parseInt(value) || 0;
    setCoinData(updatedCoins);
  };

  const handleBillChange = (index, value) => {
    const updatedBills = [...billData];
    updatedBills[index].amount = parseInt(value) || 0;
    setBillData(updatedBills);
  };

  useEffect(() => {
    const coinTotal = coinData.reduce(
      (acc, item) => acc + item.denomination * item.amount,
      0
    );
    setTotalCoin(coinTotal);

    const billTotal = billData.reduce(
      (acc, item) => acc + item.denomination * item.amount,
      0
    );
    setTotalBill(billTotal);
  }, [coinData, billData]);

  return (
    <Container>
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <CurrencySelector>
          <CurrencyDropdown value={currency} onChange={handleCurrencyChange}>
            <option value="JPY">JPY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
             <option value="CNY">CNY</option>
            <option value="HKD">HKD</option>
            <option value="TWD">TWD</option>
            <option value="AUD">AUD</option>
            <option value="VND">VND</option>
          </CurrencyDropdown>
          <DropdownIcon src={dropdown} alt="드롭다운 아이콘" />
        </CurrencySelector>
      </Header>

      <TitleContainer>
        <Title>{currencyConfig[currency]?.symbol} 환율 계산기</Title>
        <ExchangeRateText>1 {currency} = {exchangeRates[currency]?.toFixed(2) || 0} 원</ExchangeRateText>
      </TitleContainer>

      <Section>
        <SectionTitle>동전</SectionTitle>
        {coinData.map((coin, index) => (
          <Row key={coin.denomination}>
            <Denomination>{currencyConfig[currency].symbol}{coin.denomination}</Denomination>
            <Equals>=</Equals>
            <ValueContainer isHighlighted={coin.amount > 0}>
              <ConvertedValue>
                {(coin.denomination * (1 / exchangeRates[currency] || 0)).toFixed(2)} 원
              </ConvertedValue>
              <AmountInput
                type="number"
                value={coin.amount}
                onChange={(e) => handleCoinChange(index, e.target.value)}
              />
              <Unit>개</Unit>
            </ValueContainer>
          </Row>
        ))}
      </Section>

      <Section>
        <SectionTitle>지폐</SectionTitle>
        {billData.map((bill, index) => (
          <Row key={bill.denomination}>
            <Denomination>{currencyConfig[currency].symbol}{bill.denomination}</Denomination>
            <Equals>=</Equals>
            <ValueContainer isHighlighted={bill.amount > 0}>
              <ConvertedValue>
                {(bill.denomination * (1 / exchangeRates[currency] || 0)).toFixed(2)} 원
              </ConvertedValue>
              <AmountInput
                type="number"
                value={bill.amount}
                onChange={(e) => handleBillChange(index, e.target.value)}
              />
              <Unit>개</Unit>
            </ValueContainer>
          </Row>
        ))}
      </Section>

      <TotalContainer>
        <TotalText>{currencyConfig[currency]?.symbol} {totalCoin + totalBill}</TotalText>
        <TotalText>총 {((totalCoin + totalBill) * (1 / exchangeRates[currency] || 0)).toFixed(2)} 원</TotalText>
      </TotalContainer>
    </Container>
  );
}

export default CurrencyCalculator;

const Container = styled.div`
  width: 375px;
  height: 1062px;
  position: relative;
  background: white;
  box-shadow: 0px 8px 24px rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  overflow: hidden;
  font-family: "Pretendard", sans-serif;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const BackButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-left:0px;
`;

const CurrencySelector = styled.div`
  display: flex;
  align-items: center;
  margin-left:0px;
`;

const CurrencyDropdown = styled.select`
  font-size: 16px;
  font-weight: 600;
  border: none;
  background: none;
  cursor: pointer;
`;

const DropdownIcon = styled.img`
  position: absolute;
  left:2px;
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  margin-left:50px;
`;

const TitleContainer = styled.div`
  padding: 20px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #1f2024;
`;

const ExchangeRateText = styled.p`
  font-size: 13px;
  font-weight: 300;
  color: #898d99;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;


const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1f2024;
  margin-bottom: 16px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  margin-left:10px;
`;

const Denomination = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #1f2024;
  margin-right: 8px;
`;

const Equals = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #8ea0ac;
  margin-right: 8px;
`;

const ValueContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  padding: 8px;
  border: 1px solid ${({ isHighlighted }) => (isHighlighted ? "#CA2F28" : "#F1F1F1")};
  border-radius: 8px;

`;

const ConvertedValue = styled.span`
  flex: 1;
  text-align: right;
  font-size: 13px;
  font-weight: 400;
  color: #1f2024;
`;

const AmountInput = styled.input`
  width: 40px;
  text-align: right;
  font-size: 13px;
  font-weight: 400;
  border: none;
  outline: none;
  margin-left: 8px;
  margin-right: 4px;
`;

const Unit = styled.span`
  font-size: 13px;
  font-weight: 400;
  color: #8ea0ac;
`;

const TotalContainer = styled.div`
  position: fixed;
  bottom: 0px;
  left: 0;
  width: 100%;
  padding: 16px;
  background: black;
  box-shadow: 0px -5px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 16px 16px 0 0;
`;

const TotalText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: white;
`;
