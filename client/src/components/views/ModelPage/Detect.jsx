import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // React Router 사용

import BackArrow from "../../images/backarrow.svg"; // SVG 아이콘 불러오기

const Detect = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [currencyData, setCurrencyData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [cameraHeight, setCameraHeight] = useState(window.innerHeight * 0.8);

  useEffect(() => {
    const updateHeight = () => {
      setCameraHeight(window.innerHeight * 0.8);
    };
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("카메라 접근 오류:", error);
      }
    };
    startCamera();
  }, []);

  const captureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "capture.jpg");

      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8000/predict",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        console.log("FastAPI 응답:", response.data);

        let detectedCurrency = {
          country: "알 수 없음",
          amount: "-",
          krwValue: "-",
        };

        if (response.data?.predictions?.length > 0) {
          detectedCurrency = response.data.predictions[0];
        }

        setCurrencyData(detectedCurrency);
        setShowPopup(true);
      } catch (error) {
        console.error("화폐 감지 오류:", error);
        setCurrencyData({ country: "오류 발생", amount: "-", krwValue: "-" });
        setShowPopup(true);
      }
      setLoading(false);
    }, "image/jpeg");
  };

  return (
    <div style={styles.container}>
      {/* 이전 버튼 & 타이틀 */}
      <div style={styles.header}>
        <img
          src={BackArrow}
          alt="뒤로 가기"
          style={styles.backButton}
          onClick={() => navigate(-1)} // 이전 페이지로 이동
        />
        <h2 style={styles.title}>카메라로 화폐 감지</h2>
      </div>

      {/* 카메라 화면 */}
      <div style={{ ...styles.cameraContainer, height: `${cameraHeight}px` }}>
        <video ref={videoRef} autoPlay playsInline style={styles.video}></video>
      </div>

      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ display: "none" }}
      ></canvas>

      {/* 🔍 감지 버튼 */}
      <div style={styles.buttonContainer}>
        <button
          style={styles.detectButton}
          onClick={captureAndDetect}
          disabled={loading}
        >
          {loading ? "처리 중..." : "감지하기"}
        </button>
      </div>

      {/* 🔍 감지된 결과 팝업 */}
      {showPopup && currencyData && (
        <div style={styles.popup}>
          <h3 style={styles.popupTitle}>화폐 정보</h3>
          <div style={styles.popupContent}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>화폐의 국가</span>
              <span style={styles.infoValue}>{currencyData.country}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>금액</span>
              <span style={styles.infoValue}>{currencyData.amount}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>현재 원화 가치</span>
              <span style={styles.infoValue}>{currencyData.krwValue}원</span>
            </div>
          </div>
          <button
            style={styles.confirmButton}
            onClick={() => setShowPopup(false)}
          >
            확인
          </button>
        </div>
      )}
    </div>
  );
};

export default Detect;

const styles = {
  container: {
    textAlign: "center",
    fontFamily: "Pretendard, sans-serif",
    padding: "20px",
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    gap: "10px",
    paddingBottom: "30px",
  },
  backButton: {
    width: "24px",
    height: "24px",
    cursor: "pointer",
    position: "absolute",
    left: "5px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: 0,
    flex: 1,
    textAlign: "center",
  },
  cameraContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "12px",
    overflow: "hidden",
    background: "black",
  },
  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  buttonContainer: {
    marginTop: "15px",
  },
  detectButton: {
    backgroundColor: "#CA2F28",
    color: "white",
    border: "none",
    padding: "14px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
  popup: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
    minWidth: "300px",
    maxWidth: "360px",
    fontFamily: "Pretendard, sans-serif",
  },
  popupTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  popupContent: {
    padding: "10px 0",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: "15px",
  },
  infoLabel: {
    fontWeight: "bold",
    color: "#333",
    textAlign: "left",
    flex: 1,
  },
  infoValue: {
    color: "#666",
    textAlign: "right",
    flex: 1,
  },
  confirmButton: {
    backgroundColor: "#CA2F28",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginTop: "15px",
  },
};
