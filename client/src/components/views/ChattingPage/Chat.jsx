import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // 백엔드 서버 주소

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userName] = useState("Olivia Gracia");

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        sender: "me",
        text: inputMessage,
        timestamp: new Date(),
      };

      socket.emit("send_message", message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setInputMessage("");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton />
        <HeaderInfo>
          <Avatar src="https://via.placeholder.com/40" alt="User" />
          <UserName>{userName}</UserName>
        </HeaderInfo>
        <StatusButton>판매중</StatusButton>
      </Header>

      <ProductContainer>
        <ProductImage />
        <ProductDetails>
          <Tag>🇯🇵 JPY</Tag>
          <PriceInfo>
            <Price>$ 4,010</Price>
            <Dot>・</Dot>
            <PriceInWon>37,436.56 원</PriceInWon>
          </PriceInfo>
        </ProductDetails>
      </ProductContainer>

      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble key={index} isMine={message.sender === "me"}>
            {message.text}
          </MessageBubble>
        ))}
      </MessagesContainer>

      <InputContainer>
        <Input
          type="text"
          placeholder="메세지를 입력하세요..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage} />
      </InputContainer>
    </Container>
  );
}

export default Chat;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #f7f7f7;
`;

const BackButton = styled.div`
  width: 20px;
  height: 20px;
  background: #ca2f28;
  clip-path: polygon(100% 50%, 0% 0%, 0% 100%);
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e1e1e1;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #1f2024;
`;

const StatusButton = styled.div`
  padding: 8px 12px;
  background: #f7f7f7;
  border-radius: 1000px;
  font-size: 11px;
  font-weight: 500;
  color: #1f2024;
`;

const ProductContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 21px;
  margin: 12px;
  background: white;
  border: 1px solid #f7f7f7;
  border-radius: 12px;
`;

const ProductImage = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 8px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 12px;
`;

const Tag = styled.div`
  padding: 4px 8px;
  background: #ca2f28;
  color: white;
  font-size: 10px;
  font-weight: 600;
  border-radius: 4px;
`;

const PriceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Price = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #1f2024;
`;

const Dot = styled.span`
  font-size: 10px;
  color: #898d99;
`;

const PriceInWon = styled.span`
  font-size: 10px;
  font-weight: 600;
  color: #666666;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${(props) => (props.isMine ? "#ca2f28" : "#f1f1f1")};
  color: ${(props) => (props.isMine ? "white" : "#333")};
  align-self: ${(props) => (props.isMine ? "flex-end" : "flex-start")};
  font-size: 12px;
  font-weight: 400;
  line-height: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  box-shadow: 0px -4px 20px rgba(0, 0, 0, 0.04);
  border-radius: 28px 28px 0 0;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  font-size: 12px;
  padding: 10px;
  border-radius: 28px;
  color: #898d99;

  &::placeholder {
    color: #898d99;
    font-weight: 300;
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  margin-left: 8px;
  border-radius: 50%;
  background: #1f2024;
  border: none;
  cursor: pointer;

  &:after {
    content: "➤";
    color: white;
    font-size: 16px;
  }
  `;

