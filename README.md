# **CURREX**

<div align="center">
  <img src="https://github.com/Capstone-infinite-challenge/Currex/blob/main/Shot.png?raw=true" alt="CURREX Image" />
</div>

---

## **📜소개**

**P2P 환전 서비스**  
AI 기반 화폐 인식과 위치 기반 매칭을 통해 집에 보관 중인 외화를 근처 사용자와 연결해주는 스마트 외화 직거래 서비스

- **카메라 인식**을 통해 사용자는 자신이 보유한 외화의 종류와 금액 가치를 쉽게 파악할 수 있습니다.
- **위치 기반 매칭**을 통해 근거리 사용자와 간편히 외화 거래를 진행할 수 있습니다.
- **외화 계산기**를 통해 동전/지폐의 개수만 입력하면, 실시간 환율 API를 기반으로 외화 총액과 원화 환산 금액을 자동 계산해줍니다.
- **판매자 매칭**의 경우 구매자의 외화 구매 조건(종류·금액 등)을 바탕으로 가까운 거리 순으로 맞춤 판매자를 추천합니다.
- **거래 장소 추천**기능을 통해 구매자와 판매자의 위치 정보를 기반으로, 중간 거리의 안전한 만남 장소를 자동 추천합니다.
- **AI 기반 화폐 인식** 서비스를 통해, 사용자가 외화를 촬영하면, YOLOv8 기반 인식 모델이 화폐의 국가, 단위, 금액을 식별하고 환산 된 원화 가치까지 자동으로 계산해줍니다.
---


## **팀원 소개**

<div align="center">
<table>
  <tr>
    <td align="center" width="160px">
      <img src="https://avatars.githubusercontent.com/gilmeee" width="120px" style="border-radius: 10px;"><br />
    </td>
    <td align="center" width="160px">
      <img src="https://avatars.githubusercontent.com/m2nsp" width="120px" style="border-radius: 10px;"><br />
    </td>
    <td align="center" width="160px">
      <img src="https://avatars.githubusercontent.com/sejin-coding" width="120px" style="border-radius: 10px;"><br />
    </td>
  </tr>
  <tr>
    <td align="center">
      <a href="https://github.com/gilmeee" target="_blank"><strong>김기림</strong></a>
    </td>
    <td align="center">
      <a href="https://github.com/m2nsp" target="_blank"><strong>박민서</strong></a>
    </td>
    <td align="center">
      <a href="https://github.com/sejin-coding" target="_blank"><strong>박세진</strong></a>
    </td>
  </tr>
  <tr>
    <td align="center">프론트엔드</td>
    <td align="center">백엔드</td>
    <td align="center">AI</td>
  </tr>
</table>

</div>

---

## **시연 영상**

[Youtube 링크](https://www.youtube.com/watch?v=Emd5smV7NlU&t=204s)

---

## 빌드 방법
> 본 프로젝트의 프론트엔드(React)는 **Vercel**을 통해 자동 배포됩니다.

- 코드 수정 후 GitHub 레포지토리에 변경사항을 푸시하면,
- **Vercel이 자동으로 새로 빌드 및 배포**합니다.
- 따라서 별도로 수동 빌드나 배포 명령을 실행할 필요는 없습니다.


> 서버는 Docker 기반으로 구동되며, GitHub Actions를 통해 자동화된 배포가 이루어집니다.  
> 필요한 경우 수동으로는 다음 명령어로도 실행 가능합니다:

```bash
cd server
docker-compose up --build
```

## 🔗 접속 주소
https://currex-frontend.vercel.app

## 🧪 테스트 방법
- 테스트 계정 : 
  - ID : bsejin80@gmail.com
  - PW : ashleyisboy

## **🛠 실행 방법**

- 프론트엔드 직접 실행 시
```
cd client
npm install
npm start     
```
- 백엔드 직접 실행 시
```
cd server
npm install
npm start
```
- 전체 직접 실행 시
```
# 프론트 패키지 설치
cd client
npm install
cd ..
# 백엔드 패키지 설치
cd server
npm install
cd ..
# 루트 경로에서 실행
npm install
npm start
```

## 📚 사용된 오픈소스 라이브러리
### Backend
- **express**: Node.js 웹 프레임워크
- **mongoose**: MongoDB ODM(Object Document Mapping)
- **socket.io**: 실시간 양방향 통신(WebSocket)
- **dotenv**: 환경 변수 설정
- **jsonwebtoken**: JWT 기반 인증

### Frontend
- **react**: 사용자 인터페이스 라이브러리
- **axios**: HTTP 클라이언트
- **react-router-dom**: SPA 라우팅 처리

### AI (Model & Inference)
- **Ultralytics YOLOv8**: 화폐 객체 탐지용 딥러닝 모델 프레임워크 (PyTorch 기반)
- **FastAPI**: 이미지 업로드 및 YOLO 추론 결과 API 제공
- **torch**: YOLO 모델 로딩 및 추론 수행
- **opencv-python**: 이미지 전처리 및 시각화 처리

### Deployment
- **Docker**: 컨테이너 기반 애플리케이션 실행 환경
- **docker-compose**: 멀티 컨테이너 설정 및 실행 도구
- **Nginx**: 리버스 프록시 및 정적 파일 제공

## 🗃 Database or Data 

- **MongoDB Atlas**: 사용자 정보, 외화 거래 내역, 채팅 메시지 등을 저장하는 클라우드 기반 NoSQL 데이터베이스입니다.
  - 주요 컬렉션:
    - `users`: 사용자 계정 정보
    - `sells`: 등록된 외화 거래 정보
    - `chatrooms`: 채팅방 저장
    - `donations`: 기부 내역 저장
- **Redis (클라우드 Redis)**: 실시간 채팅 시스템을 위한 임시 메시지 캐시 및 기부 랭킹 용도로 사용됩니다.

- 모든 연결 정보는 `.env` 파일을 통해 관리되며, 배포 환경에서는 보안상의 이유로 해당 정보가 공개되지 않습니다.


## 📁 프로젝트 디렉토리 구조
root</br>
├── .github/ # 자동 배포 설정 파일 </br>
├── client/ # 프론트엔드 React 애플리케이션 </br>
│ ├── src/ </br>
│ │ ├── pages/ # 주요 페이지 컴포넌트</br>
│ │ ├── components/ # 재사용 가능한 UI 컴포넌트</br>
│ │ └── App.js # 라우팅 및 전체 앱 설정</br>
│ │ └── setupProxy.js # 프록시 설정</br>
│ │ └── socket.js # 소켓 설정</br>
│ └── public/ # 정적 파일 (favicon 등)</br>
│</br>
├── server/ # 백엔드 Node.js 서버</br>
│ ├── routes/ # API 라우터</br>
│ ├── models/ # Mongoose 스키마 정의</br>
│ │ ├── requirements.txt # AI 모델 관련 필요 패키지 설치 목록</br>
│ │ └── model.py # 모델 연결 fastAPI</br>
│ ├── services/ # 비즈니스 로직</br>
│ ├── middleware/ # 미들웨어</br>
│ ├── compose.yml # 도커 설정 파일</br>
│ └── app.js # 서버 엔트리 포인트</br>
└── README.md # 프로젝트 설명</br>

