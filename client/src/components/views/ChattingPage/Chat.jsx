import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../../utils/api";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";
import sendicon from "../../images/sendicon.svg";

// 서버연결
const SOCKET_SERVER_URL = "http://localhost:5000"; 

const Chat = () => {
  const { sellId } = useParams(); // URL에서 판매글 ID 가져오기
  const [messages, setMessages] = useState([]); // 채팅 메시지 목록
  const [inputMessage, setInputMessage] = useState(""); // 입력 메시지
  const [sell, setSell] = useState(null); // 판매 정보
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("판매중"); // 판매 상태
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSellDetails = async () => {
      try {
        const response = await api.get(`/sell/${sellId}`);
        setSell(response.data);
        setStatus(response.data.status);
      } catch (error) {
        console.error("판매 정보 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellDetails();

    // Socket 연결
    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit("joinRoom", { sellId });

    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [sellId]);

  // 메시지 전송
  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const messageData = {
      sellId,
      sender: "buyer", // 유저 정보 (나) 받아오기
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    socketRef.current.emit("sendMessage", messageData);
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setInputMessage("");
  };

  // 상태 변경
  const toggleStatus = () => {
    if (status === "판매완료") return; // 판매완료 시 변경 불가

    const newStatus = status === "판매중" ? "거래중" : "판매중";
    setStatus(newStatus);

    //  서버에 상태 업데이트 요청
    api.patch(`/sell/${sellId}/status`, { status: newStatus })
      .then(() => console.log("판매 상태 업데이트 성공"))
      .catch((err) => console.error("판매 상태 업데이트 실패:", err));
  };

  // 판매 완료로 변경
  const completeSale = () => {
    setStatus("판매완료");

    // 서버에 판매 완료 상태 전송
    api.patch(`/sell/${sellId}/status`, { status: "판매완료" })
      .then(() => console.log("판매 완료 처리 성공"))
      .catch((err) => console.error("판매 완료 처리 실패:", err));
  };

  // 자동 스크롤 (새 메시지 수신 시)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <LoadingMessage>로딩 중...</LoadingMessage>;

  return (
    <Container>
      {/*  상단 바 */}
      <Header>
        <BackButton onClick={() => window.history.back()} src={backarrow} alt="뒤로가기" />
        <UserInfo>
          <UserImage src="https://via.placeholder.com/40" alt="사용자" />
          <UserName>{sell.sellerName || "익명 판매자"}</UserName>
        </UserInfo>
        <StatusButton onClick={toggleStatus} disabled={status === "판매완료"}>
          {status}
        </StatusButton>
        {status !== "판매완료" && <CompleteButton onClick={completeSale}>판매완료</CompleteButton>}
      </Header>

      {/*  상품 정보 */}
      <SellInfo>
        <SellImage src={sell.images[0]} alt="상품 이미지" />
        <SellDetails>
          <Currency>{sell.currency}</Currency>
          <Amount>${sell.amount.toLocaleString()}</Amount>
          <Won>{`${Math.round(sell.amount * (sell.exchangeRate || 1)).toLocaleString()} 원`}</Won>
        </SellDetails>
      </SellInfo>

      {/* 채팅 메시지 */}
      <ChatContainer>
        {messages.map((msg, index) => (
          <Message key={index} isBuyer={msg.sender === "buyer"}>
            {msg.text}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </ChatContainer>

      {/* 채팅 입력창 */}
      <InputContainer>
        <Input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <SendButton onClick={sendMessage}>
          <SendIcon src={sendicon} alt="전송" />
        </SendButton>
      </InputContainer>

      
    </Container>
  );
};

export default Chat;

//  스타일
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const BackButton = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;
`;

const UserImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const UserName = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-left: 8px;
`;

const StatusButton = styled.button`
  margin-left: auto;
  padding: 6px 12px;
  background: #ca2f28;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
    cursor: default;
  }
`;

const CompleteButton = styled.button`
  margin-left: 8px;
  padding: 6px 12px;
  background: black;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

const SellInfo = styled.div`
  display: flex;
  padding: 16px;
  align-items: center;
`;

const SellImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const SellDetails = styled.div`
  margin-left: 12px;
`;

const Currency = styled.div`
  font-size: 12px;
  font-weight: bold;
`;

const Amount = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const Won = styled.div`
  font-size: 12px;
  color: gray;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
`;

const Message = styled.div`
  background: ${({ isBuyer }) => (isBuyer ? "#ca2f28" : "#f1f1f1")};
  color: white;
  padding: 10px;
  border-radius: 12px;
  max-width: 70%;
  align-self: ${({ isBuyer }) => (isBuyer ? "flex-end" : "flex-start")};
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  padding: 12px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
`;

const SendButton = styled.button`
  background: none;
  border: none;
`;

const SendIcon = styled.img`
  width: 24px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
`;
