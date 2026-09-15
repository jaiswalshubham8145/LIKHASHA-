import { http, HttpResponse } from 'msw';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100/api';

export const notificationHandlers = [
  http.get(`${API}/notifications`, () =>
    HttpResponse.json({
      items: [
        { id: 'n_1', kind: 'info', title: 'Welcome to Lumen', read: false, createdAt: '2026-06-01T00:00:00Z' },
        { id: 'n_2', kind: 'warning', title: 'Trial ends in 3 days', read: true, createdAt: '2026-05-30T00:00:00Z' },
      ],
      unreadCount: 1,
    }),
  ),
  http.post(`${API}/notifications/:id/read`, ({ params }) =>
    HttpResponse.json({ id: params.id, read: true }),
  ),
  http.post(`${API}/notifications/read-all`, () => HttpResponse.json({ ok: true })),
];
