import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import backarrow from "../../images/backarrow.svg";

function SellerMatch() {
  const [sells, setSells] = useState([]); // ✅ sellers → sells 로 변경
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSells = async () => { // ✅ fetchSellers → fetchSells
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

      if (!accessToken) {
        alert("로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/SellerMatch", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        console.log("백엔드 응답 데이터:", response.data);

        if (response.data.sellersWithDistance && response.data.sellersWithDistance.length > 0) {
          const sortedSells = response.data.sellersWithDistance
            .filter(sell => sell.distance)
            .map(sell => ({
              ...sell,
              distance: parseFloat(sell.distance.replace("km", "")) || 0,
            }))
            .sort((a, b) => a.distance - b.distance);

          setSells(sortedSells); // ✅ setSellers → setSells
          console.log("설정된 sells 상태:", sortedSells);
        } else {
          console.warn("❌ 판매 데이터가 없습니다.");
          setSells([]);
        }
      } catch (error) {
        console.error("판매 데이터 불러오기 오류:", error);
        setError("판매 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchSells();
  }, [navigate]);

  useEffect(() => {
    console.log("sells 상태 업데이트:", sells);
  }, [sells]); 

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

  return (
    <Container>
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <Title>추천 판매자</Title>
      </Header>

      <Total>총 <span>{sells.length}</span> 개</Total>

      {loading ? (
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : sells.length > 0 ? (
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
                <Amount>{sell.amount.toLocaleString()} {sell.currency}</Amount>
                <Details>
                  <Distance>📍 {sell.sellerLocation || "위치 정보 없음"}</Distance>
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
      ) : (
        <NoDataMessage>추천 판매자가 없습니다.</NoDataMessage>
      )}

      <ReRecommendButton onClick={() => window.location.reload()}>
        재추천 받기
      </ReRecommendButton>
    </Container>
  );
} 

export default SellerMatch;

// 📌 스타일 정의
const Container = styled.div`
  width: 375px;
  margin: 0 auto;
  height: 100vh; /* 전체 화면 높이 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 하위 요소에서만 스크롤 */
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; 
  padding: 16px;
  width: 100%;
  position: relative;
`;


const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
  margin-left:30px;
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 0px;
`;


const Total = styled.div`
  font-size: 14px;
  color: #666;
  span {
    font-weight: bold;
    color: #CA2F28;
  }
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
const ReRecommendButton = styled.button`
position: fixed;
bottom: 30px;
left: 50%;
transform: translateX(-50%);
width: calc(100% - 32px);
max-width: 375px;
background: #CA2F28;
color: white;
font-size: 16px;
font-weight: bold;
border: none;
border-radius: 12px;
padding: 16px;
cursor: pointer;
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
color: red;
margin-top: 20px;
`;

const NoImage = styled.div`
width: 80px;
height: 80px;
background: #f5f5f5;
color: #999;
display: flex;
align-items: center;
justify-content: center;
border-radius: 8px;
`;

/*const handleChatClick = async (sellerName) => {
  const buyerLatitude = buyerInfo.latitude;
  const buyerLongitude = buyerInfo.longitude;

  try {
    const response = await axios.post(
      `http://localhost:5000/SellerMatch/${sellerName}`,
      {
        buyerLatitude: buyerLatitude,
        buyerLongitude: buyerLongitude
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    //좌표 -> 위치
    const getAddressFromCoordinates = async (latitude, longitude) => {
      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/geo/coord2address.json`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_API_KEY}`,
            },
            params: {
              x: longitude, // 경도
              y: latitude,  // 위도
              input_coord: "WGS84", // 좌표 체계
            },
          }
        );
    
        if (response.data.documents.length > 0) {
          const addressInfo = response.data.documents[0].address;
          const roadAddressInfo = response.data.documents[0].road_address;
    
          // 주소 데이터
          return {
            address: addressInfo ? addressInfo.address_name : "주소 정보 없음",
            roadAddress: roadAddressInfo
              ? roadAddressInfo.address_name
              : "도로명 주소 없음",
          };
        } else {
          return { address: "주소 정보를 찾을 수 없습니다." };
        }
      } catch (error) {
        console.error("좌표로 주소 변환 오류:", error);
        throw error;
      }
    };

    //근처 편의점
    const fetchNearbyConvenienceStores = async (latitude, longitude) => {
      const apiKey = process.env.REACT_APP_KAKAO_API_KEY; // 카카오 API 키
    
      try {
        const response = await axios.get(
          `https://dapi.kakao.com/v2/local/search/category.json`,
          {
            headers: {
              Authorization: `KakaoAK ${apiKey}`,
            },
            params: {
              category_group_code: "CS2", // 편의점
              x: longitude,
              y: latitude,
              radius: 1000, // 반경 1km (단위: 미터)
            },
          }
        );
    
        const places = response.data.documents;
        return places.map((place) => ({
          name: place.place_name,
          address: place.address_name,
        }));
      } catch (error) {
        console.error("근처 편의점 검색 오류:", error);
        return [];
      }
    };
    
    const { middleLatitude, middleLongitude } = response.data;

    // Kakao API로 중간 위치의 주소 조회
    const address = await getAddressFromCoordinates(
      middleLatitude,
      middleLongitude
    );

    // 편의점 찾기
    fetchNearbyConvenienceStores(middleLatitude, middleLongitude ).then((places) => {
      console.log("근처 편의점:", places);
    });


    alert(
        `중간 위치는 위도: ${middleLatitude}, 경도: ${middleLongitude} 입니다. \n
         중간 위치는 ${address.address}입니다.`
    );
  } catch (error) {
    console.error("중간 위치 계산 오류:", error);
    alert("중간 위치를 계산하거나 주소를 조회할 수 없습니다.");
  }
};*/