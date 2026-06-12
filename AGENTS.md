# AGENTS.md

Behavioral guidelines for AI agents (Claude Code) working on this repository. Merge with task-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## Project Context

**Project:** PANGEA (MVP 0.3.0, 검증용)
**Stack:** Next.js 16, TypeScript, React, Supabase, Tailwind CSS v4
**Package Manager:** pnpm
**Version:** 0.3.0

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

**스타일링 규칙(토큰 우선순위·색상·타이포·예외)은 `CONVENTIONS.md` → Styling 섹션이 단일 출처.**

### 검토 트리거

코드 작성/수정 중 다음 패턴이 보이면 **멈추고** `styles/`에서 시맨틱 클래스/토큰이 있는지 확인:
- `text-xs|sm|base|lg|xl|2xl|3xl`
- `font-medium|semibold|bold` (CONVENTIONS.md 예외 1 외의 경우)
- `leading-*`, `tracking-*` (CONVENTIONS.md 예외 2 외의 경우)
- `text-gray-*`, `bg-white`, `text-black` 같은 원시 색상
- `#XXXXXX` 헥스
- `text-[...]`, `bg-[...]` 임의값 (CSS 변수는 v4 단축 문법으로)

없다고 판단되면 사용자에게 보고하고 결정 요청. **절대 새 토큰/클래스를 임의로 추가하지 말 것.**

## 6. shadcn/ui

`components/ui/*`는 shadcn/ui 라이브러리 코드이므로 직접 수정하지 말 것. 동작 변경이 필요하면 사용자에게 보고하고 wrapper 컴포넌트를 만드는 방향으로 제안.

## 7. Verification (필수)

**코드를 변경한 경우, 작업 완료 후 반드시 검증 게이트를 통과시킨다.** (문서/설정만 변경한 trivial한 경우는 판단에 맡김.)

- 코드 변경 후 다음을 실행하고 통과시킬 것:
  - `pnpm check` (Biome — **주의: `--write`라 파일을 자동 수정함. 변경된 내용 확인할 것**)
  - `pnpm test` (Vitest)
- 실패 시: 스스로 원인을 파악해 수정하고 다시 실행. 통과할 때까지 반복.
- 검증 없이 "완료"라고 보고하지 말 것.
- 통과 후 변경된 파일 목록과 주요 diff 요약, "왜 그렇게 했는지"를 보고할 것.

## 8. Database (Supabase)

**모든 테이블에 RLS(Row Level Security)가 적용되어 있다.** (`supabase/migrations/`)

- 기본 원칙: 사용자는 본인 데이터만 수정 가능. RLS 정책을 임의로 비활성화하지 말 것.
- 단, 정당한 경우 `security definer` 함수로 RLS를 우회하는 패턴이 이미 존재함
  (예: 매칭 자격 확인, 가입 트리거). 이런 패턴이 필요해 보이면 임의 판단 말고 사용자에게 보고.
- 새 테이블 추가 시 RLS 활성화 + 정책 정의를 함께 할 것.

### 네이밍 / 데이터 변환
- DB는 snake_case, 앱은 camelCase. 변환은 **`lib/mappers.ts`**가 전담(`mapTraceCard`, `mapComment`).
  DB 쿼리 결과를 mapper 없이 직접 사용하지 말 것 — 타입 불일치 발생.
- **주의 매핑:** DB `representative_sentence` → TS `meThought` (mapTraceCard 내). 한쪽만 바꾸지 말 것.
- `layers` 필드: JSONB 저장, 레거시(추후 제거 예정). 일부 컴포넌트가 아직 렌더링하므로
  당장 제거하지 말되, **새 기능에서 새로 의존하지 말 것**.
- TS 타입 패턴(`Tables<>`, `Awaited<ReturnType<...>>`)은 `CONVENTIONS.md` → TypeScript 섹션 참조.

### 마이그레이션
- 스키마 변경은 **dev(로컬/preview)에 먼저 적용·검증 후 prod에 적용**. 순서 역전 금지.
- 마이그레이션 후 `pnpm db:types --local`로 TS 타입 재생성.
- 환경: main=prod(prod Supabase) / develop·feature=preview(dev Supabase).

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, fewer hardcoded styles bypassing the design system, verification runs before "done" is reported, and clarifying questions come before implementation rather than after mistakes.