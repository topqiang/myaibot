import prisma from '../prismaClient';
import fetchWrapper from '@/utils/fetchWrapper';
import { getCache } from '../redisio';
// @ts-ignore
export default async ({req, res, params, query}, user) => {
  const conversation = await prisma.session.findMany({
    where: {
      userId: user?.id,
      expirationDate: {
        gt: new Date()
      }
    }
  });
  let messageList = '';
  if(!user.conversation_id && conversation.length === 0){
    // 调用百度创建会话
    const a = await fetchWrapper("/v2/app/conversation");
    if(!user?.conversation_id){
      await prisma.user.update({
        where:{
          id: user?.id,
        },
        data: {
          conversation_id: a?.conversation_id
        }
      });
    }
    const now = new Date();
    // 使用 JavaScript 的 Date 对象，将日期设置为当前时间加上 7 天
    const expirationDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const session = await prisma.session.create({
      data: {
        conversation_id: a?.conversation_id,
        expirationDate: expirationDate,
        title: user?.nickname,
        userId: user?.id,
        status: '0',
      }
    });
    user.conversation_id = a?.conversation_id;
    user.session_id = session?.id;
  } else if (!user.conversation_id && conversation.length > 0) {
    await prisma.user.update({
      where:{
        id: user?.id,
      },
      data: {
        conversation_id: conversation[0].conversation_id
      }
    });
    user.conversation_id = conversation[0].conversation_id
    user.session_id = conversation[0].id;
  } else {
    const conversationIsInvalid = conversation.find(v => v.conversation_id === user.conversation_id);
    if(!conversationIsInvalid){
      await prisma.user.update({
        where:{
          id: user?.id,
        },
        data: {
          conversation_id: conversation[0].conversation_id
        }
      });
      user.conversation_id = conversation[0].conversation_id;
      user.session_id = conversation[0].id;
    } else {
      user.conversation_id = conversationIsInvalid.conversation_id;
      user.session_id = conversationIsInvalid.id;
    }
  }
  messageList = await getCache(user.conversation_id);
  return {
    user,
    messageList
  };
};
