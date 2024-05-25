import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../prismaClient'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = await prisma.user.findMany();
  await prisma.user.create({
    data: {
      nickname: 'John Doe',
      status: '0',
      openid: ''
    }
  });
  res.status(200).json({
    success: true,
    data: data || {
      name: 'John Doe',
      age: 30,
    },
  });
}