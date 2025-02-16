import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backarrow from "../../images/backarrow.svg";
import dropdown from "../../images/dropdown.svg";
import searchicon from "../../images/searchicon.svg";
import pictureicon from "../../images/pictureicon.svg";
import KakaoMap from "../..//utils/KakaoMap";
import api from "../../utils/api";

function DonateRegister() {
  const [currency, setCurrency] = useState("USD"); // 기본 선택된 통화
  const [exchangeRate, setExchangeRate] = useState(0); // 환율 기본값 설정
  const [amount, setAmount] = useState(""); // 거래 희망 금액
  const [KRWAmount, setKRWAmount] = useState(""); // 환산된 원화 금액
  const [userLocation, setUserLocation] = useState(""); // 거래 희망 위치
  const [uploadedImages, setUploadedImages] = useState([]); // 업로드된 이미지
  const [content, setContent] = useState(""); // 내용 입력
  const [latitude, setLatitude] = useState(null); // 위도
  const [longitude, setLongitude] = useState(null); // 경도

  const maxImageCount = 5; // 최대 업로드 가능 이미지 수
  const navigate = useNavigate();

  useEffect(() => {
    if (currency) {
      fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`)
        .then((res) => res.json())
        .then((data) => {
          setExchangeRate(data.rates.KRW || 0); // 환율 데이터 업데이트
        })
        .catch((error) => console.error("환율 API 호출 실패:", error));
    }
  }, [currency]);

  useEffect(() => {
    if (amount && exchangeRate) {
      setKRWAmount(Math.floor(amount * exchangeRate)); // 소수점 제거
    } else {
      setKRWAmount("");
    }
  }, [amount, exchangeRate]);

  const openKakaoPostcode = () => {
    new window.daum.Postcode({
      oncomplete: async (data) => {
        const fullAddress = data.address; // 선택된 주소
        setUserLocation(fullAddress); // 주소 업데이트

        try {
          // Kakao Local API 호출 시 Authorization 헤더 추가
          const geocodeUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
            fullAddress
          )}`;
          const kakaoApiKey = process.env.REACT_APP_KAKAO_API_KEY;

          if (!kakaoApiKey) {
            console.error(" Kakao API Key가 설정되지 않았습니다!");
            return;
          }

          const response = await axios.get(geocodeUrl, {
            headers: {
              Authorization: `KakaoAK ${kakaoApiKey}`, //  Authorization 헤더 확인
            },
          });

          const { documents } = response.data;
          if (documents.length > 0) {
            const { x, y } = documents[0]; // x: 경도, y: 위도
            setLongitude(parseFloat(x));
            setLatitude(parseFloat(y));
            console.log("위치 정보 확인 - 위도:", y, "경도:", x);
          } else {
            alert("위치 정보를 찾을 수 없습니다.");
          }
        } catch (error) {
          console.error("주소 변환 중 오류 발생:", error);
          alert("주소 변환에 실패했습니다.");
        }
      },
    }).open();
  };

  /** 이미지 업로드 핸들러 */
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (uploadedImages.length + files.length > maxImageCount) {
      return alert(`최대 ${maxImageCount}장까지 업로드할 수 있습니다.`);
    }
    setUploadedImages((prevImages) => [...prevImages, ...files]);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value); // 통화 변경
  };

  const handleSubmit = async () => {
    if (!latitude || !longitude || !amount || !userLocation) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const accessToken =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    console.log("현재 저장된 accessToken:", accessToken); // 로그 추가

    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }

    const formData = new FormData();
    formData.append("currency", currency);
    formData.append("amount", amount);
    formData.append("sellerLocation", userLocation);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("content", content);
    formData.append("name", "판매글");
    formData.append("KRWAmount", KRWAmount);

    uploadedImages.forEach((image, index) => {
      formData.append("images", image);
      console.log(`업로드 이미지 ${index}:`, image);
    });

    console.log("전송할 데이터 확인:", {
      currency,
      amount,
      sellerLocation: userLocation,
      latitude,
      longitude,
      content,
      uploadedImages,
    });

    try {
      const response = await api.post("/api/sell/productRegi", formData);
      console.log("판매 등록 성공:", response.data);
      alert("판매 등록이 완료되었습니다!");
      navigate("/list");
    } catch (error) {
      console.error("판매 등록 오류:", error);
      alert(error.response?.data?.error || "서버 오류 발생");
    }
  };

  return (
    <Container>
      <Header>
        <BackButton
          src={backarrow}
          alt="뒤로가기"
          onClick={() => navigate(-1)}
        />
      </Header>

      <TitleContainer>
        <Title>
          감사합니다.
          <br />
          기부 정보를 알려주세요.
        </Title>
        <ExchangeRateText>
          * 한국에서는 기부금에 대해 세금 혜택을 적용합니다.
          <br />
          10만원 이하의 기부금은 100% 소득공제가 적용되며,
          <br />
          10만원을 초과하는 금액에 대해서는 소득에 따라 공제율이 달라집니다.
        </ExchangeRateText>
      </TitleContainer>

      <Form>
        <Label>
          기부 금액
          <CurrencyInputWrapper>
            <CurrencyDropdown
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="JPY">JPY</option>
              <option value="EUR">EUR</option>
              <option value="CNY">CNY</option>
              <option value="HKD">HKD</option>
              <option value="TWD">TWD</option>
              <option value="AUD">AUD</option>
              <option value="VND">VND</option>
            </CurrencyDropdown>
            <DropdownIcon src={dropdown} alt="드롭다운 아이콘" />
            <AmountInput
              type="number"
              placeholder="기부하시는 금액을 입력해 주세요"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Suffix>{currency}</Suffix>
          </CurrencyInputWrapper>
        </Label>

        <Note>
          잠깐! 총액을 모른다면?{" "}
          <CalculatorLink onClick={() => navigate("/calculator")}>
            외화계산기 이용
          </CalculatorLink>
        </Note>

        <Label>
          기부자 이름
          <InputRow>
            <StyledInput type="text" placeholder="성" />
            <StyledInput type="text" placeholder="이름" />
          </InputRow>
        </Label>

        <Label>
          연락처
          <InputContainer>
            <StyledInput type="number" placeholder="연락처를 알려주세요" />
          </InputContainer>
        </Label>

        <Label>
          기부자 주소
          <LocationWrapper>
            <WideInput
              type="text"
              placeholder="기부자 주소를 알려주세요"
              value={userLocation}
              readOnly
            />
            <LocationButton onClick={openKakaoPostcode}>
              <SearchIcon src={searchicon} alt="주소 검색" />
            </LocationButton>
          </LocationWrapper>
        </Label>

        <Label>
          <ImageSection>
            <ImageLabel>
              기부물 사진 ({maxImageCount - uploadedImages.length}장 남음)
            </ImageLabel>
            <ImageUploadWrapper>
              <UploadButton htmlFor="imageUpload">
                <UploadIcon src={pictureicon} alt="사진 업로드" />
              </UploadButton>
              <UploadInput
                id="imageUpload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
              {uploadedImages.map((image, index) => (
                <ImagePreview
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`업로드된 이미지 ${index + 1}`}
                />
              ))}
            </ImageUploadWrapper>
            <ImageInfo>
              기부 금액과 포장이 잘보이도록 사진을 업로드해 주세요.
            </ImageInfo>
          </ImageSection>
        </Label>

        <SubmitButton onClick={handleSubmit}>기부 등록</SubmitButton>
      </Form>
    </Container>
  );
}

export default DonateRegister;

const Container = styled.div`
  width: 375px;
  height: 812px;
  position: relative;
  background: #ffffff;
  box-shadow: 0px 8px 24px rgba(255, 255, 255, 0.12);
  border-radius: 32px;
  overflow: hidden;
  font-family: "Pretendard", sans-serif;
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

const CurrencyDropdown = styled.select`
  font-size: 16px;
  font-weight: 600;
  background: none;
  border: none;
  cursor: pointer;
  appearance: none;
  padding: 4px 8px;
`;

const CurrencyInputWrapper = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 7px;
  gap: 8px;
  width: 123%;
`;

const DropdownIcon = styled.img`
  position: absolute;
  margin-left: 45px;
  margin-top: 10px;
  transform: translateY(-50%);
  width: 12px;
  height: 12px;
`;

const AmountInput = styled.input`
  border: none;
  font-size: 12px;
  flex: 2;
`;

const TitleContainer = styled.div`
  padding: 20px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  line-height: 36px;
  color: #1f2024;
`;

const ExchangeRateText = styled.p`
  font-size: 11px;
  font-weight: 300;
  line-height: 20px;
  color: #898d99;
  margin-top: 5px;
`;

const Form = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-left: 0px;
`;

const Label = styled.label`
  font-size: 11px;
  font-weight: 400;
  color: #8ea0ac;
  line-height: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 0px;
`;

const CurrencyAmountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled.input`
  width: 125%;
  padding: 11px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  margin-left: 10px;

  &:focus {
    outline: none;
    border: 1px solid #ca2f28;
  }
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  width: 100%;

  &:focus {
    border-color: #ca2f28;
    outline: none;
  }
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px; /* 성, 이름 입력칸 사이 간격 */
`;

const Suffix = styled.span`
  position: absolute;
  left: 280px;
  font-size: 14px;
  color: #888;
`;

const KRWSuffix = styled.span`
  position: absolute;
  left: 270px;
  top: 44%;
  transform: translateY(-50%);
  font-size: 14px;
  color: #888;
`;

const Note = styled.p`
  font-size: 11px;
  font-weight: 500;
  color: #666666;
  text-align: left;
  margin-left: 0px;
`;

const CalculatorLink = styled.span`
  color: #ca2f28;
  font-weight: 700;
  cursor: pointer;
  margin-left: 160px;
`;

const LocationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 135%;
`;

const WideInput = styled.input`
  width: 200%;
  padding: 11px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  margin-top: 0px;
  margin-left: 0px;

  ::placeholder {
    font-size: 14px;
    color: #888;
    transition: color 0.3s ease;
  }

  &:focus {
    outline: none;
    border: 1px solid #ca2f28;
  }
`;

const LocationButton = styled.button`
  background: none;
  border: none;
`;

const SearchIcon = styled.img`
  width: 16px;
  height: 16px;
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ImageLabel = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #8ea0ac;
  margin-left: 0px;
`;

const ImageUploadWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0px;
`;

const ImageInfo = styled.div`
  display: flex;
  margin-top: 5px;
`;

const UploadButton = styled.label`
  width: 52px;
  height: 52px;
  background: #f7f7f7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const UploadInput = styled.input`
  display: none;
`;

const UploadIcon = styled.img`
  width: 24px;
  height: 24px;
`;

const ImagePreview = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 8px;
  object-fit: cover;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  background: #ca2f28;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  border: none;
  border-radius: 12px;
  box-shadow: 0px 5px 10px rgba(26, 26, 26, 0.1);
  cursor: pointer;
`;
