interface TResponse {
  message: string;
  status: number;
  data: object;
  success: boolean;
  error: boolean;
  notFound: boolean;
}

export { TResponse };
