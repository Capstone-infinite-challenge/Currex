import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../../utils/api";
import NavBar from "../NavBar/NavBar";
import backarrow from "../../images/backarrow.svg";

function MySell() {
    const navigate = useNavigate();
    const [sells, setSells] = useState([
      {
        _id: "1",
        currency: "JPY",
        amount: 4010,
        location: "서울특별시 마포구 대흥동",
        images: ["https://source.unsplash.com/80x80/?money"],
      },
      {
        _id: "2",
        currency: "USD",
        amount: 205.32,
        location: "서울특별시 서대문구 대현동",
        images: ["https://source.unsplash.com/80x80/?dollar"],
      },
      {
        _id: "3",
        currency: "EUR",
        amount: 108,
        location: "서울특별시 마포구 대흥동",
        images: ["https://source.unsplash.com/80x80/?euro"],
      },
      {
        _id: "4",
        currency: "TWD",
        amount: 23977,
        location: "서울특별시 서대문구 대현동",
        images: ["https://source.unsplash.com/80x80/?taiwan"],
      },
    ]); // 🔹 임시 데이터
  
    const [loading, setLoading] = useState(false); // 임시 데이터이므로 기본 false 설정
    const [error, setError] = useState(null);
    const [exchangeRates, setExchangeRates] = useState({
      USD: 1300,
      JPY: 9.5,
      EUR: 1400,
      TWD: 42,
    }); // 🔹 임시 환율 정보
  
    const [districts, setDistricts] = useState({
      "1": "마포구 대흥동",
      "2": "서대문구 대현동",
      "3": "마포구 대흥동",
      "4": "서대문구 대현동",
    }); // 🔹 임시 행정동 데이터
  
    
    /*// 사용자의 판매 목록 불러오기 
    useEffect(() => {
      const fetchMySells = async () => {
        setLoading(true);
        setError(null);
  
        try {
          const accessToken = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
          if (!accessToken) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
          }
  
          const response = await api.get("/sell/mySellList", {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          });
  
          console.log("내 판매 목록:", response.data);
          setSells(response.data);
        } catch (err) {
          console.error("내 판매 목록 불러오기 실패:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchMySells();
    }, [navigate]);
  
    // 실시간 환율 가져오기 (API 활성화 시 사용)
    /*useEffect(() => {
      const fetchExchangeRates = async () => {
        const uniqueCurrencies = [...new Set(sells.map((sell) => sell.currency))];
        const rates = {};
  
        try {
          await Promise.all(
            uniqueCurrencies.map(async (currency) => {
              const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${currency}`);
              rates[currency] = response.data.rates.KRW;
            })
          );
          setExchangeRates(rates);
        } catch (error) {
          console.error("환율 데이터 불러오기 오류:", error);
        }
      };
  
      if (sells.length > 0) {
        fetchExchangeRates();
      }
    }, [sells]);
  
    // 도로명 주소 → 행정동 변환 (API 활성화 시 사용)
    useEffect(() => {
      const fetchRegionNames = async () => {
        const newDistricts = {};
  
        await Promise.all(
          sells.map(async (sell) => {
            if (!sell.location) return;
  
            try {
              const addressResponse = await axios.get(
                `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(sell.location)}`,
                { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}` } }
              );
  
              if (!addressResponse.data.documents.length) {
                console.warn(`주소 검색 실패: ${sell.location}`);
                return;
              }
  
              const { x, y } = addressResponse.data.documents[0];
  
              const regionResponse = await axios.get(
                `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`,
                { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAOMAP_KEY}` } }
              );
  
              if (!regionResponse.data.documents.length) {
                console.warn(`행정동 변환 실패: ${sell.location} (x=${x}, y=${y})`);
                return;
              }
  
              const regionInfo = regionResponse.data.documents.find((doc) => doc.region_type === "H");
  
              if (regionInfo) {
                newDistricts[sell._id] = `${regionInfo.region_2depth_name} ${regionInfo.region_3depth_name}`;
              }
            } catch (error) {
              console.error("주소 변환 오류:", error);
            }
          })
        );
  
        setDistricts(newDistricts);
      };
  
      if (sells.length > 0) {
        fetchRegionNames();
      }
    }, [sells]);
    */

  return (
    <Container>
      <Header>
        <BackButton src={backarrow} alt="뒤로가기" onClick={() => navigate(-1)} />
        <Title>나의 판매</Title>
      </Header>
        <TotalCount>
          Total <span>{sells.length}</span>
        </TotalCount>


      {loading ? (
        <LoadingMessage>데이터를 불러오는 중...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>데이터를 불러오지 못했습니다.</ErrorMessage>
      ) : sells.length === 0 ? (
        <NoDataMessage>판매 글이 없습니다.</NoDataMessage>
      ) : (
        <PostListContainer>
          {sells.map((sell) => (
            <Post key={sell._id} onClick={() => navigate(`/sell/${sell._id}`)}>
              <ImageContainer>
                {sell.images && sell.images.length > 0 ? (
                  <PostImage src={sell.images[0]} alt="상품 이미지" />
                ) : (
                  <NoImage>이미지 없음</NoImage>
                )}
              </ImageContainer>

              <PostInfo>
          <Currency>{sell.currency}</Currency>
          <Amount>{sell.amount} {sell.currency}</Amount>
          <Details>
          <Distance>
          📍 {districts[sell._id] ? districts[sell._id] : sell.location ? sell.location : "위치 정보 없음"}
          </Distance>
                  <Won>
                    {exchangeRates[sell.currency]
                      ? `${Math.round(sell.amount * exchangeRates[sell.currency])} 원`
                      : "환율 정보 없음"}
                  </Won>
                </Details>
              </PostInfo>
            </Post>
          ))}
        </PostListContainer>
      )}

      <NavBar active="sell" />
    </Container>
  );
}

export default MySell;

// 스타일링 
const Container = styled.div`
  width: 375px;
  margin: 0 auto;
  height: 100vh;
  display: flex;
  flex-direction: column;
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


const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
  flex-grow: 1; 
 text-align:center;
`;

const TotalCount = styled.div`
  font-size: 14px;
  font-weight: bold;
  span {
    color: #CA2F28;
  }
  margin-left: 0;
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
  margin-left: 10px;
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

const LoadingMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  margin-top: 20px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #888;
`; 

const NoImage = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #888;
`; 