import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../prismaClient';
import fetchWrapper from '@/utils/fetchWrapper';
// 直接读取 env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { play } = req.query; // 获取URL参数中的id
  console.log(play, "playplayplay", req.query);
  const a = await fetchWrapper("/v2/app/conversation");
  console.log(a, "a");
  if(a){
    res.status(200).json(a);
  }
}