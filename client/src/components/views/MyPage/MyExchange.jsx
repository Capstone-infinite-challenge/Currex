import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";
import NavBar from "../NavBar/NavBar";

function MyExchange() {
const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("전체");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 거래 내역 (더미 데이터) 
  const exchangeHistory = [
    {
      id: 1,
      date: "2024.11.09 21:40:19",
      userName: "Olivia Gracia",
      profileImg: "https://via.placeholder.com/40",
      currency: "USD",
      amount: 300,
      price: "1,000,000원",
      type: "구매", // 구매->파란색
    },
    {
      id: 2,
      date: "2024.11.01 15:17:42",
      userName: "Sato Yui",
      profileImg: "https://via.placeholder.com/40",
      currency: "JPN",
      amount: 3000,
      price: "1,000,000원",
      type: "판매", // 판매->빨간색
    },
  ];

  const handleToggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const handleSelectFilter = (filter) => {
    setSelectedFilter(filter);
    setIsDropdownOpen(false);
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <Title>환전 내역 조회</Title>
      </Header>

      {/* 필터 영역 */}
      <FilterSection>
        <FilterButton onClick={handleToggleDropdown}>
          {selectedFilter}
          <DropdownIcon src={dropdown} alt="드롭다운" />
        </FilterButton>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <DropdownMenu>
            <DropdownItem onClick={() => handleSelectFilter("전체")}>전체</DropdownItem>
            <DropdownItem onClick={() => handleSelectFilter("판매")}>판매</DropdownItem>
            <DropdownItem onClick={() => handleSelectFilter("구매")}>구매</DropdownItem>
          </DropdownMenu>
        )}
      </FilterSection>

      {/* 거래 내역 리스트 */}
      <TradeList>
        {exchangeHistory.map((exchange) => (
          <TradeItem key={exchange.id}>
            <TradeLeft>
              <Date>{exchange.date}</Date>
              <ProfileWrapper>
                <UserProfile src={exchange.profileImg} alt="User" />
                <UserName>{exchange.userName}</UserName>
              </ProfileWrapper>
            </TradeLeft>
            <TradeDetail>
              <TradeType>{exchange.type}</TradeType>
              <TradeAmount type={exchange.type}>
                {exchange.currency} {exchange.amount}
              </TradeAmount>
              <TradePrice>{exchange.price}</TradePrice>
            </TradeDetail>
          </TradeItem>
        ))}
      </TradeList>
      <NavBar active="MyPage" />
    </Container>
  );
}

export default MyExchange;


/* ✅ 스타일 */
const Container = styled.div`
  width: 375px;
  height: 812px;
  position: relative;
  background: #ffffff;
  border-radius: 32px;
  overflow: hidden;
`;

const Header = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: white;
`;

const BackButton = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-left: 0px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 700;
  flex-grow: 1; 
 text-align:center;
`;

/* 필터 드롭다운 */
const FilterSection = styled.div`
  display: flex;
  position: relative;
  background: #ca2f28;
  padding: 13px 3px;
  justify-content: flex-start;
  margin-bottom:5px;
`;

const FilterButton = styled.button`
  background: white;
  border-radius: 12px;
  padding: 6px 12px;
  border: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left:10px;
`;

const DropdownIcon = styled.img`
  width: 12px;
  height: 12px;
  margin-left: 6px;
  opacity: 0.8;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 40px;
  left: 12px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  z-index: 10;
  min-width: 100px;
`;

const DropdownItem = styled.div`
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f7f7f7;
  }
`;
const TradeList = styled.div`
  flex: 1;
  padding: 16px;
  color: white;
`;

const TradeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid lightgray;
  padding: 12px 0px; /* 좌측 5px 마진 추가 */
`;

const TradeLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  margin-left: 5px;
`;

const Date = styled.div`
  font-size: 12px;
  color: gray;
  margin-top: 0;
`;

/* ✅ 프로필 + 유저네임을 감싸는 컨테이너 */
const ProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const UserProfile = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid black;
`;

const UserName = styled.div`
  font-size: 12px;
  color: black;
  text-align: center;
`;


const TradeDetail = styled.div`
  text-align: right;
  margin-right:0;
`;

const TradeType = styled.div`
  font-size: 13px;
  color: black;
  margin-top:0;
`;

const TradeAmount = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top:10px;
  color: ${({ type }) => (type === "구매" ? "blue" : "red")}; /* 구매(파랑), 판매(빨강) */
`;

const TradePrice = styled.div`
  color: gray;
  font-size: 12px;
`;

