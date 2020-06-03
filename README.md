# 차트연습장 앱 서버

기술적 투자자를 위한 놀이터, 차트연습장

웹 사이트 링크: [https://chartys.netlify.app](https://chartys.netlify.app/)

웹 프론트엔드 Repo: [https://github.com/dircosine/todays-stock-web](https://github.com/dircosine/todays-stock-web)

## 기술 스택

- Node
- Express
- Apollo GraphQL
- Prisma (ORM)
- PostgreSQL

---

## 셋업 및 구동

### 필요

- Node (v12)
- Yarn

### 의존성 모듈 install

  ```text
  yarn install
  ```

### Prisma 설정

1. `prisma/.env` 파일 생성 후, DB URL 정보 설정

   ```text
   // *** primsa/.env

   DATABASE_URL=postgres://...
   ```

2. DB table 생성

    ```text
    psql -h [호스트] -d [데이터베이스] -U [유저] -f schema.sql
    ```

3. Prisma 라이브러리 생성

    ```text
    npx prisma generate
    ```

### DB 스키마 변경 시

1. `schema.sql` 수정 후 `psql ~ schema.sql` 또는 직접 쿼리
2. prisma/schema.prisma 최신화

    ```text
    npx prisma introspect
    ```

3. Prisma 라이브러리 생성

    ```text
    npx prisma generate
    ```

Prisma 문서 참고: <https://www.prisma.io/docs/understand-prisma/introduction>

### 구동

  ```text
  yarn dev
  ```
