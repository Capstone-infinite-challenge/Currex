import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import backarrow from "../../images/backarrow.svg";

// PostDetail 컴포넌트
function PostDetail() {
  const { sellId } = useParams(); // URL에서 sellId 가져오기
  console.log("현재 sellId:", sellId);

  const navigate = useNavigate();
  const [sell, setSell] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    console.log("현재 sellId:", sellId);  //  sellId 값 확인
    if (!sellId) {
        console.error("sellId가 undefined입니다.");
        return;
    }

    const fetchPost = async () => {
      try {
        // ✅ 토큰 가져오기 (localStorage 또는 sessionStorage)
        const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        console.log("현재 저장된 accessToken:", accessToken);

        if (!accessToken) {
          alert("로그인이 필요합니다.");
          navigate("/login"); // 로그인 페이지로 이동
          return;
        }

        console.log(`📡 API 요청: http://localhost:5000/sellDescription/${sellId}`);

        const response = await axios.get(`http://localhost:5000/sellDescription/${sellId}`, {
          headers: {
            "Content-Type": "application/json", // ✅ 수정된 부분
            Authorization: `Bearer ${accessToken}`, 
          },
          withCredentials: true,
        });

        console.log("불러온 판매 데이터:", response.data);
        setSell(response.data);
      } catch (error) {
        console.error("판매 정보 불러오기 실패:", error);
        if (error.response?.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login"); 
        } else if (error.response?.status === 404) {
          alert("판매 정보를 찾을 수 없습니다.");
        }
      }
    };

    fetchPost();
  }, [sellId, navigate]);

  if (!sell) {
    return <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>;
  }

  return (
    <Container>
      {/* 이미지 배경 */}
      <ImageBackground>
        {sell.images && sell.images.length > 0 ? (
          <MainImage src={sell.images[0]} alt="상품 이미지" />
        ) : (
          <NoImage>이미지 없음</NoImage>
        )}
        <TopBar>
          <BackButton onClick={() => navigate(-1)} src={backarrow} alt="뒤로가기" />
        </TopBar>
      </ImageBackground>

      {/* 상품 정보 */}
      <Content>
        <CurrencyTag>{sell.currency}</CurrencyTag>
        <Price>${sell.amount.toLocaleString()}</Price>

        <InfoSection>
          <InfoTitle>거래 위치</InfoTitle>
          <InfoValue>{sell.sellerLocation || "위치 정보 없음"}</InfoValue>
        </InfoSection>

        <InfoSection>
          <InfoTitle>환율</InfoTitle>
          <InfoValue>
            {exchangeRate ? `100 ${sell.currency} / ${exchangeRate.toFixed(2)} 원` : "환율 정보 없음"}
          </InfoValue>
        </InfoSection>

        <Description>{sell.content || "설명 없음"}</Description>

        <UserInfo>
          <UserImage src="https://via.placeholder.com/40" alt="사용자 프로필" />
          <UserName>{sell.sellerName || "익명 판매자"}</UserName>
        </UserInfo>

        {/* 원화 가격 표시 */}
        <KRWContainer>
          <KRWLabel>원화</KRWLabel>
          <KRWAmount>
            {exchangeRate ? `${Math.round(sell.amount * exchangeRate).toLocaleString()} 원` : "환율 정보 없음"}
          </KRWAmount>
        </KRWContainer>

        {/* 문의하기 버튼 */}
        <InquiryButton>문의하기</InquiryButton>
      </Content>
    </Container>
  );
}

export default PostDetail;

// 스타일 정의
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ImageBackground = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  background-color: #f0f0f0;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const TopBar = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const ShareButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const Content = styled.div`
  padding: 20px;
  background: white;
  flex: 1;
`;

const CurrencyTag = styled.div`
  background: red;
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
`;

const Price = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
`;

const InfoTitle = styled.span`
  font-size: 14px;
  color: #555;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: bold;
`;

const Description = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const KRWContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 10px;
`;

const KRWLabel = styled.span`
  font-size: 14px;
  color: #888;
`;

const KRWAmount = styled.h2`
  font-size: 22px;
  font-weight: bold;
`;

const InquiryButton = styled.button`
  width: 100%;
  padding: 15px;
  margin-top: 20px;
  background: black;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;
const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;
