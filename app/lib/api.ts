import { message } from "antd";
// api.ts

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
  // 如果有其他默认请求头，在此处添加
};

const handleRequestError = async (response: Response) => {
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(errorMessage || '请求失败，请稍后重试');
  }
  const res = await response.json();
  if (res?.code !== 0) {
    message.error(res?.message);
  }
  return res;
};

const request = async (
  url: string,
  data: Record<string, any> = {},
  method: string = 'POST',
  customHeaders: Record<string, string> = {}
) => {
  const headers: Record<string, string> = {
    ...DEFAULT_HEADERS,
    ...customHeaders
  };

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (method.toUpperCase() !== 'GET') {
    requestOptions.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, requestOptions);
    return await handleRequestError(response);
  } catch (error: any) {
    throw new Error(error.message || '网络请求异常，请稍后重试');
  }
};

export default request;