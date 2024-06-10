import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';
import fetchWrapper from '@/utils/fetchWrapper';
import checkIntention from '@/utils/checkIntention';
// 直接读取 env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  const params = {
    "query": body?.query || "未来5年最好的行业和岗位有哪些？",
    "stream": true,
    "conversation_id": body?.conversation_id || "9f497954-95d2-457f-a600-15d4c455143f",
  };
  if(body?.isFirst){
    await prisma.session.update({
      where: {
        id: body?.session_id
      },
      data: {
        title: body?.query
      }
    });
  }
  try {
    const checkRes = await checkIntention(params?.query);
    console.log(checkRes, "----checkRes");
  } catch (error) {
    console.log("意图识别报错", error);
  }
  try {
    const remoteResponse = await fetchWrapper("/v2/app/conversation/runs", params);
    if(params?.stream){
      // res.setHeader('Content-Type', 'application/octet-stream'); // 设置合适的 Content-Type
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      const reader = remoteResponse.getReader();
      let i = 0;
      const pump = () => {
        // @ts-ignore
        return reader.read().then(({done, value}) => {
          if (done) {
            res.end()
            return;
          }
          const buffer = Buffer.from(value); // 使用 Buffer 将十进制字符编码转换成字符串
          const string = buffer.toString('utf8');
          res.write(string);
          // @ts-ignore
          res.flush();
          return pump();
        });
      };
      pump().then(() => res.end());
    }else{
      res.status(200).json(remoteResponse);
    }
  } catch (error) {
    console.error('获取流式数据出错:', error);
    res.status(405);
  }
}