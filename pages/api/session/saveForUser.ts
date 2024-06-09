import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../prismaClient'

export default async function handler(req: NextApiRequest, res:NextApiResponse ) {
    const { userId, conversation_id } = req.body; // 获取 POST 请求的入参
    if(!userId || !conversation_id){
      res.status(200).json({
        message: '入参有误！',
        code: 500
      });
      return;
    }
    try {
      const result = await prisma.user.update({
        where:{
          id: userId
        },
        data: {
          conversation_id: conversation_id
        }
      });
      res.status(200).json({
        message: '成功！',
        result,
        code: 0
      });
    } catch (error) {
      res.status(200).json({
        message: 'An error occurred while fetching the data.',
        code: 500
      });
    }
}