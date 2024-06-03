import { NextApiRequest, NextApiResponse } from 'next';
import { setCache } from '../redisio';
// 直接读取 env

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  if (body?.conversation_id && Array.isArray(body?.messageList) && body?.messageList.length > 0) {
    const setFlag = await setCache(body?.conversation_id, JSON.stringify(body?.messageList));
    console.log(setFlag, "setFlag");
    if (setFlag) {
      res.status(200).json({
        message: '保存成功！',
        code: 0
      });
    } else {
      res.status(200).json({
        message: '保存失败！',
        code: 500
      });
    }
  }else{
    res.status(200).json({
      message: '参数错误！',
      code: 500
    });
  }
}

