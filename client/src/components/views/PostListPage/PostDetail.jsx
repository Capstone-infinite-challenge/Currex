import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import backarrowwhite from "../../images/backarrow-white.svg";
import moredetail from "../../images/moredetails.svg";
import axios from "axios";
import api from "../../utils/api";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
//import { Pagination } from "swiper";
import { Pagination } from "swiper";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .swiper-pagination-bullet {
    background-color: black !important; /* 기본 점박이 빨간색 */
    opacity: 1;
  }

  .swiper-pagination-bullet-active {
    background-color: red !important; /* 활성화된 점박이 검정색 */
    opacity: 1;
  }
`;

function PostDetail() {
  const { sellId } = useParams();
  const navigate = useNavigate();
  const [sell, setSell] = useState({});
  const [exchangeRates, setExchangeRates] = useState({});
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  

  const currentUserId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
console.log("현재 로그인한 사용자 ID:", currentUserId); // ✅ 현재 로그인된 사용자 ID 확인


  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState);
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await api.delete(`/api/sell/deleteSell/${sellId}`); //  DELETE API 호출
      alert("삭제가 완료되었습니다.");
      navigate("/list");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setShowMenu(false); // 메뉴 닫기
    }
  };
  

  useEffect(() => {
    if (!sellId) {
      console.error("sellId가 undefined입니다.");
      return;
    }

    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/sell/sellDescription/${sellId}`);
        console.log("서버에서 받은 데이터:", response.data);
        setSell(response.data || {});

        // 판매 정보에서 좌표를 바로 설정
        setLatitude(response.data.latitude);
        setLongitude(response.data.longitude);
      } catch (error) {
        console.error("판매 정보 불러오기 실패:", error);
        if (error.response?.status === 401) {
          alert("인증이 만료되었습니다. 다시 로그인해주세요.");
          navigate("/login");
        } else if (error.response?.status === 404) {
          alert("판매 정보를 찾을 수 없습니다.");
        }
      }
    };

    fetchPost();
  }, [sellId, navigate]);
  console.log("🟢 현재 로그인한 사용자 ID (localStorage/sessionStorage에서 가져옴):", currentUserId);
  console.log("🟠 현재 게시글 판매자 ID:", sell.sellerId);
  
  const isMyPost = sell.sellerId?.toString() === currentUserId?.toString();



  const handleInquiryClick = async () => {
    if (isMyPost) return;

    console.log("요청 보낼 sellId:", sellId);  
    console.log("ObjectId 유효성 검사:", /^[0-9a-fA-F]{24}$/.test(sellId));

    if (!sellId) {
        alert("잘못된 요청: sellId가 없습니다.");
        return;
    }

    if (!/^[0-9a-fA-F]{24}$/.test(sellId)) {
        alert("잘못된 요청: 유효한 MongoDB ObjectId가 아닙니다.");
        return;
    }

    try {
        const response = await api.post("/api/sell/sellSelect", { sellId });
        console.log("채팅방 생성 성공:", response.data);
        const chatRoomId = response.data.chatRoomId;
        navigate(`/chat/${chatRoomId}`);
    } catch (error) {
        console.error("채팅 시작 실패:", error.response?.data || error.message);
        alert("채팅을 시작하는 중 오류가 발생했습니다.");
    }
};

  
  

  //  실시간 환율 가져오기
  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await axios.get(
          `https://api.exchangerate-api.com/v4/latest/${sell.currency}`
        );
        setExchangeRates((prevRates) => ({
          ...prevRates,
          [sell.currency]: response.data.rates.KRW,
        }));
      } catch (error) {
        console.error("환율 데이터 불러오기 오류:", error);
      }
    };

    if (sell.currency) {
      fetchExchangeRates();
    }
  }, [sell]);

  //판매자 거래 희망 장소 카맵에 마커로 띄우기
  useEffect(() => {
    if (latitude && longitude) {
      // 좌표가 있을 때만 지도 로드
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&autoload=false`;
      script.async = true;

      script.onload = () => {
        window.kakao.maps.load(() => {
          const container = document.getElementById("kakao-map");
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude),
            level: 3,
          };

          const map = new window.kakao.maps.Map(container, options);
          new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(latitude, longitude),
            map: map,
          });
        });
      };

      document.body.appendChild(script);
    }
  }, [latitude, longitude]);

  if (!sell || Object.keys(sell).length === 0) {
    return <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>;
  }

  return (
    <>
      <GlobalStyle />
      <Container>
        <ImageBackground>
          {sell?.images && sell.images.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              pagination={{
                clickable: true,
              }}
              spaceBetween={10}
              slidesPerView={1}
              loop={true}
            >
              {sell.images.map((image, index) => (
                <SwiperSlide key={index}>
                  <MainImage
                    src={image}
                    alt={`상품 이미지 ${index + 1}`}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <NoImage>이미지 없음</NoImage>
          )}

          <TopBar>
            <BackButton
              onClick={() => window.history.back()}
              src={backarrowwhite}
              alt="뒤로가기"
            />
          {sell.sellerId === currentUserId && (
            <MenuButton onClick={toggleMenu} src={moredetail} alt="더보기" />
          )}
        </TopBar>
        {sell.sellerId === currentUserId && showMenu && (
          <Menu>
            <MenuItem onClick={handleDelete}>삭제</MenuItem>
          </Menu>
        )}
      </ImageBackground>

        <Content>
          <TopInfo>
            <CurrencyTag>{sell.currency}</CurrencyTag>
            <UserInfo>
              <UserImage
                src={sell.profile_img || "https://via.placeholder.com/40"}
                alt="판매자 프로필"
              />
              <UserName>{sell.name || "익명 판매자"}</UserName>
            </UserInfo>
          </TopInfo>
          <Price>${sell.amount?.toLocaleString()}</Price>
          <InfoSection>
            <InfoTitle>거래 위치</InfoTitle>
            <InfoValue>{sell.location || "위치 정보 없음"}</InfoValue>
          </InfoSection>
          <InfoSection>
            <InfoTitle>환율</InfoTitle>
            <InfoValue>
              {exchangeRates[sell.currency]
                ? `100 ${sell.currency} / ${exchangeRates[
                    sell.currency
                  ].toFixed(2)} 원`
                : "환율 정보 없음"}
            </InfoValue>
          </InfoSection>
          <Description>{sell.content || "설명 없음"}</Description>
          <LocationInfo>
            <LocationTitle>거래 희망 장소</LocationTitle>
            <LocationAddress>{sell.location}</LocationAddress>
          </LocationInfo>

          <MapContainer
            id="kakao-map"
            style={{ width: "100%", height: "250px" }}
          ></MapContainer>

          <ButtonContainer>
            <KRWContainer>
              <KRWLabel>원화</KRWLabel>
              <KRWAmount>
                {exchangeRates[sell.currency]
                  ? `${Math.round(
                      sell.amount * exchangeRates[sell.currency]
                    ).toLocaleString()} 원`
                  : "환율 정보 없음"}
              </KRWAmount>
            </KRWContainer>
            <InquiryButton 
               disabled={sell.sellerId === currentUserId} 
              onClick={handleInquiryClick}
              style={sell.sellerId === currentUserId ? { backgroundColor: "#ccc", cursor: "not-allowed" } : {}}
              >
            문의하기
            </InquiryButton>

          </ButtonContainer>
        </Content>
      </Container>
    </>
  );
}

export default PostDetail;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ImageBackground = styled.div`
  position: relative;
  width: 100%;
  height: 350px;
  background-color: #f0f0f0;
`;

const MainImage = styled.img`
  width: 100%;
  height: 350px;
  object-fit: cover;
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const TopBar = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  z-index: 10;
  width: 100%; /* 전체 너비 차지 */
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 0;
`;

const MenuButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 0;
`;

const Content = styled.div`
  padding: 20px;
  background: white;
  flex: 1;
  margin: 0 auto; /* 가운데 정렬 */
  width: 100%; /* 전체 너비 차지 */
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  width: 100%;
`;

const CurrencyTag = styled.div`
  background: #ca2f28;
  color: white;
  font-size: 14px;
  font-weight: 300;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin-left: 0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0;
`;

const UserImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const Price = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-top: 10px;
`;

const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  margin-top: 13px;
`;

const InfoTitle = styled.span`
  font-size: 14px;
  color: #1f2024;
  margin-left: 0;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 200;
  color: #666;
  margin-right: 0;
`;

const LocationInfo = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 10px;
  margin-left: -10px;
  width: 100%;
`;

const LocationTitle = styled.h3`
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-left: 0;
`;

const LocationAddress = styled.p`
  font-size: 13px;
  color: #898d99;
  margin-top: 5px;
  margin-left: 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;

const Description = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
`;

const Menu = styled.div`
  position: absolute;
  top: 40px;
  right: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
`;

const MenuItem = styled.div`
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  background: white;
  padding: 10px;
  z-index: 10;
`;

const KRWContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid #eee;
  justify-content: flex-start;
  margin-left: 0;
`;

const KRWLabel = styled.span`
  font-size: 14px;
  color: #888;
  margin-left: -10px;
  justify-content: flex-start;
`;

const KRWAmount = styled.h2`
  font-size: 13px;
  font-weight: 300;
  margin-left: -10px;
`;

const InquiryButton = styled.button`
  width: 250px;
  padding: 15px;
  background: #1f2024;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  align-self: flex-end;
  border-top: 1px solid #eee;
  margin-right: 0;
`;

const MapContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 300px;
  margin-left: 0;
`;
