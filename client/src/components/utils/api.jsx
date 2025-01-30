import axios from "axios";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // 쿠키 전달 허용
});

// 요청 인터셉터: 만료된 JWT 감지 및 갱신
api.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // JWT 만료 오류 감지
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔄 새로운 토큰 요청 (Refresh Token 사용)
        const res = await axios.post("http://localhost:5000/auth/refreshToken", {}, { withCredentials: true });

        const newAccessToken = res.data.accessToken;
        console.log("🔄 새 토큰 발급:", newAccessToken);

        // 새로운 토큰을 저장
        localStorage.setItem("accessToken", newAccessToken);

        // 헤더에 새 토큰 추가 후 요청 재시도
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("🔴 토큰 갱신 실패:", refreshError);
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
