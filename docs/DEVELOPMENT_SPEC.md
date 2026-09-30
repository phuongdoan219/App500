# English in Wonderland — Development Specification

Version: 1.0  
Baseline: production build after referral update (`85e1634`)  
Product type: responsive web application for English learning through maps, lessons, review, rewards, companions, assessment, and paid access.

## 1. Product objective

The product guides a student from onboarding to an assigned CEFR journey, through four lessons per Unit, review and reward loops, level assessment, companion collection, and optional paid unlocking. Parents own authentication and payment decisions; students consume the learning experience.

## 2. Users and roles

| Role | Main needs | Current prototype behavior |
| --- | --- | --- |
| Student | Learn, review, collect rewards, care for companions | Stored locally in the browser |
| Parent/guardian | Sign in, choose plan, confirm payment | Demonstration only; no real login or transaction |
| Content/admin | Maintain curriculum and learning content | Curriculum availability is checked through `/api/curriculum` |

## 3. Core journeys

### 3.1 Onboarding and account

1. Login or Google demo login.
2. Forgot-password information screen.
3. Enter student name and grade.
4. Assign the matching CEFR world.
5. Meet and name the starter companion.
6. Explain the four key fragments earned across four lessons.
7. Explain the Learn → Review → Care loop.
8. Enter the assigned learning map.

Grade-to-level assignment:

| Grades | Level | World | Planned Units |
| --- | --- | --- | ---: |
| 1–3 | Pre A1 | Học viện Ánh Sao | 20 |
| 4–5 | A1 | Rừng Thì Thầm | 27 |
| 6–7 | Pre A2 | Vương quốc Núi Pha Lê | 22 |
| 8–9 | A2 | Thành phố Phiêu Lưu | 30 |

### 3.2 Learning loop

Each Unit contains four lessons:

1. Khám phá — video/context discovery.
2. Hiểu sâu — vocabulary and sentence understanding.
3. Nghe · Viết — listening and written practice.
4. Lồng tiếng — guided camera/microphone activity.

After completing all four lessons, the student opens a Unit reward bag. Completed Units expose a review station that awards care coins. The first eligible review of the day awards 5 coins; subsequent eligible reviews award 3 coins.

### 3.3 Trial and access

- The first two Units are free.
- Paid access is required for later Units.
- Available offers:
  - Next 5 Units: 59,000 VND.
  - One complete Level/Map: 229,000 VND.
  - Four Maps / 99 Units: 799,000 VND.
- Previous purchases should be credited when upgrading to a larger package.
- Checkout is a prototype and must not create a real transaction until a payment backend is implemented.

### 3.4 Referral

- Entry points:
  - Persistent “Mời bạn bè” button at the bottom-right of the application.
  - Zero-cost option in the pricing screen.
- Modal contents:
  - Personal referral code.
  - Referral link.
  - Copy-link action.
  - Native share action with clipboard fallback.
- Reward rule: when a new referred user completes Lesson 1 · Unit 1, the inviter receives the next Unit free.
- Current demo code is `EW-BANMOI`; production must generate an account-specific code and validate attribution server-side.

## 4. Screen inventory

### Access and onboarding

- Login
- Forgot password
- Student profile and grade
- Assigned-world introduction
- Companion introduction and naming
- Key-fragment mechanism
- Learn–Review–Care loop

### Learning

- Journey selection
- Interactive roadmap
- Lesson review gate
- Lesson video/discovery
- Question/activity screens
- Vocabulary and structured practice
- Voice lab: initial, countdown, recording, review
- Lesson completion popup
- Unit reward bag
- Unit review station and review completion

### Completion and supporting screens

- Trial completion popup
- Pricing
- Referral modal
- Checkout
- Unlock success
- Student competency profile
- Learning notebook
- Companion garden
- Final level assessment
- Assessment result
- Companion reward chest

## 5. State model

Prototype state is held in React and persisted using `localStorage`.

| Key | Purpose |
| --- | --- |
| `english-in-wonderland-journey-progress` | Lesson progress by journey and Unit |
| `english-in-wonderland-demo-coins` | Care coin balance |
| `english-in-wonderland-demo-companion-items` | Owned companion items |
| `english-in-wonderland-demo-companion` | Active companion |
| `english-in-wonderland-wolf-name` | Starter companion name |
| `english-in-wonderland-student-name` | Student display name |
| `english-in-wonderland-companion-collection` | Unlocked companions |
| `english-in-wonderland-claimed-units` | Claimed Unit reward bags |
| `english-in-wonderland-access-plan` | Chosen access package |
| `english-in-wonderland-map-review-claims` | Daily review rewards |

Production must replace browser-only persistence with authenticated server records while retaining optimistic client feedback.

## 6. Functional requirements

### Authentication

- Parent login supports email/phone and password.
- Forgot password sends a time-limited recovery link.
- Social login may be added after account-linking rules are defined.

### Curriculum and progress

- Curriculum content is versioned and addressable by level, Unit, lesson, and activity.
- Progress writes are idempotent.
- Unlock calculation is performed server-side.
- A student can revisit completed lessons and review stations.

### Rewards and companions

- Unit and level rewards can be claimed once.
- Coin earning and spending are server-authoritative and auditable.
- Companion inventory, active companion, food, toys, skins, and care actions persist per student.

### Commerce

- Price, package scope, prior-purchase credit, and entitlement must be server-calculated.
- Payment completion is accepted only from verified provider webhooks.
- The UI must distinguish pending, successful, failed, and refunded orders.

### Referral

- Each inviter receives a unique, non-guessable referral identifier.
- Referral attribution is recorded on the referred account before the qualifying event.
- Self-referral, duplicate accounts, repeated rewards, and refunded/invalid users are rejected.
- Reward issuance is idempotent and auditable.
- Both inviter and referred user should see referral status.

## 7. Suggested production data model

- `users`: parent identity and contact state.
- `students`: parent relationship, grade, assigned journey, display name.
- `journeys`, `units`, `lessons`, `activities`: versioned curriculum hierarchy.
- `student_progress`: activity/lesson completion and timestamps.
- `entitlements`: granted Unit/Map/all-map access and source.
- `orders`, `payments`, `order_credits`: checkout and upgrade accounting.
- `referral_codes`, `referrals`, `referral_rewards`: attribution, qualification, and reward ledger.
- `wallet_transactions`: immutable care-coin ledger.
- `companions`, `student_companions`, `inventory_items`: collection and customization.
- `assessments`, `assessment_attempts`: level completion evidence.

## 8. API contract outline

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Parent login |
| `POST` | `/api/auth/forgot-password` | Request recovery link |
| `GET` | `/api/students/:id/journey` | Assigned journey and progress |
| `POST` | `/api/progress` | Idempotent lesson/activity completion |
| `POST` | `/api/reviews/:unitId/complete` | Validate review and award coins |
| `GET` | `/api/plans` | Current packages and prices |
| `POST` | `/api/orders` | Create checkout order |
| `POST` | `/api/payments/webhook` | Verify provider event and grant entitlement |
| `GET` | `/api/referrals/me` | Personal referral link and status |
| `POST` | `/api/referrals/attribute` | Attribute a referred signup |
| `POST` | `/api/referrals/qualify` | Internal/idempotent qualification event |

## 9. Non-functional requirements

- Responsive at 390 px mobile width and common laptop widths from 1280 px upward.
- Keyboard-operable controls with visible focus and descriptive accessible names.
- No horizontal overflow at supported breakpoints.
- Largest visible images use optimized delivery in server deployments; static export uses unoptimized local assets.
- Progress and commerce writes must survive retries without duplicate rewards or charges.
- Sensitive parent and payment data must never be stored in `localStorage`.
- Vietnamese is the default language; content strings should be externalized before multilingual rollout.

## 10. Acceptance criteria for the referral feature

1. Both entry points open the same referral modal.
2. The pricing entry is rendered as a full-width bordered card, not unstyled inline text.
3. Copying the link shows success feedback.
4. Sharing uses the device share sheet when available and falls back to copying.
5. The mobile modal fits within the viewport and scrolls internally if required.
6. A qualifying referred account grants exactly one Unit to the inviter.
7. Replaying the qualification event does not grant another Unit.
8. The production build contains the referral CSS bundle.

## 11. Development phases

### Phase 1 — Foundation

- Introduce authentication, database schema, migrations, and environment management.
- Replace local-only student/profile state with APIs.
- Preserve the current UI and interaction contracts.

### Phase 2 — Curriculum and progress

- Build the curriculum CMS/import pipeline.
- Store activity attempts and lesson completion.
- Implement server-side unlock and review rules.

### Phase 3 — Commerce

- Implement plans, upgrade credit, checkout, webhooks, entitlements, refunds, and admin reconciliation.

### Phase 4 — Referral and rewards

- Implement unique links, attribution, qualification, fraud controls, ledgers, and customer-visible status.

### Phase 5 — Production readiness

- Add analytics, monitoring, error reporting, accessibility QA, cross-device testing, data retention, and operational dashboards.

## 12. Delivery and build

- Framework: Next.js 16 App Router, React 19, TypeScript.
- Standard production build: `npm run build`.
- Static HTML/CSS/JS export: `npm run export:static`.
- Static files are generated into `out/`.
- The static package cannot provide server-only behavior. `/api/curriculum`, authentication, payments, referral attribution, and persistent rewards require deployed backend services.
