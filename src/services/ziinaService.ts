// src/services/ziinaService.ts
// Service to handle refund requests via Ziina API

export async function requestZiinaRefund({
  id,
  payment_intent_id,
  amount,
  currency_code,
  token,
  test = true
}: {
  id: string;
  payment_intent_id: string;
  amount: number;
  currency_code: string;
  token: string;
  test?: boolean;
}) {
  const url = 'https://api-v2.ziina.com/api/refund';
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, payment_intent_id, amount, currency_code, test }),
  };
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Ziina refund failed');
    return data;
  } catch (error) {
    throw error;
  }
}
