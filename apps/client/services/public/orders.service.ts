import { apiFetch } from "@/lib/api";
import { Order, OrdersResponse } from "@/types/order";

export const getMyOrders = async(page = 1, limit = 10): Promise<OrdersResponse> => {
    const orders = await apiFetch<OrdersResponse>(
      `/orders/my?page=${page}&limit=${limit}`,
      { cache: 'no-store' }
    );
    return orders;
};

export const getOrderById = async (id: string, email?: string): Promise<Order> => {
  const url = email
    ? `/orders/${id}?email=${encodeURIComponent(email)}`
    : `/orders/${id}`;
  return apiFetch<Order>(url, { cache: 'no-store' });
};
