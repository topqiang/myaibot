const BASE_URL = 'https://qianfan.baidubce.com';

// 封装通用的fetch函数
async function fetchWrapper<T extends {app_id?: string}>(endpoint: string, data?: T, options = {headers:{}, method: 'POST'}) {
  const headers = {
    'Content-Type': 'application/json',
    // 如果有鉴权Token, 可以在这里添加
    'Authorization': "Bearer bce-v3/ALTAK-QmOnbOjKjfkoiTVjJ2drk/3b3ffa6ec18e3ecf5b7db1ee3d3e81d79a217d9e",
    ...options.headers,
  };
  const URL = `${BASE_URL}${endpoint}`;
  const params = {
    body: JSON.stringify({
        app_id: data?.app_id || "cd4cf9a8-2c54-42c0-8d95-c463ca7ca252",
        ...(data || {})
    }),
    ...options,
    headers
  };
  console.log("REQUEST", JSON.stringify(params), URL);
  const response = await fetch(URL, params);
  // 处理响应（可以根据你的API的具体错误处理方式来调整）
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred while fetching data');
  }
  // 接收 stream 流式响应体
  // @ts-ignore
  if(data?.stream && response.body){
    // const reader = response.body.getReader(); // 获取可读流的 reader
    // let result = '';
    // while (true) {
    //   const { done, value } = await reader.read(); // 从流式数据中读取数据
    //   if (done) {
    //     break; // 读取结束，退出循环
    //   }
    //   const buffer = Buffer.from(value); // 使用 Buffer 将十进制字符编码转换成字符串
    //   result += buffer.toString('utf8');
    //   console.log(result, "----stream"); // 将数据转换为字符串并打印到 console
    // }
    return response.body;
  } else {
    // 默认假设响应是JSON格式
    return response.json();
  }
}

export default fetchWrapper;