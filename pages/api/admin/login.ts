import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../prismaClient'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const postData = req.body; // 获取 POST 请求的入参
    if(postData?.username && postData?.password){
      const user = await prisma.adminUser.findMany({
        where: {
          username: postData?.username
        }
      });
      if(user.length > 0 && user[0].password === postData?.password){
        res.setHeader('Set-Cookie', `adminId=${user[0].id}; HttpOnly; Path=/; Max-Age=${3600 * 24 * 7}`);
        res.status(200).json({
          message: '登录成功！',
          result: user[0],
          code: 0
        });
      }else{
        res.status(200).json({
          message: '未找到该管理员，或者密码错误！',
          code: 500
        });
      }
    }else {
      res.status(200).json({
        message: '用户名和密码不能为空！',
        code: 500
      });
    }
  }
}