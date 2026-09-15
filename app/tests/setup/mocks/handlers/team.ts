import { http, HttpResponse } from 'msw';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100/api';

export const teamHandlers = [
  http.get(`${API}/team/members`, () =>
    HttpResponse.json({
      items: [
        { id: 'u_1', email: 'owner@example.com', name: 'Owner', role: 'owner' },
        { id: 'u_2', email: 'admin@example.com', name: 'Admin', role: 'admin' },
        { id: 'u_3', email: 'member@example.com', name: 'Member', role: 'member' },
      ],
    }),
  ),
  http.post(`${API}/team/invite`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; role?: string };
    if (!body.email || !body.role) {
      return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(body.email)) {
      return HttpResponse.json({ code: 'invalid_email' }, { status: 422 });
    }
    return HttpResponse.json({ id: 'inv_new', email: body.email, role: body.role }, { status: 201 });
  }),
  http.delete(`${API}/team/members/:id`, () => new HttpResponse(null, { status: 204 })),
];
