import React from "react";
import styled from "styled-components";
import infoicon from "../../images/infoicon.svg";
import noticealarm from "../../images/noticealarm.svg";
import postmail from "../../images/postmail.svg";
import coffeecup from "../../images/coffeecup.svg";

function Donate() {
  return (
    <Container>
      <Header>
        <Title>기부하기</Title>
        <AlarmIcon src={noticealarm} alt="알림" />
      </Header>

      <DonationBox>
        <DonationHeaderWrapper>
          <DonationHeader>
            <DonationYear>2024년 기부금</DonationYear>
            <DonationAmount>98,000원</DonationAmount>
          </DonationHeader>
          <PostMailIcon src={postmail} alt="기부 메일" />
        </DonationHeaderWrapper>

        <ButtonContainer>
          <InfoButton>
            <InfoIcon src={infoicon} alt="기부 절차 안내" />
            기부 절차 안내
          </InfoButton>
          <DonateButton>기부하기</DonateButton>
        </ButtonContainer>
      </DonationBox>

      <Banner>
        <BannerTextContainer>
          <BannerText>작은 커피 한 잔 값으로</BannerText>
          <BannerTextBold>따뜻한 변화를 만들어 보세요!</BannerTextBold>
        </BannerTextContainer>
        <CoffeeIcon src={coffeecup} alt="커피" />
      </Banner>

      <RankingSection>
        <RankingHeader>
          <RankingTitle>기부 랭킹</RankingTitle>
          <RankingDate>2024년 11월 27일 16:33:41 기준</RankingDate>
        </RankingHeader>

        <RankingList>
          {[...Array(9)].map((_, index) => (
            <RankingItem key={index}>
              <RankingNumber>{index + 1}</RankingNumber>
              <CompanyName>
                {index % 3 === 0
                  ? "삼성전자"
                  : index % 3 === 1
                  ? "현대자동차"
                  : "당근마켓"}
              </CompanyName>
              <UserName>{index % 2 === 0 ? "김*화" : "박*진"}</UserName>
              <DonationAmountRanking>
                {index % 3 === 0 ? "350,000원" : "270,000원"}
              </DonationAmountRanking>
            </RankingItem>
          ))}
        </RankingList>
      </RankingSection>
    </Container>
  );
}

export default Donate;

const Container = styled.div`
  width: 100%;
  max-width: 400px;
  margin: auto;
  padding: 16px;
  background-color: #fff;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  color: #1f2024;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: 24px;
`;

const AlarmIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;
`;

const DonationBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid #f1f1f1;
  background: linear-gradient(103deg, #ec662c 0%, #ca2f28 32%);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.02);
  margin-top: 16px;
`;

const DonationHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  gap: 12px;
  align-self: stretch;
`;

const DonationHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const DonationYear = styled.span`
  color: #e1e1e1;
  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
`;

const DonationAmount = styled.h1`
  color: #fff;
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
  line-height: 32px;
`;

const PostMailIcon = styled.img`
  display: flex;
  padding: 12px;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.16);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const InfoButton = styled.button`
  display: flex;
  width: 163px;
  padding: 12px 36px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 8px;
  border: 1px solid rgba(241, 241, 241, 0.08);
  background: rgba(255, 255, 255, 0.12);
  color: white;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

const InfoIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
`;

const DonateButton = styled.button`
  display: flex;
  width: 123px;
  padding: 12px 36px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #1f2024;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const Banner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 12px;
  background: #1f2024;
  margin-top: 16px;
`;

const BannerTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const BannerText = styled.span`
  width: 190px;
  color: #fff;
  font-family: Pretendard;
  font-size: 11px;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: -0.3px;
`;

const BannerTextBold = styled.span`
  color: #fff;
  font-family: Pretendard;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.3px;
`;

const CoffeeIcon = styled.img`
  width: 64px;
  height: 64px;
  flex-shrink: 0;
`;

const RankingSection = styled.div`
  margin-top: 16px;
`;

const RankingHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

const RankingTitle = styled.h3`
  color: #1f2024;
  font-family: Pretendard;
  font-size: 18px;
  font-weight: 700;
`;

const RankingDate = styled.span`
  color: #c8c8c8;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
`;

const RankingList = styled.ul`
  margin-top: 16px;
`;

const RankingItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f1f1f1;
`;

const RankingNumber = styled.span`
  color: #ca2f28;
  font-family: Pretendard;
  font-size: 14px;
  font-weight: 900;
  text-align: center;
`;

const CompanyName = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const UserName = styled.span`
  font-size: 16px;
  color: #888;
`;

const DonationAmountRanking = styled.span`
  font-size: 16px;
  font-weight: bold;
`;
