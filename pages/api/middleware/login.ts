import prisma from '../prismaClient';
import { parse } from 'cookie';
// pages/api/login.js
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
//@ts-ignore
export default async ({req, res, params, query}) => {
  // const user = req?.session?.user;
  // 获取请求中的 cookie
  const cookieHeader = req.headers.cookie;
  const host: string = req.headers.host;
  let cookie = cookieHeader ? parse(cookieHeader) : {};
  // 在控制台输出 cookie
  console.log('Request Cookie:', host, cookie, params);
  if(host.includes("localhost")){
    //@ts-ignore
    cookie.userId = 5;
  }
  let user;
  // console.log(params, "user", query);
  if(!cookie?.userId && !query?.code){
    const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WECHAT_APP_ID}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URL || "https://www.myai-club.top")}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
    res.writeHead(302, { Location: authUrl });
    res.end();
    return null;
  }
  if(!cookie?.userId && query?.code){
    // 通过 code 获取 access_token 和 openid
    const accessTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WECHAT_APP_ID}&secret=${process.env.WECHAT_APP_SECRET}&code=${query?.code}&grant_type=authorization_code`;
    const accessTokenResponse = await fetch(accessTokenUrl);
    const accessTokenData = await accessTokenResponse.json();
    const { access_token, openid } = accessTokenData;
    const userInfo = await prisma.user.findMany({
      where: {
        openid: openid || query?.openid
      }
    });
    if (userInfo.length > 0) {
      user = userInfo[0];
    }else {
      user = await prisma.user.create({
        data: {
          nickname: '星粉_' + generateRandomString(),
          status: '0',
          openid: openid || query?.openid
        }
      });
    }
  } else if(cookie?.userId){
    const userInfo = await prisma.user.findMany({
      where: {
        id: +cookie?.userId
      }
    });
    if (userInfo.length > 0) {
      user = userInfo[0];
    }else{
      res.setHeader('Set-Cookie', 'userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return null;
    }
  }
  if(user?.id){
    res.setHeader('Set-Cookie', `userId=${user?.id}; HttpOnly; Path=/; Max-Age=${3600 * 24 * 7}`);
  }
  return user;
};
