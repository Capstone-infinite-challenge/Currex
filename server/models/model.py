from fastapi import FastAPI, File, UploadFile
import torch
from ultralytics import YOLO
import shutil
import os
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 앱 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 현재 모델 파일 경로 지정
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "best.pt")  # best.pt 경로 지정

# temp 폴더 생성 (파일 저장 경로)
TEMP_DIR = os.path.join(MODEL_DIR, "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

#  모델 파일 존재 여부 확인 후 로드
if os.path.exists(MODEL_PATH):
    print(f" YOLO 모델 로드 중: {MODEL_PATH}")
    model = YOLO(MODEL_PATH)
else:
    raise FileNotFoundError(f" Model file not found: {MODEL_PATH}")

@app.post("/predict")
async def predict_currency(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)  # temp 폴더 저장

    # 이미지 파일을 저장하는 로그 출력
    print(f" 파일 저장 중: {file_path}")

    # 이미지 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #  FastAPI가 받은 파일을 정상적으로 저장했는지 확인
    if not os.path.exists(file_path):
        print(f"파일 저장 실패: {file_path}")
        return {"error": "파일 저장 실패"}

    print(f"파일 저장 완료: {file_path}")

    #  저장된 이미지 정보 출력 (PIL 사용)
    try:
        img = Image.open(file_path)
        print(f"이미지 정보: {img.format}, {img.size}, {img.mode}")
    except Exception as e:
        print(f"이미지 로드 실패: {e}")
        return {"error": "이미지 로드 실패"}

    # 모델 예측 수행 로그 출력
    print(f"모델 예측 시작: {file_path}")
    results = model(file_path, conf=0.1)

    # 결과 처리
    detected_objects = []
    for result in results:
        for box in result.boxes:
            detected_objects.append({
                "class": int(box.cls[0]),
                "confidence": float(box.conf[0]),
                "bbox": box.xyxy[0].tolist()
            })

    print(f" 모델 예측 완료: {len(detected_objects)} 개 객체 감지됨")

    return {"predictions": detected_objects}
