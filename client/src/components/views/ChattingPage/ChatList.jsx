import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

function ChatList() {
  const navigate = useNavigate();

  const chats = [
    {
      id: 1,
      name: "Gabriel",
      price: "$ 4,010",
      description: "대화내용어쩌고",
      status: "판매중",
      statusColor: "#CA2F28",
      timeAgo: "6시간 전",
      flagFrom: "🇯🇵",
      flagTo: "🇺🇸",
      online: true,
      image: "",
    },
    {
      id: 2,
      name: "Bin Thieu",
      price: "$ 4,010",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "거래확정",
      statusColor: "#8EA0AC",
      timeAgo: "12시간 전",
      flagFrom: "🇯🇵",
      flagTo: "🇺🇸",
      online: false,
      image: "",
    },
    {
      id: 3,
      name: "Vinicius",
      price: "$ 4,010",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      status: "거래완료",
      statusColor: "#0BB770",
      timeAgo: "3일 전",
      flagFrom: "🇯🇵",
      flagTo: "🇺🇸",
      online: false,
      image: "",
    },
  ];

  return (
    <Container>
      <Header>
        <Title>환전 채팅</Title>
        <FilterContainer>
          <Filter>최신순</Filter>
          <Filter>전체</Filter>
        </FilterContainer>
      </Header>

      <ChatListContainer>
        {chats.map((chat) => (
          <ChatItem key={chat.id} onClick={() => navigate(`/chat/${chat.id}`)}>
            <Avatar src={chat.image} alt={`${chat.name} avatar`} />
            <ChatInfo>
              <ChatHeader>
                <NameContainer>
                  {chat.online && <OnlineIndicator />}
                  <Name>{chat.name}</Name>
                </NameContainer>
                <TimeAgo>{chat.timeAgo}</TimeAgo>
              </ChatHeader>
              <PriceAndFlags>
                <Price>{chat.price}</Price>
                <Flags>
                  <Flag>{chat.flagFrom}</Flag>
                  <Arrow>➠</Arrow>
                  <Flag>{chat.flagTo}</Flag>
                </Flags>
              </PriceAndFlags>
              <ChatFooter>
                <Description>{chat.description}</Description>

              </ChatFooter>
              <Status style={{ backgroundColor: chat.statusColor }}>{chat.status}</Status>
            </ChatInfo>
          </ChatItem>
        ))}
      </ChatListContainer>
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
