import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backarrow from "../../images/backarrow.svg";
import editicon from "../../images/editicon.svg";

function MyPage() {
  const navigate = useNavigate();

  // 사용자 정보 상태 (API 연동 예정)
  const [userInfo, setUserInfo] = useState({
    profileImg: "https://via.placeholder.com/80",
    name: "김이화",
    email: "kimewha@ewha.ac.kr",
  });

  const [userAddress, setUserAddress] = useState("");
  const [tradeAddress, setTradeAddress] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // 다음 주소 검색 실행
  const openKakaoPostcode = (setAddress) => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setAddress(data.address);
      },
    }).open();
  };

  return (
    <Container>
      {/* 헤더 */}
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <Title>마이페이지</Title>
      </Header>

      {/* 프로필 섹션 */}
      <ProfileSection>
        <ProfileImage src={userInfo.profileImg} alt="프로필 사진" />
        <UserName>{userInfo.name}</UserName>
      </ProfileSection>

      {/* 버튼 섹션 */}
      <ButtonGrid>
        <Button>기부 내역</Button>
        <Button onClick={() => navigate('/myexchange')} >환전 내역</Button>
        <Button onClick={() => navigate('/mysell')}>나의 판매</Button>
        <Button onClick={() => navigate('/calculator')}>외화 계산기</Button>
      </ButtonGrid>

      {/* 구분선 및 정보 섹션 */}
      <Divider />
      <InfoHeader>
        <InfoTitle>나의 정보</InfoTitle>
        <EditButton onClick={() => setIsEditing(!isEditing)} isEditing={isEditing}>
          {isEditing ? "확인" : "수정하기"}
          {!isEditing && <EditIcon src={editicon} alt="수정 아이콘" />}
        </EditButton>
      </InfoHeader>
      
      <InfoSection>
        <InfoItem>
          <Label>이름</Label>
          <DisabledInput value={userInfo.name} readOnly disabled />
        </InfoItem>
        <InfoItem>
          <Label>이메일</Label>
          <DisabledInput value={userInfo.email} readOnly disabled />
        </InfoItem>
        <InfoItem>
          <Label>내 주소</Label>
          <Input
            type="text"
            value={userAddress}
            readOnly={!isEditing}
            disabled={!isEditing}
            onClick={() => isEditing && openKakaoPostcode(setUserAddress)}
          />
        </InfoItem>
        <InfoItem>
          <Label>거래 주소</Label>
          <Input
            type="text"
            value={tradeAddress}
            readOnly={!isEditing}
            disabled={!isEditing}
            onClick={() => isEditing && openKakaoPostcode(setTradeAddress)}
          />
        </InfoItem>
      </InfoSection>
    </Container>
  );
}

export default MyPage;

// 스타일 정의
const Container = styled.div`
  width: 100%;
  min-height: 110vh;
  padding-bottom: 3000px;
  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-bottom: 100px;
  overflow-y: auto;
  padding-bottom: 80px;
  overflow-y: auto;
  background: #fff;
  padding: 16px;
  text-align: center;
  justify-content: space-between;
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

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #ededed;
`;

const UserName = styled.h3`
  font-size: 16px;
  margin-top: 10px;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  row-gap: 20px;
  column-gap: 5px;
  padding: 10px 0;
`;

const Button = styled.button`
  background: #ca2f28;
  width: 80%;
  height:60px;
  color: white;
  font-size: 14px;
  font-weight: 300;
  border: none;
  border-radius: 15px;
  padding: 15px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background: #a92521;
  }
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background: #ddd;
  margin: 10px 0;
`;

const InfoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`;

const InfoTitle = styled.h3`
  font-size: 16px;
  font-wight:400;
  margin-left:0;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  color: ${({ isEditing }) => (isEditing ? '#ca2f28' : '#898d99')}; 
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right:0;
`;


const EditIcon = styled.img`
  width: 16px;
  margin-left: 5px;
`;

const InfoSection = styled.div`
  text-align: left;
  padding: 20px;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const Label = styled.p`
  font-size: 14px;
  font-weight: 500;
  margin-bottom:10px;
  margin-top:0px;
`;

const DisabledInput = styled.input`
  width: 100%;
  padding: 10px;
  background: #B9B9B9;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  color: #FFFFFF;
  cursor: not-allowed;
  font-weight: 200;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #C8C8C8;
  font-size: 14px;
  cursor: pointer;
  ::placeholder {
    font-size: 14px;
    color: #888; 
    transition: color 0.3s ease; 
  }

  &:focus {
    outline: none;
    border: 1px solid #CA2F28;
  }
`;
