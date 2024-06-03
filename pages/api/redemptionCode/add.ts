import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';
import { parse } from 'cookie';

const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const cookieHeader = req.headers.cookie;
    let cookie = cookieHeader ? parse(cookieHeader) : {};
    // 使用Prisma创建一个新的RedemptionCode记录
    const newRedemptionCode = await prisma.redemptionCode.create({
      data: {
        code: generateRandomString(),
        status: '0',
        creatorId: +cookie?.adminId,
      },
    });
    res.status(200).json({
      message: '新增成功！',
      result: newRedemptionCode,
      code: 0
    });
  } catch (error) {
    res.status(200).json({
      message: 'An error occurred while fetching the data.',
      code: 500
    });
  }
}