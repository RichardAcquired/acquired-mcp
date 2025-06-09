import { z } from 'zod';
import { getApiUrl } from '../config/index.js';

export interface RequestDetails {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public responseBody: string,
    public requestDetails?: RequestDetails
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export async function makeApiRequest<T>(
  endpoint: string,
  options: {
    method: string;
    headers?: Record<string, string>;
    body?: unknown;
    schema: z.ZodType<T>;
  }
): Promise<ApiResponse<T>> {
  const { method, headers = {}, body, schema } = options;
  const url = getApiUrl(endpoint);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      data = text;
    }
    // Log the raw response body for debugging
    console.error('Raw HTTP response body:', data);

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status,
        text,
        {
          url,
          method,
          headers: { 'Content-Type': 'application/json', ...headers },
          body,
        }
      );
    }

    const validatedData = schema.parse(data);

    return {
      data: validatedData,
      status: response.status,
      headers: response.headers,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      console.error(`API Error: ${error.message}`, {
        statusCode: error.statusCode,
        responseBody: error.responseBody,
        requestDetails: error.requestDetails,
      });
    } else if (error instanceof z.ZodError) {
      console.error(`Validation error: ${error.message}`);
    } else {
      console.error(`Unexpected error: ${error}`);
    }
    throw error;
  }
} 