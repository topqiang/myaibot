import fetchWrapper from '@/utils/fetchWrapper';
import { setCache, getCache } from '@/pages/api/redisio';

// 识别用户意图
export default async (query: string) => {
  const app_id = "2b9c358b-51d4-4b30-a35b-386aad872f04";
  let conversation_id = await getCache(app_id);
  // <去西北自驾游，帮我做个旅游攻略？>这个问题和高考、就业、选专业、报志愿以及职业规划有关吗？如果有关仅返回'true'，否则仅返回 'false'<去西北自驾游，帮我做个旅游攻略？>这个问题和高考、就业、选专业、报志愿以及职业规划有关吗？如果有关仅返回'true'，否则仅返回 'false'
  if(!conversation_id){
    const a = await fetchWrapper("/v2/app/conversation", {
      app_id
    });
    await setCache(app_id, a?.conversation_id, 3600 * 24 * 5);
    conversation_id = a?.conversation_id;
  }
  console.log(conversation_id, "checkIntention");

  const params = {
    "query": query || `“${query}”这个问题和就业、求学、选专业、高考、性格打造、能力锻炼、职业规划有关吗？如果有关仅返回'true'，否则仅返回 'false'`,
    app_id,
    "conversation_id": conversation_id,
  };
  const res = await fetchWrapper("/v2/app/conversation/runs", params);
  return res;
}