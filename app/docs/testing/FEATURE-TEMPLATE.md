// Per-feature output format
// This is the template used by every feature PR description and test report.

# Feature: <Name>

## 1. Test Strategy
- **Risk**: P0 / P1 / P2
- **Scope**: surfaces covered
- **Approach**: unit + integration + e2e + visual

## 2. Test Cases

### Unit
- [ ] Renders default state
- [ ] Handles all prop variants
- [ ] Handles edge cases (empty, overflow, RTL)

### Integration
- [ ] Loads data from API
- [ ] Handles loading / error / empty
- [ ] Optimistic updates + rollback

### E2E
- [ ] Happy path
- [ ] Validation errors
- [ ] Server errors
- [ ] Offline / slow network

## 3. Manual Test Plan
- [ ] Verify on Chrome / Firefox / Safari / Edge
- [ ] Verify on iPhone SE / iPad / 1280 / 1920
- [ ] NVDA walkthrough
- [ ] VoiceOver walkthrough
- [ ] Keyboard-only walkthrough

## 4. Automated Tests
- `tests/unit/...`
- `tests/integration/...`
- `tests/e2e/...`

## 5. Accessibility Tests
- axe-core per render
- Focus management
- ARIA correctness
- Reduced motion

## 6. Visual Regression
- Light / Dark / High-contrast
- 3 viewports
- 3 locales

## 7. Performance Tests
- LCP, CLS, INP within budget
- Bundle delta within budget

## 8. Security Tests
- Input sanitization
- XSS / open redirect
- AuthZ on every action
- PII redaction

## 9. Reliability Tests
- Network failure
- Timeout
- Retry
- Offline queue

## 10. CI/CD Integration
- Lint, typecheck, test, lighthouse, security
- Required status checks

## 11. Quality Metrics
- Coverage delta
- New a11y violations: 0
- Lighthouse delta

## 12. Release Criteria
- All gates pass
- Manual sign-off from QA + UX + Accessibility
