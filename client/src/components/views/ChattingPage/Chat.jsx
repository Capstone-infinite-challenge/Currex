import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import api from "../../utils/api";
import infoicon from "../../images/infoicon.svg";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";
import sendicon from "../../images/sendicon.svg";
import PlaceModal from "./PlaceModal";

const socket = io("http://localhost:5000", { withCredentials: true });

function Chat() {
  const { chatRoomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, sender: "me", text: "안녕하세요\n내일 거래 가능 하신가요?" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [status, setStatus] = useState("판매중"); //  판매 상태 관리
  const [showOptions, setShowOptions] = useState(false); // 드롭다운 표시 상태 관리
  const [showModal, setShowModal] = useState(false); //  모달 상태 추가

  const currentUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
  const [sellerInfo, setSellerInfo] = useState(null);
  const sellId = chatRoomId; // chatRoomId를 sellId로 사용

  //거래 상태를 받아오기 위함
  useEffect(() => {
    const fetchSellStatus = async () => {
      try {
        const response = await api.get(`/api/sell/sellDescription/${sellId}`); 
        setStatus(response.data.status); // 상태 업데이트
      } catch (error) {
        console.error("판매 상태 불러오기 오류:", error);
      }
    };
  
    if (sellId) {
      fetchSellStatus();
    }
  }, [sellId]); 
  


  useEffect(() => {
    if (!chatRoomId) return;

    // 채팅방 입장
    socket.emit("joinRoom", { chatRoomId });

    const fetchChatData = async () => {
      try {
        // 메시지 가져오기 (임시)
        const messagesResponse = await api.get(`/api/chat/messages/${chatRoomId}`);
        setMessages(messagesResponse.data);

        // 판매자 정보 가져오기 (임시)
        const sellerResponse = await api.get(`/api/chat/sellInfo/${chatRoomId}`);
        setSellerInfo(sellerResponse.data);
      } catch (error) {
        console.error("채팅 데이터 불러오기 오류:", error);
      }
    };
    fetchChatData();

    // 실시간 메시지 받기
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });


    return () => {
      socket.off("receiveMessage");
    };
  }, [chatRoomId]);

  // 메시지 전송
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData = {
      chatRoomId,
      senderId: currentUserId,
      text: newMessage,
    };

    // 메시지를 소켓으로 전송
    socket.emit("sendMessage", messageData);

    // 메시지를 서버에 저장 (임시)
    try {
      await api.post("/api/chat/sendMessage", messageData);
    } catch (error) {
      console.error("메시지 저장 오류:", error);
    }

    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  // 거래 상태 변경
  const changeStatus = async (newStatus) => {
    try {
      if (!sellId) {
        console.error("오류: sellId가 정의되지 않았습니다.");
        return;
      }
  
      await api.patch(`/api/sell/${sellId}/status`, { status: newStatus });
  
      // 상태 업데이트를 위해 다시 DB에서 불러오기
      const updatedSell = await api.get(`/api/sell/sellDescription/${sellId}`);
      setStatus(updatedSell.data.status);
  
      setShowOptions(false);
    } catch (error) {
      console.error("거래 상태 변경 오류:", error);
    }
  };
  


  // 거래 장소 추천
  const handleSendPlace = (place) => {
    const mapImageUrl = `https://map.kakao.com/v2/maps/staticmap?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&center=${place.longitude},${place.latitude}&level=3&size=480x320&map_type=roadmap&markers=${place.longitude},${place.latitude}`;

    const placeMessage = {
      chatRoomId,
      senderId: currentUserId,
      text: `📍 ${place.name}\n현재 위치에서 ${place.distance}km`,
      isPlace: true,
      mapUrl: mapImageUrl,
    };

    socket.emit("sendMessage", placeMessage);
    setMessages((prev) => [...prev, placeMessage]);
    setShowModal(false);
  };

  
  
  return (
    <Container>
      {/* 헤더 - 판매자 정보 추가 */}
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        
        {/* 판매자 정보가 있으면 표시 */}
        {sellerInfo ? (
          <SellerInfo>
            <ProfileImage src={sellerInfo.profile_img || "https://via.placeholder.com/40"} alt="seller" />
            <SellerName>{sellerInfo.nickname || "판매자"}</SellerName>
          </SellerInfo>
        ) : (
          <SellerInfo>
            <ProfileImage src="https://via.placeholder.com/40" alt="seller" />
            <SellerName>로딩 중...</SellerName>
          </SellerInfo>
        )}

        <StatusContainer>
          <StatusButton onClick={() => setShowOptions(!showOptions)} disabled={status === "거래완료"}>
            <StatusText>{status}</StatusText>
            {status !== "거래완료" && <StatusDropdown src={dropdown} />}
          </StatusButton>

          {showOptions && (
            <DropdownMenu>
              {["판매중", "거래중", "거래완료"].map((s) => (
                <DropdownItem key={s} onClick={() => changeStatus(s)}>
                  {s}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </StatusContainer>
      </Header>

      {/* 기존 채팅 메시지 표시 */}
      <ChatContainer>
        {messages.map((msg, index) => (
          <MessageWrapper key={index} sender={msg.senderId === currentUserId ? "me" : "other"}>
            <Message sender={msg.senderId === currentUserId ? "me" : "other"}>
              {msg.text.split("\n").map((line, i) => (
                <span key={i}>{line}</span>
              ))}
              {msg.isPlace && <MapImage src={msg.mapUrl} alt="지도 이미지" />}
            </Message>
          </MessageWrapper>
        ))}
      </ChatContainer>

      {/* 거래 장소 추천 */}
      <RecommendationSection>
        <InfoContainer>
          <img src={infoicon} alt="info icon" width="16" height="16" />
          <InfoText>AI에게 거래 장소를 추천받아 보세요</InfoText>
        </InfoContainer>
        <RecommendationButton onClick={() => setShowModal(true)}>추천받기</RecommendationButton>
        <PlaceModal isOpen={showModal} onClose={() => setShowModal(false)} onSend={handleSendPlace} />
      </RecommendationSection>

      {/* 메시지 입력창 */}
      <MessageInputContainer>
        <MessageInput
          type="text"
          placeholder="메시지를 입력하세요..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <SendButton onClick={handleSendMessage}>
          <img src={sendicon} alt="전송" />
        </SendButton>
      </MessageInputContainer>
    </Container>
  );
}

export default Chat;


/* 스타일링 */
const Container = styled.div`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
  backdrop-filter: blur(8px);
  padding: 0 12px;
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 0px;
`;

const SellerInfo = styled.div`
  display: flex;
  gap: 8px;
  margin-left:0;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%; 
  margin-left:50px;
`;

const SellerName = styled.b`
  font-size: 16px;
  margin-top: 8px;
  font-weight:400;
`;

const StatusContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const StatusButton = styled.button`
  display: flex;
  align-items: center;
  background: #f7f7f7;
  padding: 8px 12px;
  border-radius: 1000px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? "0.6" : "1")};
`;

const StatusText = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

const StatusDropdown = styled.img`
  width: 10px;
  height: 10px;
  margin-left: 6px;
  opacity: 0.8;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 110%; 
  left: 0;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
  min-width: 100px;
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  color: #1f2024;
  text-align: left;

  &:hover {
    background: #f7f7f7;
  }
`;


/* 상품 정보 */
const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  gap: 12px;
  border: 2px solid #f7f7f7;
  margin: 5px;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  margin-left:0;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left:-110px;;
`;

const CurrencyTag = styled.div`
  background: #ca2f28;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 10px;
  margin-left:0;
`;

const PriceContainer = styled.div`
  display: flex;
  algn-items:left;
`;

const Price = styled.b`
  font-size: 18px;
`;

const Dot = styled.span`
  color: #898d99;
  margin: 0 6px;
`;

const KRWAmount = styled.span`
  color: #666666;
  font-weight: 300;
  font-size:10px;
  margin-top:5px;
`;

/* 채팅 메시지 */
const ChatContainer = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto;
`;

const Message = styled.div`
  background: ${({ sender }) => (sender === "me" ? "#ca2f28" : "#f7f7f7")};
  color: ${({ sender }) => (sender === "me" ? "#fff" : "#000")};
  padding: 10px 12px;
  border-radius: ${({ sender }) => (sender === "me" ? "12px 4px 12px 12px" : "4px 12px 12px 12px")};
  max-width: 70%;
  align-self: ${({ sender }) => (sender === "me" ? "flex-end" : "flex-start")};
  margin-bottom: 8px;
  white-space: pre-line;

  /* ✅ 오른쪽 정렬 조정 */
  ${({ sender }) => sender === "me" && "margin-left: auto;"} 
  ${({ sender }) => sender === "me" && "margin-right: 0px;"} 

  /* ✅ 장소 메시지일 경우 지도 이미지 포함 */
  ${({ isPlace }) =>
    isPlace &&
    `
    background: #fff;
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  `}
`;
const MapImage = styled.img`
  width: 100%;
  max-width: 300px; 
  border-radius: 8px;
  margin-top: 8px;
`;


const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ sender }) => (sender === "me" ? "flex-end" : "flex-start")};
  margin-bottom: 8px;
`;


/* AI 거래 장소 추천 */

const RecommendationSection = styled.div`
  position: fixed;
  bottom: 69px; 
  left: 50%; 
  transform: translateX(-50%);
  width: calc(100% - 32px); /* 좌우 16px씩 마진 */
  max-width: 375px; /* 중앙에 오게 하고 크기 제한 */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: 500;
  z-index: 100; /* 다른 요소 위로 */
  border-radius: 4px;
  border: 2px solid #f7f7f7;
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom:0px;
  
`;

const InfoText = styled.span`
  color: #1f2024;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.6;
  margin-bottom:0px;
`;

const RecommendationButton = styled.button`
  background: #CA2F28;
  color: white;
  font-size: 12px;
  font-weight: 400;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
`;

/*  메시지 입력 */
const MessageInputContainer = styled.div`
  display: ${({ isOpen }) => (isOpen ? "none" : "flex")}; /* ✅ 모달이 열리면 숨김 */
  padding: 12px;
  box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0px;
  left: 50%; 
  transform: translateX(-50%);
  width: calc(100% - 32px); /* 좌우 16px씩 마진 */
  max-width: 375px; /* 중앙에 오게 하고 크기 제한 */
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: rgb(255, 255, 255);
  font-size: 12px;
  font-weight: 300;
  z-index: 80; /* 다른 요소 위로 */
  border-radius: 28px;
  border: 2px solid #f7f7f7;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
`;

const SendButton = styled.button`
  width:35px;  
  height: 35px; 
  background: black; 
  border: none;
  border-radius: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  img {
    width: 16px; 
    height: 16px;
  }
`;

