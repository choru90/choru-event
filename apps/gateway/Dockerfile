# ─── 1단계: Builder ──────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 루트 설정 파일 복사
COPY package.json package-lock.json nest-cli.json tsconfig.json ./

# 앱 레벨 설정 복사
COPY apps/gateway/tsconfig.app.json apps/gateway/tsconfig.app.json

# Builder 전용 의존성 설치 (@nestjs/cli 포함)
RUN npm ci

# 전체 소스 복사
COPY . .

# Gateway 프로젝트만 빌드
RUN npx nest build gateway

# ─── 2단계: Runtime ──────────────────────────────
FROM node:18-alpine
WORKDIR /usr/src/app

# 프로덕션 의존성만 설치
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 빌드 산출물만 복사 (gateway dist → 로컬 dist)
COPY --from=builder /usr/src/app/dist/apps/gateway ./dist

# 포트 설정
EXPOSE ${GATEWAY_PORT}

# 실행
CMD ["node", "dist/main.js"]
