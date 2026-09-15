import { http, HttpResponse } from 'msw';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100/api';

export const billingHandlers = [
  http.get(`${API}/billing/plans`, () =>
    HttpResponse.json({
      plans: [
        { id: 'free', name: 'Free', price: 0, features: ['1 dashboard', '1k events/mo'] },
        { id: 'pro', name: 'Pro', price: 49, features: ['Unlimited dashboards', '100k events/mo'] },
        { id: 'enterprise', name: 'Enterprise', price: null, features: ['Custom'] },
      ],
    }),
  ),
  http.post(`${API}/billing/checkout`, async ({ request }) => {
    const body = (await request.json()) as { planId?: string };
    if (!body.planId) return HttpResponse.json({ code: 'invalid_input' }, { status: 400 });
    return HttpResponse.json({ checkoutUrl: 'https://stripe.test/c/sess_test' });
  }),
];
