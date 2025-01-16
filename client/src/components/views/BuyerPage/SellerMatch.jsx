import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

function SellerMatch() {
  const [sellers, setSellers] = useState([]);
  const [buyerInfo, setBuyerInfo] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/SellerMatch", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("백엔드 응답 데이터:", response.data);

        // 거리순으로 정렬
        const sortedSellers = response.data.sellersWithDistance.sort((a, b) => {
          const distanceA = parseFloat(a.distance.replace("km", ""));
          const distanceB = parseFloat(b.distance.replace("km", ""));
          return distanceA - distanceB;
        });

        setSellers(
          sortedSellers.map((seller, index) => ({
            ...seller,
            avatar: `https://randomuser.me/api/portraits/${
              index % 2 === 0 ? "men" : "women"
            }/${(index % 100) + 1}.jpg`,
          }))
        ); // 정렬된 데이터에 랜덤 아바타 추가

        setBuyerInfo(response.data.buyerInfo);

      } catch (error) {
        console.error("판매자 데이터 불러오기 오류:", error);
      }
    };

    fetchSellers();
  }, []);


  const handleChatClick = async (sellerName) => {
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
};

  return (
    <Container>
      <Title>AI가 추천해준 판매자 목록이에요!</Title>
      <SellerList>
        {sellers.map((seller, index) => (
          <SellerCard key={index}>
            <Avatar
              src={seller.avatar}
              alt={`${seller.name || "익명"}의 아바타`}
            />
            <InfoContainer>
              <SellerInfo>
                <Name>{seller.name || "익명"}</Name>
                <Distance>{seller.distance}</Distance>
              </SellerInfo>
              <Currency>
                보유 외화: {seller.amount} {seller.currency}
              </Currency>
            </InfoContainer>
            <ButtonGroup>
              <SellButton>판매 게시글 보기</SellButton>
              <ChatButton onClick={() => handleChatClick(seller.name)}>중간 위치</ChatButton>
            </ButtonGroup>
          </SellerCard>
        ))}
      </SellerList>
      <SubmitButtonContainer>
        <SubmitButton onClick={() => window.location.reload()}>
          AI 재추천 받기
        </SubmitButton>
      </SubmitButtonContainer>
    </Container>
  );
}

export default SellerMatch;

// Styled Components
const Container = styled.div`
  font-family: "Arial", sans-serif;
  padding: 16px;
  max-width: 800px;
  margin: 0 auto;
  background-color: #ffffff;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #ff5a5f;
  text-align: center;
  margin-bottom: 20px;
`;

const SellerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SellerCard = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 15px;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SellerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

const Name = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`;

const Distance = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
`;

const Currency = styled.p`
  font-size: 14px;
  color: #555;
  margin-top: 8px;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 20px;
`;

const SellButton = styled.button`
  background: #f2f2f2;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  padding: 8px 12px;
  cursor: pointer;
`;

const ChatButton = styled.button`
  background: #ff5a5f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  padding: 8px 12px;
  cursor: pointer;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const SubmitButton = styled.button`
  padding: 12px;
  font-size: 18px;
  color: #fff;
  background-color: #ff5a5f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;