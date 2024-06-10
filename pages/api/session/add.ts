import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';
import fetchWrapper from '@/utils/fetchWrapper';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const postData = req.body; // 获取 POST 请求的入参
  if (req.method === 'POST' && postData?.userId) {
    console.log(postData, "postData");
    const a = await fetchWrapper("/v2/app/conversation");
    if(!a?.conversation_id){
      res.status(200).json({ message: '创建会话session失败！', code: 500 });
      return;
    }
    try {
  
      const now = new Date();
      // 使用 JavaScript 的 Date 对象，将日期设置为当前时间加上 7 天
      const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const session = await prisma.session.create({
        data: {
          conversation_id: a?.conversation_id,
          expirationDate: expirationDate,
          title: now + "",
          userId: postData?.userId,
          status: '0',
        }
      });

      const updUserRes = await prisma.user.update({
        where:{
          id: postData?.userId,
        },
        data: {
          conversation_id: a?.conversation_id
        }
      });
      console.log(updUserRes, "----updUserRes");
      if(session && updUserRes){
        res.status(200).json({ message: '创建成功！', code: 0 });
      }
    } catch (error) {
      res.status(200).json({ message: '会话入库失败！', code: 500 });
    }
  } else {
    res.status(405).json({ message: '参数不全！' });
  }
}

