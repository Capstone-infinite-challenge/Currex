import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";
import searchicon from "../../images/searchicon.svg";

function BuyMoney() {
  const [currency, setCurrency] = useState("USD"); // 기본 선택된 통화
  const [exchangeRate, setExchangeRate] = useState(0); // 환율 기본값 설정
  const [minAmount, setMinAmount] = useState(""); // 거래 희망 최소 금액
  const [maxAmount, setMaxAmount] = useState(""); // 거래 희망 최대 금액
  const [KRW_minAmount, setKRWMinAmount] = useState(""); // 환산된 최소 원화 금액
  const [KRW_maxAmount, setKRWMaxAmount] = useState(""); // 환산된 최대 원화 금액
  const [userLocation, setUserLocation] = useState(""); // 거래 희망 위치

  const navigate = useNavigate();

  useEffect(() => {
    if (currency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates.KRW || 0); // 환율 데이터 업데이트
        })
        .catch((error) => console.error("환율 API 호출 실패:", error));
    }
  }, [currency]);

  useEffect(() => {
    if (minAmount && exchangeRate) {
      setKRWMinAmount(Math.floor(minAmount * exchangeRate));
    } else {
      setKRWMinAmount("");
    }

    if (maxAmount && exchangeRate) {
      setKRWMaxAmount(Math.floor(maxAmount * exchangeRate));
    } else {
      setKRWMaxAmount("");
    }
  }, [minAmount, maxAmount, exchangeRate]);

  const openKakaoPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setUserLocation(data.address);
      },
    }).open();
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value); // 통화 변경
  };

  return (
    <Container>
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <CurrencySelector>
          <CurrencyDropdownContainer>
          <CurrencyDropdown value={currency} onChange={handleCurrencyChange}>
            <option value="USD">🇺🇸 USD</option>
            <option value="JPY">🇯🇵 JPY</option>
            <option value="EUR">🇪🇺 EUR</option>
          </CurrencyDropdown>
        <DropdownIcon src={dropdown} alt="드롭다운 아이콘" />
        </CurrencyDropdownContainer>
        </CurrencySelector>

      </Header>

      <TitleContainer>
        <Title>외화를 얼마나<br />구매하고 싶으신가요?</Title>
        <ExchangeRateText>1 {currency} = {exchangeRate.toLocaleString()} 원</ExchangeRateText>
      </TitleContainer>

      <Form>
        <Label>
          거래 희망 금액 범위
          <AmountRange>
            <InputContainer>
              <Input
                type="number"
                placeholder="최소 금액"
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
              />
              <Suffix>{currency}</Suffix>
            </InputContainer>
            <RangeSeparator>-</RangeSeparator>
            <InputContainer>
              <Input
                type="number"
                placeholder="최대 금액"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
              <Suffix>{currency}</Suffix>
            </InputContainer>
          </AmountRange>
        </Label>

        <Label>
          원화 환산 금액
          <AmountRange>
            <InputContainer>
              <Input type="text" readOnly value={KRW_minAmount} />
              <Suffix>KRW</Suffix>
            </InputContainer>
            <RangeSeparator>-</RangeSeparator>
            <InputContainer>
              <Input type="text" readOnly value={KRW_maxAmount} />
              <Suffix>KRW</Suffix>
            </InputContainer>
          </AmountRange>
          <Note>소수점은 절삭된 금액입니다.</Note>
        </Label>

        <Label>
          거래 희망 위치
            <WideInput type="text" placeholder="주소 입력" value={userLocation} readOnly />
            <LocationButton onClick={openKakaoPostcode}>
              <SearchIcon src={searchicon} alt="주소 검색" />
            </LocationButton>
        </Label>

        <InfoText>거래 희망 금액과 위치를 기반으로 AI가 최적의 판매자를 추천합니다.</InfoText>

        <SubmitButton>AI에게 추천 받기</SubmitButton>
      </Form>
    </Container>
  );
}

export default BuyMoney;

const Container = styled.div`
  width: 375px;
  height: 812px;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 8px 24px rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  overflow: hidden;
  font-family: 'Pretendard', sans-serif;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  backdrop-filter: blur(8px);
  padding: 0 12px;
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 0px;
`;

const CurrencyDropdown = styled.select`
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  appearance: none; /* 기본 드롭다운 스타일 제거 */
  padding: 4px 8px;
`;

const CurrencySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left:10px;
`;

const SelectedCurrency = styled.div`
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
`;
const CurrencyDropdownContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;
const DropdownIcon = styled.img`
  position: absolute;
  right: 0px; /* 드롭다운 아이콘 위치 조정 */
  top: 50%;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
  pointer-events: none; /* 아이콘 클릭 방지 */
`;

const TitleContainer = styled.div`
  padding: 20px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  color: #1F2024;
`;

const ExchangeRateText = styled.p`
  font-size: 13px;
  font-weight: 300;
  line-height: 20px;
  color: #898D99;
`;

const Form = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 400;
  color: #8EA0AC;
  line-height: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left:0px
`;

const AmountRange = styled.div`
  display: flex;
  gap: 8px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 11px; /* 내부 여백 조정 */
  font-size: 14px; /* 글씨 크기 조정 */
  border: 1px solid #ccc; /* 테두리 색상 및 두께 */
  border-radius: 8px; /* 테두리 둥글기 */
  box-sizing: border-box; /* 여백 포함 */
  margin-top: 0px; /* 위쪽 간격 */
  margin-left:0px;

  ::placeholder {
    font-size: 14px;
    color: #888; /* 기본 placeholder 색상 */
    transition: color 0.3s ease; /* 색상 변경 애니메이션 */
  }

  &:focus::placeholder {
    color: red; /* 포커스 시 placeholder 색상 변경 */
  }

  &:focus {
    outline: none; /* 기본 outline 제거 */
    border: 1px solid #CA2F28; /* 테두리 색상 변경 */
  }
`;

const Suffix = styled.span`
  position: absolute;
  right: 10px; /* 오른쪽 여백 */
  top: 30%;
  transform: translateY(-50%);
  font-size: 14px; /* 글씨 크기 */
  color: #888; /* 텍스트 색상 */
  margin-top: 7px; /* 위쪽 간격 */
`;


const RangeSeparator = styled.span`
  color: #1F2024;
  font-size: 13px;
`;

const Note = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: #666666;
  line-height: 12px;
  margin-left:0px;

`;


const LocationButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchIcon = styled.img`
  position: absolute;
  right: 12px; /* 아이콘 위치: 오른쪽 간격 */
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  margin-bottom:50px;
`;

const InfoText = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: #8EA0AC;
  text-align: center;
  margin-top:100px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: #CA2F28;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  border: none;
  border-radius: 12px;
  box-shadow: 0px 5px 10px rgba(26, 26, 26, 0.1);
  cursor: pointer;
`;

const WideInput = styled.input`
  width: 150%;
  padding: 11px; /* 내부 여백 조정 */
  font-size: 14px; /* 글씨 크기 조정 */
  border: 1px solid #ccc; /* 테두리 색상 및 두께 */
  border-radius: 8px; /* 테두리 둥글기 */
  box-sizing: border-box; /* 여백 포함 */
  margin-top: 0px; /* 위쪽 간격 */
  margin-left:0px;

  ::placeholder {
    font-size: 14px;
    color: #888; /* 기본 placeholder 색상 */
    transition: color 0.3s ease; /* 색상 변경 애니메이션 */
  }

  &:focus::placeholder {
    color: red; /* 포커스 시 placeholder 색상 변경 */
  }

  &:focus {
    outline: none; /* 기본 outline 제거 */
    border: 1px solid #CA2F28; /* 테두리 색상 변경 */
  }
`;