# REST API and data flow

All endpoints use the same origin as the client. Responses are JSON. The API sets an HTTP-only `vms_demo` cookie to isolate each browser walkthrough. Send `X-Demo-Role: driver` or `mechanic` on mutations. This header demonstrates role-specific logic and is not authentication.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Health, storage mode, demo flag |
| GET | `/api/services` | Service catalog |
| GET | `/api/jobs` | This browser's requests and history |
| POST | `/api/jobs` | Driver creates a request |
| PATCH | `/api/jobs/:id/quote` | Mechanic quotes labor and parts |
| PATCH | `/api/jobs/:id/accept` | Driver approves quote |
| PATCH | `/api/jobs/:id/arrive` | Mechanic marks arrival |
| PATCH | `/api/jobs/:id/start` | Mechanic starts work |
| PATCH | `/api/jobs/:id/finish` | Mechanic finishes work |
| PATCH | `/api/jobs/:id/complete` | Driver confirms, rates, and simulates payment |
| PATCH | `/api/jobs/:id/cancel` | Driver cancels before acceptance |

Create body: `serviceId`, `mode` (roadside/home), `location`, `vehicle`, `issue`.

Every PATCH body includes the current integer `version`. Quote additionally requires numeric `labor` and `parts` in dollars. Complete requires `confirmed: true` and an integer `rating` from 1 to 5.

```text
requested → quoted → enroute → arrived → working → done → completed
    └────────┴──────→ canceled (driver, before acceptance only)
```

The server computes prices in cents and ignores client-supplied totals. Travel is a demo distance multiplied by $5/mile. Updates use a version comparison so stale requests cannot overwrite a newer job state.

Error codes: 400 invalid input; 403 wrong demo role; 404 request absent or belongs to another browser; 409 stale version or invalid transition; 415 unsupported content type; 500 unexpected server failure.

MongoDB stores a Job document per request. The memory adapter provides the same methods for a no-database demonstration. Neither mode makes the illustrative map or payments real.
