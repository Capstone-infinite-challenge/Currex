import React, { useState } from "react";
import { useEffect } from "react";  
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import backarrowwhite from "../../images/backarrow-white.svg";
import moredetail from "../../images/moredetails.svg";
import Slider from "react-slick"; // react-slick 사용을 위해 import
import axios from "axios";
import api from "../../utils/api";
import "slick-carousel/slick/slick.css"; // react-slick 스타일
import "slick-carousel/slick/slick-theme.css"; // react-slick 테마 스타일

//세진아 이거 읽어바바
//이거는 PostDetail2 컴포넌트임 (피그마와 동일한 스타일 적용)
//PostDetail1은 css 거의 안함, 이미지 슬라이더 구현 안함. -> 정상적으로 사진 잘 보임 (이미지 1개)
//현재 app.js에서 상세정보 페이지 들어가는 라우터 "/sell/:sellId" 는 PostDetail2에다 연결해놓음
//현재 PostDetail2는 이미지 슬라이더가 제대로 구현이 안된 상태. 이미지를 불러오지 못함

function PostDetail2() {
  const { sellId } = useParams(); // URL에서 sellId 가져오기
  const navigate = useNavigate();
  const [sell, setSell] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [latitude, setLatitude] = useState(37.5665); //이거는 나중에 바꿔야됨 일단 서울시청 기준 위도 경도도
  const [longitude, setLongitude] = useState(126.9780);
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prevState) => !prevState); // 메뉴 열기/닫기 토글
  };

  const handleEdit = () => {
    alert("수정");
    setShowMenu(false);
  };

  const handleDelete = () => {
    alert("삭제");
    setShowMenu(false);
  };


  // 이미지 슬라이더 설정
  const settings = {
    dots: true, // 하단 점 표시
    infinite: true, // 무한 슬라이드
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 하나의 이미지만 보여줌
    slidesToScroll: 1, // 한 번에 한 장씩 슬라이드
    arrows: false, // 좌우 화살표 숨기기
    customPaging: function(i) {
        return (
          <div style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "black", // 슬라이드 버튼 색상
          }}></div>
        );
      },
    };

  console.log("이미지 경로 확인:", sell.images); // 이미지 경로 확인
  console.log("슬라이더 설정:", settings); // 슬라이더 설정 확인


  useEffect(() => {
    if (!sellId) {
      console.error("sellId가 undefined입니다.");
      return;
    }
  
    const fetchPost = async () => {
      try {
        const response = await api.get(`/api/sell/sellDescription/${sellId}`); 
        setSell(response.data);
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
  
  

// 판매자 거래 희망 장소 위도 경도 받기
  useEffect(() => {
    if (sell.location) {
      const fetchCoordinates = async () => {
        try {
          const response = await axios.get(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(sell.location)}`,
            {
              headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}` },
            }
          );
          const locationData = response.data.documents[0];
          if (locationData) {
            setLatitude(locationData.y);
            setLongitude(locationData.x);
          }
        } catch (error) {
          console.error("Error fetching location:", error);
        }
      };
      fetchCoordinates();
    }
  }, [sell.location]);
  
  //판매자 거래 희망 장소 카맵에 마커로 띄우기
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAOMAP_KEY}&libraries=services&autoload=false`;
    script.async = true;
  
    script.onload = () => {
      // kakao.maps.load 함수 사용
      window.kakao.maps.load(() => {
        if (window.kakao) {
          const container = document.getElementById("kakao-map");
          const options = {
            center: new window.kakao.maps.LatLng(latitude, longitude), 
            level: 3,
          };
  
          const map = new window.kakao.maps.Map(container, options);
          new window.kakao.maps.Marker({ position: options.center, map: map });
        } else {
          console.error("Kakao map API not loaded");
        }
      });
    };
  
    script.onerror = () => {
      console.error("Kakao map API script failed to load");
    };
  
    document.body.appendChild(script);
  }, [latitude, longitude]);

  if (!sell) {
    return <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>;
  }

  
  
  
  
  return (
    //이 부분이 문제 구간.....
    <Container> 
      <ImageBackground>
  {sell ? (
    sell.images && sell.images.length > 0 ? (
      <Slider {...settings}>
        {sell.images.map((image, index) => (
          <div key={index}>
            <MainImage src={image} alt={`상품 이미지 ${index + 1}`} />
          </div>
        ))}
      </Slider>
    ) : (
      <NoImage>이미지 없음</NoImage>
    )
  ) : (
    <LoadingMessage>이미지를 불러오는 중...</LoadingMessage> //여기까지 슬라이더 (문제 구간)
  )} 
        <TopBar>
          <BackButton onClick={() => window.history.back()} src={backarrowwhite} alt="뒤로가기" />
          <MenuButton onClick={toggleMenu} src={moredetail} alt="더보기" />
        </TopBar>

        {showMenu && (
          <Menu>
            <MenuItem onClick={handleEdit}>수정</MenuItem>
            <MenuItem onClick={handleDelete}>삭제</MenuItem>
          </Menu>
        )}
    </ImageBackground>

      <Content>
        <TopInfo>
          <CurrencyTag>{sell.currency}</CurrencyTag>
          <UserInfo>
            <UserImage src="https://via.placeholder.com/40" alt="사용자" />
            <UserName>{sell.sellerName || "익명 판매자"}</UserName>
          </UserInfo>
        </TopInfo>

        <Price>${sell.amount.toLocaleString()}</Price>

        <InfoSection>
          <InfoTitle>거래 위치</InfoTitle>
          <InfoValue>{sell.location || "위치 정보 없음"}</InfoValue>
        </InfoSection>

        <InfoSection>
          <InfoTitle>환율</InfoTitle>
          <InfoValue>
            {exchangeRate ? `100 ${sell.currency} / ${exchangeRate.toFixed(2)} 원` : "환율 정보 없음"}
          </InfoValue>
        </InfoSection>

        <Description>{sell.content || "설명 없음"}</Description>

        <LocationInfo>
            <LocationTitle>거래 희망 장소</LocationTitle>
            <LocationAddress>{sell.location}</LocationAddress>
        </LocationInfo>


        <MapContainer id="kakao-map" style={{ width: "100%", height: "250px" }}></MapContainer>

        <ButtonContainer>
          <KRWContainer>
              <KRWLabel>원화</KRWLabel>
              <KRWAmount>
             {exchangeRate ? `${Math.round(sell.amount * exchangeRate).toLocaleString()} 원` : "환율 정보 없음"}
              </KRWAmount>
          </KRWContainer>
          <InquiryButton>문의하기</InquiryButton>
        </ButtonContainer>
      </Content>
    </Container>
  );
}

export default PostDetail2;

// 스타일 정의
const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const ImageBackground = styled.div`
  position: relative;
  width: 100%;
  height: 350px;;
  background-color: #f0f0f0;

  .slick-dots {
    position: absolute;
    top: 320px; 
    left: 50%;
    transform: translateX(-50%);
  }

  .slick-dots li button:before {
    color: black; 
  }

  .slick-dots li.slick-active button:before {
    color: grey; 
  }

  .image-slide {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지를 컨테이너 크기에 맞게 자르기 
  }
`;

const NoImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
`;

const MainImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


const TopBar = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left:0;
`;

const MenuButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right:0;
`;

const Content = styled.div`
  padding: 20px;
  background: white;
  flex: 1;
`;

const TopInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const CurrencyTag = styled.div`
  background: #ca2f28;
  color: white;
  font-size: 14px;
  font-weight: 300;
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  margin-left:0;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right:0;
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
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
  margin-top:13px;
`;

const InfoTitle = styled.span`
  font-size: 14px;
  color: #555;
  margin-left:0;
`;

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 200;
  color: #666;
  margin-right:0;
`;

const MapContainer = styled.div`
  margin-top: 20px;
`;

const Description = styled.p`
  margin-top: 15px;
  font-size: 14px;
  color: #666;
`;

const KRWContainer = styled.div`
  margin-top: 20px;
  padding: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  border-top: 1px solid #eee; /* 구분선 추가 
  justify-content: flex-start;
  margin-left:-20px;
`;

const KRWLabel = styled.span`
  font-size: 14px;
  color: #888;
  margin-left:0px;
  justify-content: flex-start;
`;

const KRWAmount = styled.h2`
  font-size: 13px;
  font-weight: 300;
   margin-left:0px;
`;

const InquiryButton = styled.button`
  width: 60%;
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
  bottom: 0px; /* 화면 하단 20px 위 
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  background: white;
  padding: 10px;
  z-index: 10; /* 다른 요소들 위에 표시 
`;

const LocationInfo = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-radius: 10px;
  margin-left:-10px;
`;

const LocationTitle = styled.h3`
  font-size: 17px;
  font-weight: bold;
  color: #333;
  margin-left:0;
`;

const LocationAddress = styled.p`
  font-size: 13px;
  color: #898D99;
  margin-top: 5px;
  margin-left:0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;