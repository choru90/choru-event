# Choru-Event Platform

분산 마이크로서비스 구조의 이벤트 & 보상 관리 시스템

- **Auth Service**: 유저 가입·로그인·토큰 리프레시
- **Event Service**: 이벤트 등록·조회·진행도 갱신
- **Gateway Service**: REST 게이트웨이 (JWT 인증·권한 검사·NATS 프록시)
- **Reward 기능**: 이벤트별 보상 생성·조회·유저 보상 요청·관리자/감사자 요청 내역 조회

각 서비스는 NATS 로 통신하고, MongoDB 에 도메인 데이터를 저장합니다.

---

## 📋 사전 준비

- Docker & Docker-Compose 설치
- (선택) 로컬에 별도 NATS/Mongo 설치 불필요 — Compose 파일로 자동 생성

---

## 🔧 환경 변수

프로젝트 루트에 `.env` 파일을 만들고, 아래 내용을 채워 넣으세요:

```dotenv
# MongoDB
MONGO_URI=mongodb://mongo:27017/auth_db

# NATS
NATS_URL=nats://nats:4222

# JWT
JWT_SECRET=choru_jwt_secret
JWT_REFRESH_SECRET=choru_refresh_jwt_secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# 서비스 포트
GATEWAY_PORT=3000
AUTH_PORT=3001
EVENT_PORT=3002
