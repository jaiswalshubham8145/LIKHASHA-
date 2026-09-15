import { http, HttpResponse } from 'msw';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100/api';

const dashboard = {
  id: 'd_1',
  name: 'Revenue Overview',
  widgets: [
    { id: 'w_1', type: 'kpi', label: 'MRR', value: 124_500, delta: 0.12 },
    { id: 'w_2', type: 'line', label: 'Active users', value: 8421, delta: 0.04 },
  ],
  updatedAt: '2026-06-01T12:00:00Z',
};

export const dashboardHandlers = [
  http.get(`${API}/dashboards`, () =>
    HttpResponse.json({
      items: [dashboard, { ...dashboard, id: 'd_2', name: 'Churn' }],
      nextCursor: null,
    }),
  ),
  http.get(`${API}/dashboards/:id`, ({ params }) =>
    HttpResponse.json({ ...dashboard, id: params.id }),
  ),
  http.post(`${API}/dashboards`, async ({ request }) => {
    const body = (await request.json()) as { name?: string };
    if (!body.name) return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    return HttpResponse.json({ ...dashboard, name: body.name, id: 'd_new' }, { status: 201 });
  }),
  http.delete(`${API}/dashboards/:id`, () => new HttpResponse(null, { status: 204 })),
];
