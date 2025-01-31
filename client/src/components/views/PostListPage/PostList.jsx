import React, { useState, useEffect } from "react";
import styled from "styled-components";
import infoicon from "../../images/infoicon.svg";
import NavBar from "../NavBar/NavBar";
import locationicon from "../../images/locationicon.svg";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";

function PostList() {
  const navigate = useNavigate();
  const [sells, setSells] = useState([]); // 판매글 데이터 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [filteredSells, setFilteredSells] = useState([]); // 필터링된 판매 데이터

  // 필터 상태
  const [selectedCountries, setSelectedCountries] = useState([]); // 선택한 국가
  const [minWon, setMinWon] = useState(""); // 최소 금액 (원화)
  const [maxWon, setMaxWon] = useState(""); // 최대 금액 (원화)

  const [showCountryFilter, setShowCountryFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  

  useEffect(() => {
    const fetchSells = async () => {
      setLoading(true);
      setError(null);

      try {
        const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        console.log("현재 저장된 accessToken:", accessToken);

        if (!accessToken) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/sell/sellList", { 
          headers: {
          "Content-Type": "multipart/form-data",
           Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });

        console.log("불러온 판매 데이터:", response.data);
        setSells(response.data);
      } catch (err) {
        console.error("판매 목록 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSells();
  }, [navigate]);

  // 실시간 환율 가져오기
  const [exchangeRates, setExchangeRates] = useState({}); // 환율 데이터를 저장할 상태

  useEffect(() => {
  const fetchExchangeRates = async () => {
    const uniqueCurrencies = [...new Set(sells.map((sell) => sell.currency))]; // 중복 제거
    const rates = {};

    try {
      // 각 통화에 대한 환율 데이터를 비동기적으로 가져오기
      await Promise.all(
        uniqueCurrencies.map(async (currency) => {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
          rates[currency] = response.data.rates.KRW; // KRW에 대한 환율 저장
        })
      );

      setExchangeRates(rates); // 가져온 환율 데이터 상태 업데이트
    } catch (error) {
      console.error("환율 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  if (sells.length > 0) {
    fetchExchangeRates();
  }
}, [sells]);

// 🔥 필터링 기능 (국가 + 원화 기준 금액)
useEffect(() => {
  let filtered = sells;

  // 🔹 선택한 국가에 해당하는 데이터만 필터링
  if (selectedCountries.length > 0) {
    filtered = filtered.filter((sell) => selectedCountries.includes(sell.currency));
  }

  // 🔹 원화 기준 금액 필터 적용
  if (minWon !== "" || maxWon !== "") {
    filtered = filtered.filter((sell) => {
      const wonPrice = exchangeRates[sell.currency] ? sell.amount * exchangeRates[sell.currency] : null;
      if (wonPrice === null) return false;

      const minCheck = minWon === "" || wonPrice >= parseFloat(minWon);
      const maxCheck = maxWon === "" || wonPrice <= parseFloat(maxWon);
      return minCheck && maxCheck;
    });
  }

  setFilteredSells(filtered);
}, [selectedCountries, minWon, maxWon, sells, exchangeRates]);

// 🔹 국가 선택 핸들러
const handleCountryChange = (currency) => {
  setSelectedCountries((prev) =>
    prev.includes(currency) ? prev.filter((c) => c !== currency) : [...prev, currency]
  );
};

  const handleNavigateToBuy = () => navigate("/buy");
  const handleRegisterClick = () => navigate("/sell");

  return (
    <Container>
     <Header>
        <FilterButton onClick={() => setShowCountryFilter(true)}>
          국가 {selectedCountries.length > 0 ? selectedCountries.join(", ") : "전체"} ▸
        </FilterButton>
        <FilterButton onClick={() => setShowPriceFilter(true)}>
          금액 범위 {minWon && maxWon ? `${minWon} - ${maxWon}원` : "설정하기"} ▸
        </FilterButton>
      </Header>

      {/* 국가 필터 모달 */}
      {showCountryFilter && (
        <Modal>
          <ModalContent>
            <h3>국가 선택</h3>
            {["USD", "JPY", "EUR"].map((currency) => (
              <CountryButton
                key={currency}
                selected={selectedCountries.includes(currency)}
                onClick={() => handleCountryChange(currency)}
              >
                {currency}
              </CountryButton>
            ))}
            <ModalActions>
              <CloseButton onClick={() => setShowCountryFilter(false)}>닫기</CloseButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}

      {/* 금액 필터 모달 */}
      {showPriceFilter && (
        <Modal>
          <ModalContent>
            <h3>금액 범위 선택</h3>
            <PriceInputContainer>
              <PriceInput
                type="number"
                placeholder="최소 원화"
                value={minWon}
                onChange={(e) => setMinWon(e.target.value)}
              />
              <span> - </span>
              <PriceInput
                type="number"
                placeholder="최대 원화"
                value={maxWon}
                onChange={(e) => setMaxWon(e.target.value)}
              />
            </PriceInputContainer>
            <ModalActions>
              <ConfirmButton onClick={() => setShowPriceFilter(false)}>확인</ConfirmButton>
            </ModalActions>
          </ModalContent>
        </Modal>
      )}



      {loading ? (
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>데이터를 불러오지 못했습니다.</ErrorMessage>
      ) : sells.length === 0 ? (
        <NoDataMessage>판매 글이 없습니다.</NoDataMessage>
      ) : (
        <PostListContainer>
          {sells.map((sell) => (
          <Post key={sell._id} onClick={() => navigate(`/sell/${sell._id}`)}>
          <ImageContainer>
            {sell.images && sell.images.length > 0 ? (
           <PostImage src={sell.images[0]} alt="상품 이미지" />
             ) : (
             <NoImage>이미지 없음</NoImage>
            )}
          </ImageContainer>

          <PostInfo>
          <Currency>{sell.currency}</Currency>
          <Amount>{sell.amount} {sell.currency}</Amount>
          <Details>
            <Distance>📍 {sell.sellerLocation ? sell.sellerLocation : "위치 정보 없음"}</Distance>
            <Won>
            {exchangeRates[sell.currency]
            ? `${Math.round(sell.amount * exchangeRates[sell.currency])} 원`
            : "환율 정보 없음"}
           </Won>
          </Details>
          </PostInfo>

    </Post>
))}
        </PostListContainer>
      )}

      <RegisterButton onClick={handleRegisterClick}>판매등록 +</RegisterButton>

      <RecommendationSection>
        <InfoContainer>
          <img src={infoicon} alt="info icon" width="16" height="16" />
          <InfoText>AI에게 판매자를 추천받아 보세요</InfoText>
        </InfoContainer>
        <RecommendationButton onClick={handleNavigateToBuy}>추천받기</RecommendationButton>
      </RecommendationSection>

      <NavBar active="list" />
    </Container>
  );
}

export default PostList;

const Container = styled.div`
  width: 375px;
  margin: 0 auto;
  height: 100vh; /* 전체 화면 높이 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 하위 요소에서만 스크롤 */
`;

const Header = styled.div`
  padding: 16px;
`;

const FilterButton = styled.button`
  padding: 10px 16px;
  border-radius: 20px;
  border: 1px solid #CA2F28;
  color: #CA2F28;
  background: #fff;
  cursor: pointer;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
   z-index: 101;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
   z-index: 101;
`;

const CountryButton = styled.button`
  padding: 10px;
  margin: 5px;
  border: 1px solid #CA2F28;
  color: ${(props) => (props.selected ? "white" : "#CA2F28")};
  background: ${(props) => (props.selected ? "#CA2F28" : "#fff")};
  border-radius: 5px;
  cursor: pointer;
`;

const PriceInputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const PriceInput = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
`;

const ConfirmButton = styled.button`
  background: #CA2F28;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CloseButton = styled.button`
  background: gray;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const PostListContainer = styled.div`
  flex: 1;
  margin-left: 0;
  overflow-y: auto; /* 세로 스크롤 가능 */
  padding-bottom: 120px; /* RecommendationSection과 NavBar 공간 확보 */
  margin-right: 0px;

  /* 스크롤바 스타일 */
  scrollbar-width: thin; /* Firefox: 얇은 스크롤바 */
  scrollbar-color: #ccc transparent; /* Firefox: 스크롤바 색상 */

  &::-webkit-scrollbar {
    width: 6px; /* Chrome, Safari: 스크롤바 너비 */
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc; /* Chrome, Safari: 스크롤바 색상 */
    border-radius: 3px; /* Chrome, Safari: 스크롤바 둥글게 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* Chrome, Safari: 트랙 배경 투명 */
  }
`;

const Post = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  margin-left:10px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const PostImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const ReservedLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 7px;
  background: #0BB770;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
`;

const PostInfo = styled.div`
  flex: 1;
`;

const Currency = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #8ea0ac;
  background: rgba(142, 160, 172, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
`;

const Amount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Details = styled.div`
  font-size: 11px;
  color: #666;
  display: flex;
  align-items: left;
  gap: 4px; /* 텍스트 간 간격 */
`;

const Distance = styled.div`
  color: #CA2F28;
  margin-bottom: 4px;
  margin-left:0;
`;

const Won = styled.div`
  margin-bottom: 4px;
  margin-left:10px;
`;

const Location = styled.div`
  display: flex;
  gap: 0px;
  color: #898D99;
  font-size: 12px;
  align-self: flex-start; 
  margin-left:00px;
`;

const RecommendationSection = styled.div`
  position: fixed;
  bottom: 62px; /* NavBar 바로 위 */
  left: 50%; 
  transform: translateX(-50%);
  width: calc(100% - 32px); /* 좌우 16px씩 마진 */
  max-width: 375px; /* 중앙에 오게 하고 크기 제한 */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: 500;
  z-index: 100; /* 다른 요소 위로 */
  box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
  border-radius: 4px;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom:0px;
  
`;

const InfoText = styled.span`
  color: #1f2024;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.6;
  margin-bottom:0px;
`;

const RecommendationButton = styled.button`
  background: #CA2F28;
  color: white;
  font-size: 12px;
  font-weight: 400;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
`;

const RegisterButton = styled.button`
  position: fixed;
  bottom: 124px; /* RecommendationSection 위에 고정 */
  transform: translateX(-50%); /* 중앙 정렬 */
  margin-left:300px;
  background: #000;
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 20px;
  padding: 13px 16px;
  cursor: pointer;
  z-index: 101; /* 다른 요소 위로 */
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  margin-top: 20px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #888;
`; 

const NoImage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #888;
`; 