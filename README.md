# Choru-Event Platform

분산 마이크로서비스 구조의 이벤트 & 보상 관리 시스템

- **Auth Service**: 유저 가입·로그인·토큰 리프레시
- **Event Service**: 이벤트 등록·조회·진행도 갱신
- **Gateway Service**: REST 게이트웨이 (JWT 인증·권한 검사·NATS 프록시)
- **Reward 기능**: 이벤트별 보상 생성·조회·유저 보상 요청·관리자/감사자 요청 내역 조회

각 서비스는 NATS 로 통신하고, MongoDB 에 도메인 데이터를 저장합니다.
<img width="1084" alt="스크린샷 2025-05-20 오후 12 13 49" src="https://github.com/user-attachments/assets/c84a8115-f6e2-4e41-a1dc-c5c92be267f5" />

---

## 🎯 핵심 설계 및 선택 이유

### 1. NATS

- **메시징**: NATS 사용으로 서비스 간 요청/응답 지연 최소화
- **비동기 확장성**: 이벤트 생성·보상 요청 등 트래픽이 몰릴 때 유연 대응
- **서비스 격리**: Auth, Event, Gateway 각 역할 분리해 책임 명확화
-

### 2. Mikro-orm

- **도메인 주도 개발**: MongoDB의 데이터를 entity화 하여서 도메인이 집중할수있도록 하기 위해 선택, Embeddable등을 통해서 내부 객체를 사용하여 도메인의 응집도를 높임

## REST API

### 1. 인증

| Method | Path             | Guard | Body                       | Response                        |
|--------|------------------|-------|----------------------------|---------------------------------|
| POST   | `/auth/register` | —     | `CreateUserDto`            | `{ accessToken, refreshToken }` |
| POST   | `/auth/login`    | —     | `LoginDto`                 | `{ accessToken, refreshToken }` |
| POST   | `/auth/refresh`  | —     | `{ refreshToken: string }` | `{ accessToken, refreshToken }` |

### 2. 이벤트

| Method | Path                       | Guard                         | Body             | Response           |
|--------|----------------------------|-------------------------------|------------------|--------------------|
| POST   | `/event`                   | `JwtAuthGuard` + `RolesGuard` | `CreateEventDto` | `EventDto`         |
| GET    | `/event`                   | —                             | —                | `EventDto[]`       |
| GET    | `/event/:id`               | —                             | —                | `EventDto`         |
| PATCH  | `/event/:eventId/progress` | `JwtAuthGuard`                | —                | `{ status: 'ok' }` |

### 3. 보상

| Method | Path                               | Guard                         | Body / Params                     | Response             |
|--------|------------------------------------|-------------------------------|-----------------------------------|----------------------|
| POST   | `/event/:id/rewards`               | `JwtAuthGuard` + `RolesGuard` | `CreateRewardDto`                 | `RewardDto[]`        |
| GET    | `/event/:id/rewards`               | —                             | —                                 | `RewardDto[]`        |
| POST   | `/events/:id/rewards/:rid/request` | `JwtAuthGuard`                | 경로: `id`, `rid`, + 자동 추출 `userId` | `RewardRequestDto`   |
| GET    | `/users/rewards/requests`          | `JwtAuthGuard`                | —                                 | `RewardRequestDto[]` |
| GET    | `/rewards/requests`                | `JwtAuthGuard` + `RolesGuard` | —                                 | `RewardRequestDto[]` |

## 검증 방법

1. POST /auth/register 호출 (유저 등록)
2. POST /auth/login 호출 (로그인)
3. (토큰 refresh가 필요한 경우) POST /auth/refresh
4. POST /event (이벤트 생성 - role, token 필요)
5. GET /event (이벤트 목록 조회)
6. GET /event/:id (이벤트 단건 조회)
7. POST /event/:id/rewards (이벤트에 보상 추가 - role, token필요)
8. GET /event/:id/rewards (이벤트 리워드 조회)
9. PATCH /event/:id/progress (이벤트 진행 event completeCount만큼 진행 - token)
10. POST /event/:id/reward/:rewardId/request (이벤트 보상 요청 - token 필요)
11. GET /user/rewards/requests (유저 이벤트 요청 조회 - token 필요)
12. GET /rewards/requests (유저 이벤트 요청 목록 조회 - role, token 필요)

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

```

## 실행방법

root 프로젝트에서 아래 docker compose 실행 명령어로 실행

```
docker-compose up --build
```