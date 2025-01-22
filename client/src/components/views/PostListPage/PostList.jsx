import React from "react";
import styled from "styled-components";
import infoicon from "../../images/infoicon.svg";
import NavBar from "../NavBar/NavBar";
import locationicon from "../../images/locationicon.svg";
import post1 from "../../images/post1.png";
import { useNavigate } from "react-router-dom";

function PostList() {
  const navigate = useNavigate(); 

  const handleNavigateToBuy = () => {
    navigate("/buy");
  };

  const posts = [
    {
      id: 1,
      currency: "JPY",
      amount: "$4,010",
      distance: "120m",
      won: "37,436.56원",
      location: "마포구 대흥동",
      reserved: false,
      image: post1,
    },
    {
      id: 2,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: post1,
    },
    {
      id: 3,
      currency: "JPY",
      amount: "$4,010",
      distance: "120m",
      won: "37,436.56원",
      location: "마포구 대흥동",
      reserved: false,
      image: post1,
    },
    {
      id: 4,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: post1,
    },
    {
      id: 5,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: post1,
    },
    {
      id: 6,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: post1,
    },
    {
      id: 7,
      currency: "USD",
      amount: "$205.32",
      distance: "450m",
      won: "159,630.48원",
      location: "서대문구 대현동",
      reserved: true,
      image: post1,
    },
    // 나머지 데이터... (백엔드에서 불러옴)
  ];

  return (
    <Container>
      <Header>
        <Title>목록</Title>
        <Filters>
          <Filter>국가 전체</Filter>
          <Filter selected>금액 범위 20 - 30만원</Filter>
          <Filter>거래장소 전체</Filter>
        </Filters>
        <Total>
          Total <span>412</span>
        </Total>
      </Header>

      <PostListContainer>
        {posts.map((post) => (
          <Post key={post.id}>
            <ImageContainer>
              <PostImage src={post.image} alt={`${post.currency} image`} />
              {post.reserved && <ReservedLabel>예약중</ReservedLabel>}
            </ImageContainer>
            <PostInfo>
              <Currency>{post.currency}</Currency>
              <Amount>{post.amount}</Amount>
              <Details>
                <Distance>{post.distance}</Distance>
                <span></span>
                <Won>{post.won}</Won>
              </Details>
              <Location>
                <img
                src={locationicon}
                alt="location icon"
                style={{ width: "12px", height: "12px", marginRight: "3px", marginLeft: "8px" }}
                />
                {post.location}
              </Location>
            </PostInfo>
          </Post>
        ))}
      </PostListContainer>

      <RecommendationSection>
        <InfoContainer>
          <img src={infoicon} alt="info icon" style={{ width: "16px", height: "16px" }} />
          <InfoText>AI에게 판매자를 추천받아 보세요</InfoText>
        </InfoContainer>
        <RecommendationButton onClick={handleNavigateToBuy}>추천받기</RecommendationButton>
      </RecommendationSection>

      {/* NavBar 컴포넌트 사용 */}
      <NavBar active="list" />
    </Container>
  );
}

export default PostList;

const Container = styled.div`
  width: 375px;
  margin: 0 auto;
  height: 100vh; /* 전체 화면 높이 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 하위 요소에서만 스크롤 */
`;

const Header = styled.div`
  padding: 16px;
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: bold;
`;

const Filters = styled.div`
  display: flex;
  gap: 8px;
  margin: 12px 0;
`;

const Filter = styled.button`
  padding: 8px 12px;
  border-radius: 16px;
  border: 1px solid ${(props) => (props.selected ? "#CA2F28" : "#ccc")};
  color: ${(props) => (props.selected ? "#CA2F28" : "#333")};
  background: ${(props) => (props.selected ? "#fff5f5" : "#fff")};
`;

const Total = styled.div`
  font-size: 14px;
  color: #666;
  span {
    font-weight: bold;
    color: #CA2F28;
  }
`;

const PostListContainer = styled.div`
  flex: 1;
  margin-left: 0;
  overflow-y: auto; /* 세로 스크롤 가능 */
  padding-bottom: 120px; /* RecommendationSection과 NavBar 공간 확보 */
  margin-right: 0px;

  /* 스크롤바 스타일 */
  scrollbar-width: thin; /* Firefox: 얇은 스크롤바 */
  scrollbar-color: #ccc transparent; /* Firefox: 스크롤바 색상 */

  &::-webkit-scrollbar {
    width: 6px; /* Chrome, Safari: 스크롤바 너비 */
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc; /* Chrome, Safari: 스크롤바 색상 */
    border-radius: 3px; /* Chrome, Safari: 스크롤바 둥글게 */
  }

  &::-webkit-scrollbar-track {
    background: transparent; /* Chrome, Safari: 트랙 배경 투명 */
  }
`;

const Post = styled.div`
  display: flex;
  gap: 16px;
  border-bottom: 1px solid #eee;
  padding: 16px 0;
  margin-left:10px;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const PostImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

const ReservedLabel = styled.div`
  position: absolute;
  bottom: 10px;
  left: 7px;
  background: #0BB770;
  color: #fff;
  font-size: 12px;
  padding: 2px 4px;
  border-radius: 4px;
`;

const PostInfo = styled.div`
  flex: 1;
`;

const Currency = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #8ea0ac;
  background: rgba(142, 160, 172, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 4px;
`;

const Amount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
`;

const Details = styled.div`
  font-size: 11px;
  color: #666;
  display: flex;
  align-items: left;
  gap: 4px; /* 텍스트 간 간격 */
`;

const Distance = styled.div`
  color: #CA2F28;
  margin-bottom: 4px;
  margin-left:0;
`;

const Won = styled.div`
  margin-bottom: 4px;
  margin-left:10px;
`;

const Location = styled.div`
  display: flex;
  gap: 0px;
  color: #898D99;
  font-size: 12px;
  align-self: flex-start; 
  margin-left:-10px;
`;

const RecommendationSection = styled.div`
  position: fixed;
  bottom: 62px; /* NavBar 바로 위 */
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
  box-shadow: 0px -2px 8px rgba(0, 0, 0, 0.1); /* 약간의 그림자 효과 */
  border-radius: 4px;
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
