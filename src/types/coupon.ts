
export interface Coupon {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_purchase_amount: number;
  max_uses?: number;
  used_count: number;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}
