# ─── 1단계: Builder ──────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# 루트 설정 파일 복사
COPY package.json package-lock.json nest-cli.json tsconfig.json ./

# 앱 레벨 설정 복사
COPY apps/auth/tsconfig.app.json apps/auth/tsconfig.app.json

# Builder 전용 의존성 설치
RUN npm ci

# 전체 소스 복사
COPY . .

# Auth 프로젝트만 빌드
RUN npx nest build auth

# ─── 2단계: Runtime ──────────────────────────────
FROM node:18-alpine
WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /usr/src/app/dist/apps/auth ./dist

EXPOSE ${AUTH_PORT}

CMD ["node", "dist/main.js"]
