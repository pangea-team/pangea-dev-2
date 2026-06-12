# Coding Convention

`pangea`의 코딩 컨벤션 문서입니다. Biome로 자동화되지 않는, 팀 합의가 필요한 영역을 정리합니다.

## 자동 포매팅 / 린트

포매팅·import 정렬·`any`/non-null 같이 **기계적으로 판정 가능한 규칙은 `biome.json`이 단일 출처(source of truth)**이며, `pnpm check`(Biome `--write`)로 자동 적용됩니다. Husky `pre-commit` + `lint-staged`가 변경된 `*.{js,jsx,ts,tsx,json}` 파일에 `biome check --write`를 실행합니다.

→ 이 항목들은 **수동/AI 리뷰 대상이 아닙니다.** 구체 설정값은 문서에 복제하지 말고 `biome.json`을 직접 참조하세요. (수치를 문서에 옮겨두면 실제 설정과 어긋나 모순이 생깁니다.)

## 네이밍

| 대상 | 규칙 | 예시 |
| :--- | :--- | :--- |
| 컴포넌트 파일 | `PascalCase` | `UserProfile.tsx` |
| 컴포넌트 | `PascalCase` | `UserProfile` |
| 훅 파일 | `kebab-case` + `use-` 접두사 | `use-feed.ts` |
| 훅 함수 | `camelCase` + `use` 접두사 | `useGetFeedList` |
| 유틸 / lib 파일 | `kebab-case` | `query-client.ts` |
| 변수 / 함수 | `camelCase` | `getUserData` |
| 상수 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| 타입 | `PascalCase` | `type User = { ... }` |
| Boolean | `is`, `has`, `should` 접두사 | `isLoading`, `hasError` |
| 이벤트 핸들러 (내부) | `handle*` | `handleClick` |
| 이벤트 핸들러 (props) | `on*` | `onClick`, `onSubmit` |

> 타입 선언은 `type`으로 통일합니다. (`interface` 사용 지양)

## 폴더 구조

```text
pangea/
├── app/                         # Next.js App Router
│   └── (route)/                 # 라우트 세그먼트별
│       ├── page.tsx
│       ├── layout.tsx
│       ├── _components/         # 해당 라우트(트리) 전용 컴포넌트
│       ├── _hooks/              # 해당 라우트 전용 훅 (필요 시)
│       ├── _lib/                # 해당 라우트 전용 목업·토큰 등 (필요 시)
│       └── ...                  # loading, error, route handlers 등
├── components/                  # 여러 라우트에서 쓰는 공통 UI
├── hooks/                       # 공통 훅
├── lib/                         # 유틸 & 외부 클라이언트
├── types/                       # 공통 타입
└── public/                      # 정적 파일
```

- 라우트별 화면 조립은 `app/.../page.tsx` 등에서 하고, 그 페이지 전용 UI는 같은 세그먼트의 `_components/`에 둔다.
- 여러 라우트에서 재사용되는 조각만 루트의 `components/`, `hooks/`, `lib/`로 올린다.
- import 경로는 `@/` absolute path 사용.
- import 순서는 Biome가 자동 정렬.

## TypeScript

- `any` 사용 금지 — 불가피할 경우 `unknown`으로 받고 narrowing.
- 함수 파라미터가 3개 이상이면 객체로 받기.
- 컴포넌트 props는 `Props` 타입으로 통일.
- `as` 타입 단언은 최소화하고, 사용 시 사유를 주석으로 명시.

```ts
type Props = {
  title: string
  onClick: () => void
}

export default function Button({ title, onClick }: Props) {
  // ...
}
```

- **DB 관련 타입은 `lib/supabase/database.types.ts`의 자동 생성 타입에서 파생** — 손으로 row 타입 작성 금지. `Tables<'테이블명'>` 헬퍼 또는 `Awaited<ReturnType<typeof 쿼리함수>>[number]` 패턴 사용. 스키마 변경 시 `pnpm db:types` 실행.

## React / Next.js

- **Server Component 우선** — 필요할 때만 `'use client'` 선언.
- `'use client'` 지시어는 파일 최상단에 명시.
- 데이터 페칭은 Server Component에서 처리.
- 클라이언트 mutation 및 캐싱이 필요한 경우 TanStack Query 사용.
- 한 파일에 하나의 컴포넌트, `export default` 통일.
- `next/image`에서 `public` 이미지 사용 시 문자열 경로 대신 정적 import 사용.
- 라우트 경로는 하드코딩하지 않고 `lib/constants/path.ts`의 `PATH` 상수를 사용. 동적 경로는 `PATH.FEED_USER(userId)`처럼 함수 형태로 호출.

### 상태 · 렌더링 품질

> 판단이 필요한 영역만 다룬다. Biome가 잡는 것(`useExhaustiveDependencies`, `noArrayIndexKey` 등)과 위 네이밍 표(boolean `is/has`, 핸들러 `on*`)는 여기서 반복하지 않는다.

**상태(State)**
- 계산으로 얻을 수 있는 값은 state로 두지 않는다 — 렌더 중 파생(derived)으로 계산한다.
- `useState` + `useEffect`로 다른 state를 동기화하는 패턴이 보이면, 파생 계산으로 대체 가능한지 먼저 검토한다.
- state는 최소 단위만. 중복·추론 가능한 state는 두지 않는다.
- 상태의 위치를 점검한다: 이 컴포넌트 소유가 맞는가? 끌어올리거나 서버 상태(TanStack Query)로 둘 것은 아닌가?

**렌더링**
- 값이 안 변하는데 리렌더되는 컴포넌트, 부모 리렌더가 자식에 불필요하게 전파되는 구조를 점검한다.
- `useMemo` / `useCallback` / `React.memo`는 비용이 입증된 곳에만 쓴다. 기본값처럼 두르지 않는다.
  - 현재 React Compiler 미사용(`reactCompiler` 미설정 + `babel-plugin-react-compiler` 미설치). 향후 도입 시 이 규칙을 "수동 메모는 원칙적으로 쓰지 않고 컴파일러에 맡긴다"로 교체할 것.

**useEffect**
- effect는 단일 책임을 갖는다. effect 안에서 state를 여러 번 set해 추가 렌더를 만들지 않는다.
- "이 effect가 꼭 필요한가?"를 먼저 묻는다 — 이벤트 핸들러나 파생 계산으로 대체 가능한 effect가 가장 흔한 안티패턴이다.

**책임 분리 (SRP · 응집도)**
- 컴포넌트/함수가 단일 책임을 갖는지 본다. 로직 과다도, 과한 분리(오버엔지니어링)도 지양한다.
- 명령형 흐름을 선언형으로 바꿀 수 있으면 그쪽을 택한다.

## Styling (Tailwind CSS)

**시맨틱 토큰을 우선 사용. Tailwind 원시 유틸리티 직접 사용은 시맨틱 클래스가 없을 때의 최후 수단.**

### 디자인 시스템 위치

- `styles/` 디렉토리 (색상 토큰, 타이포 클래스 정의)
- CSS 변수는 `:root`에 정의되어 있고, `@theme inline`으로 Tailwind에 노출됨

### 타이포그래피

**우선순위:**
1. 시맨틱 클래스 우선: `.text-heading-{xs,sm,md,lg,xl}`, `.text-body-{sm,md,lg}`, `.text-quote`, `.text-caption` 등
2. 시맨틱 클래스가 없으면 CSS 변수 참조 (Tailwind v4 단축 문법): `text-(--text-base)`
3. 그래도 없으면 사용자에게 보고하고 결정

**금지:**
- `text-lg`, `text-sm`, `font-medium`, `leading-relaxed`, `tracking-wider` 등 Tailwind 원시 타이포 유틸리티를 시맨틱 클래스 없이 단독 사용
- `[font-size:var(--text-base)]` 같은 v3 임의값 문법 (반드시 v4 단축 문법 `text-(--text-base)` 사용)
- 시맨틱 클래스나 타이포 토큰을 임의로 추가

### 색상

**우선순위:**
1. 시맨틱 토큰: `bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `text-primary` 등
2. PANGEA 커스텀 변수: `text-(--color-text-tertiary)` 등
3. semantic 토큰: `text-(--color-success)`, `text-(--color-info)` 등
4. 그 외엔 사용자에게 보고

**금지:**
- 헥스 색상 직접 사용 (`#FAFAFA`, `text-[#999]`)
- Tailwind 기본 컬러 직접 사용 (`text-gray-500`, `bg-rose-500`, `text-blue-600`)
- 색상 토큰을 임의로 추가

### Border / Radius / Spacing

- Radius는 `rounded-{sm,md,lg,xl,2xl}` 등 토큰 사이즈 사용 (`--radius` 기반)
- Border는 `border border-border` 형태로 토큰 색 사용
- 한 화면에서 일관된 spacing 단계 유지

### 허용되는 예외

1. **시맨틱 클래스 내부 인라인 강조 (weight-only)** — 부모가 시맨틱 클래스(예: `text-body-sm`)일 때, 그 안의 일부 단어를 `<span className="font-semibold">`처럼 weight만 강조. 다른 size/leading 유틸리티는 함께 쓰지 말 것.
2. **장식적 letter-spacing** — 섹션 라벨(`text-caption` + `uppercase` + `tracking-wider`) 패턴에서 `tracking-*` 허용. 같은 의미 라벨에서 혼용 금지 (현재 컨벤션: `tracking-wider`).
3. **컴포넌트 내부 사이징 (AvatarFallback 등)** — 컴포넌트 크기에 종속된 텍스트는 별개 취급 가능. 다만 CSS 변수 참조(`text-(--text-2xl)`)를 우선 시도.

위 3가지 외에는 모두 시맨틱 클래스 또는 CSS 변수 참조로 마이그레이션.

### 새 토큰/클래스 추가

디자인 시스템에 없는 스타일이 필요하면 컴포넌트에서 즉흥적으로 만들지 말고, 사용자에게 보고하여 `styles/` 정의 파일에 추가하는 별도 작업으로 분리.

### `cn()` 사용

**다음 두 경우에만 사용:**
- 외부 `className` prop 머지: `cn('base', className)`
- 2개 이상의 조건부 클래스: `cn('base', isActive && 'border-primary')`

그 외엔 일반 문자열 또는 템플릿 리터럴 사용:
- ❌ `cn('mt-4 text-primary')` → ✅ `"mt-4 text-primary"`
- ❌ `cn(baseStyles, 'mt-4')` → ✅ 템플릿 리터럴 사용

### 기타

- 토큰에 없는 값만 임의값(`w-[327px]`) 사용.
- 인라인 스타일(`style={{}}`) 사용 지양.
- 클래스 정렬은 `biome.json` 설정 확인.
