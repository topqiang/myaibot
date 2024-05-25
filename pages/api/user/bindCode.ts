import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../prismaClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const postData = req.body; // 获取 POST 请求的入参
    console.log(postData, "postData");
    const redemptionCode = await prisma.redemptionCode.findMany({
      where: {
        code: postData.code,
        status: '0'
      },
    });
    if (redemptionCode?.length > 0) {
      try {
        let result;
        await prisma.$transaction(async (tx) => {
          const redemptionCode = await tx.redemptionCode.update({
            where: {
              code: postData.code,
            },
            data: {
              status: '1',
              boundPersonId: postData.userId,
              verificationTime: new Date()
            }
          });
          const user = await tx.user.update({
            where: {
              id: postData.userId,
            },
            data: {
              activationCode: postData.code,
              updatedAt: new Date(),
              status: '1'
            }
          });
          result = {user, redemptionCode}
        });
        res.status(200).json({
          message: '请求成功',
          result,
          code: 0
        });
      } catch (error) {
        console.error('Transaction failed:', error);
        res.status(500).json({ code: 500, message: '数据库操作异常' });
      } finally {
        await prisma.$disconnect(); // 在结束时断开 Prisma Client 的连接
      }
    } else {
      res.status(200).json({
        message: '该兑换码不存在或已使用！',
        code: 500
      });
    }
    // 处理入参...
  } else {
    res.status(405).json({ message: '只支持POST请求' });
  }
}