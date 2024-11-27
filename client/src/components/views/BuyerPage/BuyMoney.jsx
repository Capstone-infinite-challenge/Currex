import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function BuyMoney() {
  const [currency, setCurrency] = useState(""); // 외화 종류
  const [minAmount, setMinAmount] = useState(""); // 거래 희망 최소 금액
  const [maxAmount, setMaxAmount] = useState(""); // 거래 희망 최대 금액
  const [exchangeRate, setExchangeRate] = useState(0); // 실시간 환율
  const [KRW_minAmount, setKRWMinAmount] = useState(""); // 환산된 최소 원화 금액
  const [KRW_maxAmount, setKRWMaxAmount] = useState(""); // 환산된 최대 원화 금액
  const [userLocation, setUserLocation] = useState(""); // 거래 희망 위치
  const navigate = useNavigate();

  // Kakao 주소 검색 모달 열기
  const openKakaoPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const fullAddress = data.address; // 선택된 주소
        setUserLocation(fullAddress); // 주소 업데이트
      },
    }).open(); // Kakao Postcode 모달 열기
  };

  // 실시간 환율 API
  useEffect(() => {
    if (currency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates.KRW || 0); // KRW 환율 설정
        })
        .catch((error) => console.error("환율 API 호출 실패:", error));
    }
  }, [currency]);

  // 원화 환산 금액 계산
  useEffect(() => {
    if (minAmount && exchangeRate) {
      setKRWMinAmount(Math.floor(minAmount * exchangeRate)); // 소수점 제거
    } else {
      setKRWMinAmount("");
    }

    if (maxAmount && exchangeRate) {
      setKRWMaxAmount(Math.floor(maxAmount * exchangeRate)); // 소수점 제거
    } else {
      setKRWMaxAmount("");
    }
  }, [minAmount, maxAmount, exchangeRate]);

 
 // 판매자 추천 받으러 가기 버튼 클릭 시 실행
const handleNavigate = async () => {
  const requestData = {
    currency,
    minAmount,
    maxAmount,
    userLocation,
  };

  try {
    // 백엔드 서버가 http://localhost:5000에서 실행되고 있음 (일단 일케 해놨는데 app.js 바꿔도됨)
    const response = await axios.post("http://localhost:5000/buy", requestData, {
      headers: {
        "Content-Type": "application/json", // JSON 형식으로 데이터 전송
      },
    });

    console.log("백엔드 응답 데이터:", response.data); //성공

    // 성공적으로 응답을 받으면 페이지 이동
    navigate("/SellerMatch");
  } catch (error) {
    console.error("백엔드 요청 중 오류 발생:", error);

    // 사용자에게 오류 메시지 표시
    if (error.response) {
      // 서버가 응답한 경우
      console.error("서버 응답:", error.response.data);
      alert(`오류: ${error.response.data.error || "서버 오류 발생"}`);
    } else {
      alert("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
    }
  }
};

  return (
    <Container>
      <Title>외화를 구매하고 싶어요!</Title>
      <Form>
        {/* 거래 통화 */}
        <Label>
          거래 통화
          <Select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="">선택</option>
            <option value="JPY">JPY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </Select>
        </Label>

        {/* 거래 희망 금액 범위 */}
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
              {currency && <Suffix>{currency}</Suffix>}
            </InputContainer>
            <span>~</span>
            <InputContainer>
              <Input
                type="number"
                placeholder="최대 금액"
                value={maxAmount}
                onChange={(e) => setMaxAmount(e.target.value)}
              />
              {currency && <Suffix>{currency}</Suffix>}
            </InputContainer>
          </AmountRange>
        </Label>

        {/* 원화 환산 금액 */}
        <Label>
          원화 환산 금액
          <AmountRange>
            <InputContainer>
              <Input type="text" readOnly value={KRW_minAmount} />
              <Suffix>KRW</Suffix>
            </InputContainer>
            <span>~</span>
            <InputContainer>
              <Input type="text" readOnly value={KRW_maxAmount} />
              <Suffix>KRW</Suffix>
            </InputContainer>
          </AmountRange>
          <Note>소수점은 절사된 금액입니다.</Note>
        </Label>

        {/* 거래 희망 위치 */}
        <Label>
          거래 희망 위치
          <LocationInputContainer>
            <Input
              type="text"
              placeholder="주소 입력"
              value={userLocation}
              readOnly
            />
            <LocationButton onClick={openKakaoPostcode}>
              주소 검색
            </LocationButton>
          </LocationInputContainer>
        </Label>

        {/* 버튼 */}
        <SubmitButton onClick={handleNavigate}>
          판매자 추천 받으러 가기
        </SubmitButton>
      </Form>
    </Container>
  );
}

export default BuyMoney;


const Container = styled.div`
  font-family: "Arial", sans-serif;
  padding: 16px;
  max-width: 360px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const Title = styled.h1`
  font-size: 30px;
  color: #ff5a5f;
  text-align: center;
  margin-bottom: 50px;
  margin-top: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 30px;
  margin-top: 20px;
  margin-left: 0;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 20px;
`;

const AmountRange = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 8px;

  span {
    font-size: 14px;
  }
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  margin-top: 10px;
`;

const Suffix = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #888;
  margin-top: 7px;
`;

const Note = styled.p`
  font-size: 12px;
  color: #888;
  margin-top: 4px;
`;

const LocationInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  gap: 15px;
`;

const LocationButton = styled.button`
  background: #ff5a5f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 12px;
  cursor: pointer;
  width: 120px;
  margin-top: 10px;
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 12px;
  font-size: 24px;
  color: #fff;
  background-color: #ff5a5f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;
