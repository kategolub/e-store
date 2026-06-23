import { apiFetch } from "@/lib/api";
import { Order, OrderPayload, OrdersResponse } from "@/types/order";

export const getMyOrders = async(page = 1, limit = 10): Promise<OrdersResponse> => {
    return apiFetch<OrdersResponse>(
      `/orders/my?page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
};

export const getOrderById = async (id: string, email?: string): Promise<Order> => {
  const url = email
    ? `/orders/${id}?email=${encodeURIComponent(email)}`
    : `/orders/${id}`;
  return apiFetch<Order>(url, { cache: 'no-store' });
};

export const createOrder = async (payload: OrderPayload): Promise<Order> => {
  return apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
