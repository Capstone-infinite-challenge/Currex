import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api"; // API 요청을 위한 axios 인스턴스 (withCredentials 설정 필요)

function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 채팅 목록 불러오기
  useEffect(() => {
    const fetchChatList = async () => {
      setLoading(true);
      setError(null);
      try {
        const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");

        if (!accessToken) {
          alert("로그인이 필요합니다.");
          navigate("/login");
          return;
        }

        const response = await api.get("/api/trade/list", {
          withCredentials: true, // 인증 정보 포함
        });

        console.log("채팅 목록 불러오기 성공:", response.data);
        setChats(response.data); // 불러온 데이터 저장
      } catch (err) {
        console.error("채팅 목록 불러오기 실패:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChatList();
  }, [navigate]);

  return (
    <Container>
      <Header>
        <Title>환전 채팅</Title>
        <FilterContainer>
          <Filter>최신순</Filter>
          <Filter>전체</Filter>
        </FilterContainer>
      </Header>

      {loading ? (
        <LoadingMessage>채팅 목록을 불러오는 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>채팅 목록을 불러오지 못했습니다.</ErrorMessage>
      ) : chats.length === 0 ? (
        <NoDataMessage>채팅 내역이 없습니다.</NoDataMessage>
      ) : (
        <ChatListContainer>
          {chats.map((chat) => (
            <ChatItem key={chat.chatRoomId} onClick={() => navigate(`/chat/${chat.chatRoomId}`)}>
              <Avatar src={chat.opponentProfileImg || "https://via.placeholder.com/40"} alt={`${chat.opponentName} avatar`} />
              <ChatInfo>
                <ChatHeader>
                  <NameContainer>
                    <Name>{chat.opponentName}</Name>
                  </NameContainer>
                  <Status style={{ backgroundColor: chat.status === "판매중" ? "#CA2F28" : chat.status === "거래확정" ? "#8EA0AC" : "#0BB770" }}>
                    {chat.status}
                  </Status>
                </ChatHeader>
                <PriceAndFlags>
                  <Price>{chat.amount ? `${chat.amount} 원` : "금액 정보 없음"}</Price>
                </PriceAndFlags>
              </ChatInfo>
            </ChatItem>
          ))}
        </ChatListContainer>
      )}
    </Container>
  );
}

export default ChatList;

const Container = styled.div`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  background: white;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 16px 21px;
  border-bottom: 1px solid #f7f7f7;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(8px);
`;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #1f2024;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`;

const Filter = styled.div`
  padding: 8px 12px;
  font-size: 11px;
  font-weight: 500;
  color: #1f2024;
  background: #f7f7f7;
  border-radius: 1000px;
  cursor: pointer;
`;

const ChatListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 21px;
  border-bottom: 1px solid #f7f7f7;
  cursor: pointer;

  &:hover {
    background: #f9f9f9;
  }
`;

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #f1f1f1;
`;

const ChatInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
`;

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left:0;
  gap: 150px;
`;

const NameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left:0;
`;

const OnlineIndicator = styled.div`
  width: 4px;
  height: 4px;
  background: #14f698;
  border-radius: 50%;
`;

const Name = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #1f2024;
`;

const TimeAgo = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: #898d99;
`;

const PriceAndFlags = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left:0;
  gap: 150px;
`;

const Price = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #1f2024;
  margin-left:0;
`;

const Flags = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Flag = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #1f2024;
`;

const Arrow = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: #666666;
`;

const ChatFooter = styled.div`
  display: flex;
  justify-content: space-between;
  margin-left:0;
`;

const Description = styled.div`
  font-size: 12px;
  font-weight: 300;
  color: #898d99;
  flex: 1;
`;

const Status = styled.div`
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 700;
  color: white;
  border-radius: 10px;
  margin-right:0;
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