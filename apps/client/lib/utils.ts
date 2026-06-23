import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "@/types/order";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ORDER_STATUS_CLASSES: Record<OrderStatus, string> = {
  delivered: 'text-green-600',
  shipped: 'text-blue-600',
  processing: 'text-yellow-600',
  pending: 'text-zinc-600',
};

export function getOrderStatusClass(status: OrderStatus): string {
  return ORDER_STATUS_CLASSES[status] ?? 'text-zinc-600';
}
