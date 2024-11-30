import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

function SellerMatch() {
  const [sellers, setSellers] = useState([]);

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
        const sortedSellers = response.data.sort((a, b) => {
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
      } catch (error) {
        console.error("판매자 데이터 불러오기 오류:", error);
      }
    };

    fetchSellers();
  }, []);

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
              <ChatButton>Chat</ChatButton>
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
