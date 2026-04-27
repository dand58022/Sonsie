# [Project or Feature Name] Implementation Plan

**Date:** YYYY-MM-DD HH:MM [Timezone]
**Audience:** Project team
**Status:** Planned
**Scope:** [Brief description of what this plan covers]
**Implementation:** `[Primary files, folders, or modules this plan expects to create or modify]`

---

## Overview

[Summarize the goal, intended user experience, important constraints, and what this plan intentionally does not cover yet.]

---

## Repo Architecture Summary

Current repo:

```
[repo-name]/
|-- README.md
`-- [existing files and folders relevant to this plan]
```

Recommended target architecture:

```
[repo-name]/
|-- [planned file or folder]
|-- [planned file or folder]
`-- [planned file or folder]
```

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| [Decision area] | [Selected approach] | [Why this is the right choice] |
| [Decision area] | [Selected approach] | [Why this is the right choice] |

---

## Recommended Folder Structure

```
[folder]/
|-- [file-or-folder]
|-- [file-or-folder]
`-- [file-or-folder]
```

---

## Recommended Component or Module Hierarchy

```
[TopLevelComponentOrModule]
|-- [ChildComponentOrModule]
|-- [ChildComponentOrModule]
`-- [ChildComponentOrModule]
```

---

## Data Models and Entities

### [Entity Group]

```ts
type ExampleEntity = {
  id: string;
  name: string;
  createdAt: string;
};
```

---

## State Management Recommendation

[Describe what state should live in the URL, server/database, local component state, shared client store, or external service. Explain what should not be added yet.]

---

## Routing and Page Plan

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/example` | [What this page does] | [Mock, server, database, API] |

---

## Mock First vs Build Later

Unless the project maintainers explicitly request otherwise, all website data input/output remains mocked for each iteration. Store mock data in centralized lists, typed fixture modules, JSON-like fixture structures, or `.txt` sample data files for testing. Do not hardcode data directly in route pages or UI components because the final data flow may not be set yet.

### Mock First

| Area | Mock Behavior |
|------|---------------|
| [Feature area] | [What should be mocked first] |

### Build Later

| Area | Real Implementation |
|------|---------------------|
| [Feature area] | [What should be implemented later] |

---

## Data Flow

1. [First important user or system step]
2. [Second important user or system step]
3. [Third important user or system step]

---

## API, Actions, or Integration Points

```
[METHOD] /[path]
  Body: { [request shape] }
  Response: { [response shape] }
```

---

## Testing Plan

| Layer | Tool | First Tests |
|-------|------|-------------|
| Unit | [Tool] | [Specific unit tests] |
| Component | [Tool] | [Specific component tests] |
| E2E | [Tool] | [Specific user-flow tests] |

Verification commands:

```
[test command]
[lint command]
[build command]
```

---

## Risks and Unclear Areas

| Risk | Why It Matters | Mitigation |
|------|----------------|------------|
| [Risk] | [Impact] | [Mitigation or question to resolve] |

---

## Phased Build Order

### Phase 1: [Phase Name]

[Short description of this phase.]

Deliverables:

- `[file-or-folder]`
- `[file-or-folder]`

### Phase 2: [Phase Name]

[Short description of this phase.]

Deliverables:

- `[file-or-folder]`
- `[file-or-folder]`

---

## Extension Points

| Component | Future Enhancement |
|-----------|-------------------|
| `[component-or-module]` | [Future enhancement] |

---

*Plan drafted: YYYY-MM-DD HH:MM [Timezone] for the project team*
