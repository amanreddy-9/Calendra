# Product decisions

## Collaboration

- Any authenticated classmate can create an event.
- Every event must carry an information status.
- Event details show its creator, credentials, creation time, last update, and history.
- Any classmate can update an event; the update history attributes each change.

## Date changes

An update moves the same event rather than creating a duplicate. For example, changing a quiz from August 5 to August 10 removes it from August 5 and adds a history entry identifying the old and new dates.

## Information statuses

| Key | Meaning |
| --- | --- |
| `tentative` | Discussed with Faculty — Tentative |
| `approved` | Approved by Faculty |
| `final` | Finalized — No Changes |
| `unverified` | Student-reported — Unverified |
