FROM node:20

# 1. node 관련 작업
# app 디렉토리 생성
WORKDIR /app

# package.json과 package-lock.json 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 2. FastAPI용 python & 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    libsm6 \
    libxext6 \
    && apt-get clean

# 가상환경 생성
RUN python3 -m venv /venv
ENV PATH="/venv/bin:$PATH"

# model 폴더 복사 및 requirements 설치
COPY models/ ./models/

# requirements 설치 (CPU 버전으로 최적화)
# CPU 버전 torch를 별도로 설치 (requirements.txt에서 제거한 이유)
RUN /venv/bin/pip install --upgrade pip && \
    /venv/bin/pip install numpy && \
    /venv/bin/pip install torch==2.0.1+cpu torchvision==0.15.2+cpu torchaudio==2.0.2+cpu \
    --index-url https://download.pytorch.org/whl/cpu && \
    /venv/bin/pip install -r models/requirements.txt

# 나머지 코드 복사
COPY . .

# 앱 포트
EXPOSE 5000

# # FastAPI 서버 실행 (Python 가상환경 사용)
ENV PATH="/venv/bin:$PATH"

# 앱 실행
CMD ["npm", "start"]