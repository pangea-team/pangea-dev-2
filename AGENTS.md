# AGENTS.md

Behavioral guidelines for all AI agents (Claude Code, Cursor, etc.) working on this repository. Merge with task-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## Project Context

**Project:** PANGEA (2차 MVP, 검증용)
**Stack:** Next.js 16, TypeScript, React, Supabase, Tailwind CSS v4
**Package Manager:** pnpm
**Version:** 0.2.0-beta

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Design System (필수)

**스타일링 시 반드시 디자인 시스템의 시맨틱 토큰과 클래스를 우선 사용한다. Tailwind 원시 유틸리티 직접 사용은 시맨틱 클래스가 없을 때의 최후 수단이다.**

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

다음 경우는 Tailwind 원시 유틸리티를 시맨틱 클래스 없이 사용 가능:

1. **시맨틱 클래스 내부의 인라인 강조 (weight-only)**
   - 부모가 시맨틱 클래스(예: `text-body-sm`)일 때, 그 안의 일부 단어/구를 `<span className="font-semibold">`처럼 weight만 강조하는 것은 허용
   - 단, 다른 size/leading 유틸리티는 함께 쓰지 말 것
   - 이유: 시맨틱 클래스로 교체 시 size까지 바뀌어 의도가 깨짐

2. **장식적 letter-spacing (tracking-*)**
   - 섹션 라벨(`text-caption` + `uppercase` + `tracking-wider`) 같은 패턴에서 `tracking-*` 유지 허용
   - 단, 같은 의미의 라벨이라면 `tracking-wider`/`tracking-widest` 등이 혼용되지 않도록 한 값으로 통일할 것 (현재 컨벤션: `tracking-wider`)

3. **컴포넌트 내부 사이징 (AvatarFallback 등)**
   - 컴포넌트 자체 크기에 종속되는 텍스트(아바타 이니셜 등)는 본문 타이포 시맨틱 시스템과 별개로 취급 가능
   - 다만 CSS 변수 참조(`text-(--text-2xl)` 등)를 우선 시도할 것

위 3가지 외에는 모두 시맨틱 클래스 또는 CSS 변수 참조로 마이그레이션할 것.

### 검토 트리거

코드 작성/수정 중 다음 패턴이 보이면 **멈추고** 시맨틱 클래스/토큰이 있는지 확인:
- `text-xs|sm|base|lg|xl|2xl|3xl`
- `font-medium|semibold|bold` (위 예외 1 외의 경우)
- `leading-*`, `tracking-*` (위 예외 2 외의 경우)
- `text-gray-*`, `bg-white`, `text-black` 같은 원시 색상
- `#XXXXXX` 헥스
- `text-[...]`, `bg-[...]` 임의값 (CSS 변수는 v4 단축 문법으로)

매칭되는 게 없다고 판단되면:
1. 디자인 시스템 정의 파일을 한 번 더 확인
2. 그래도 없으면 사용자에게 보고하고 결정 요청 (절대 새 토큰/클래스를 임의로 추가하지 말 것)

### 새 토큰/클래스 추가는 별도 작업

디자인 시스템에 없는 스타일이 필요하다 판단되면:
- 컴포넌트에서 즉흥적으로 만들지 말 것
- 사용자에게 보고하고, 디자인 시스템 정의 파일에 토큰/클래스를 추가하는 별도 작업으로 분리

## 6. shadcn/ui

`components/ui/*`는 shadcn/ui 라이브러리 코드이므로 직접 수정하지 말 것. 동작 변경이 필요하면 사용자에게 보고하고 wrapper 컴포넌트를 만드는 방향으로 제안.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, fewer hardcoded styles bypassing the design system, and clarifying questions come before implementation rather than after mistakes.
