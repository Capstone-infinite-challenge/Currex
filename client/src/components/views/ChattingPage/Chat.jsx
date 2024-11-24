import React, { useState, useEffect } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const socket = io("http://localhost:3000"); // 백엔드 서버 주소

function Chat() {
  const [messages, setMessages] = useState([]); // 메시지 목록
  const [inputMessage, setInputMessage] = useState(""); // 입력 메시지
  const [userName] = useState("상대방"); // 상대방 이름 (임시)

  // 메시지 수신
  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receive_message"); // 소켓 이벤트 해제
    };
  }, []);

  // 메시지 전송
  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = {
        sender: "me", // 보낸 사람
        text: inputMessage,
        timestamp: new Date(),
      };

      socket.emit("send_message", message); // 서버로 메시지 전송
      setMessages((prevMessages) => [...prevMessages, message]); // 메시지 UI에 추가
      setInputMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <Container>
      <Header>
        <UserName>{userName}</UserName>
      </Header>

      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble
            key={index}
            isMine={message.sender === "me"}
          >
            {message.text}
          </MessageBubble>
        ))}
      </MessagesContainer>

      <InputContainer>
        <Input
          type="text"
          placeholder="메시지를 입력하세요"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>전송</SendButton>
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
  width: 100%; 
  margin: 0;
  background-color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
  width: 100%; 
  box-sizing: border-box; 
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column; 
  gap: 10px; 
  background-color: #ffffff;
`;

const MessageBubble = styled.div`
  display: inline-block;
  padding: 10px;
  border-radius: 20px;
  font-size: 14px;
  color: ${(props) => (props.isMine ? "#ffffff" : "#333333")};
  background-color: ${(props) => (props.isMine ? "#ff5a5f" : "#f1f1f1")};
  align-self: ${(props) => (props.isMine ? "flex-end" : "flex-start")}; 
  max-width: 100%; 
  word-wrap: normal; 
  white-space: nowrap; 
  word-break: normal; 
  margin-right: ${(props) => (props.isMine ? "0" : "auto")};
  margin-left: ${(props) => (props.isMine ? "auto" : "0")};
`;




const InputContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-top: 1px solid #ddd;
  background-color: #f5f5f5;
  width: 100%; 
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
  box-sizing: border-box;
`;

const SendButton = styled.button`
  background: #ff5a5f;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #e14e4e;
  }
`;
