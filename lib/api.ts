import { time } from "console";
import { ApiError } from "../types/error";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

async function parseResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get('content-type');
  const isJson = contentType?.includes('application/json');

  if (!res.ok) {
    if (isJson) {
      const error: ApiError = await res.json().catch(() => ({
        message: 'Something went wrong',
        statusCode: res.status,
      }));

      throw error;
    }
    throw {
      message: res.statusText || 'Something went wrong',
      statusCode: res.status,
    } as ApiError;
  }

  if (res.status === 204 || !isJson) return null as unknown as T;
  return res.json();
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit & { next?: NextFetchRequestConfig } = {}
): Promise<T> {
    const controller = new AbortController();
    const timerId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
        signal: options.signal || controller.signal,
      });

      return await parseResponse<T>(res);
    } catch (error) {
      if ((error as ApiError).statusCode !== undefined) throw error;
      if ((error as Error).name === 'AbortError') {
        throw {
          message: 'Request timed out. Please try again.',
          statusCode: 408,
        } as ApiError;
      }

      throw {
        message: 'Unable to reach the server. Check your connection.',
        statusCode: 0,
      } as ApiError;
    } finally {
      clearTimeout(timerId);
    } 
}