from fastapi import FastAPI, File, UploadFile
import torch
from ultralytics import YOLO
import shutil
import os

# FastAPI 앱 생성
app = FastAPI()

# 현재 모델 파일 경로 지정
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(MODEL_DIR, "best.pt")  # best.pt 경로 지정

# YOLO 모델 로드 (파일이 존재하는지 확인 후 로드)
if os.path.exists(MODEL_PATH):
    model = YOLO(MODEL_PATH)
else:
    raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

@app.post("/predict")
async def predict_currency(file: UploadFile = File(...)):
    file_path = os.path.join(MODEL_DIR, f"temp/{file.filename}")  # temp 폴더 저장

    # 이미지 저장
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 모델 예측
    results = model(file_path)

    # 결과 처리
    detected_objects = []
    for result in results:
        for box in result.boxes:
            detected_objects.append({
                "class": int(box.cls[0]),
                "confidence": float(box.conf[0]),
                "bbox": box.xyxy[0].tolist()
            })

    return {"predictions": detected_objects}
