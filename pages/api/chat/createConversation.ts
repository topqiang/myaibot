import { NextApiRequest, NextApiResponse } from 'next';
import fetchWrapper from '@/utils/fetchWrapper';
// 直接读取 env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const a = await fetchWrapper("/v2/app/conversation");
  if(a){
    res.status(200).json(a);
  }
}