import React, { useState } from "react";
import styled from "styled-components";

function SellerMatch() {
  const [sellers, setSellers] = useState([
    {
      id: 1,
      name: "나화연",
      distance: "120m",
      currency: "3403 JPY",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "김민환",
      distance: "700m",
      currency: "3789 JPY",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "김기림",
      distance: "120m",
      currency: "3403 JPY",
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
    {
      id: 4,
      name: "박세진",
      distance: "700m",
      currency: "3789 JPY",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    },
    {
      id: 5,
      name: "박민서",
      distance: "120m",
      currency: "3403 JPY",
      avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    },
  ]);

  return (
    <Container>
      <Title>AI가 추천해준 판매자 목록이에요!</Title>
      <SellerList>
        {sellers.map((seller) => (
          <SellerCard key={seller.id}>
            <Avatar src={seller.avatar} alt={`${seller.name}'s avatar`} />
            <InfoContainer>
              <SellerInfo>
                <Name>{seller.name}</Name>
                <Distance>{seller.distance}</Distance>
              </SellerInfo>
              <Currency>보유 외화: {seller.currency}</Currency>
            </InfoContainer>
            <ButtonGroup>
              <SellButton>판매 게시글 보기</SellButton>
              <ChatButton>Chat</ChatButton>
            </ButtonGroup>
          </SellerCard>
        ))}
      </SellerList>
      <SubmitButtonContainer>
        <SubmitButton>AI 재추천 받기</SubmitButton>
      </SubmitButtonContainer>
    </Container>
  );
}

export default SellerMatch;

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
  gap: 10px; /* 이름과 거리 사이 간격 */
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
  justify-content: center; /* 중앙 정렬 */
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
