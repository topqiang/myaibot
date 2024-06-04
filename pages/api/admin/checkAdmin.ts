import prisma from '../prismaClient';
import { parse } from 'cookie';
//@ts-ignore
export default async ({req, res, params, query}) => {
  // const user = req?.session?.user;
  // 获取请求中的 cookie
  const cookieHeader = req.headers.cookie;
  const host: string = req.headers.host;
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  let cookie = cookieHeader ? parse(cookieHeader) : {};
  // if(host.includes("localhost")){
  //   //@ts-ignore
  //   cookie.adminId = 1;
  // }
  let user;
  if(!cookie?.adminId){
    const authUrl = `${protocol}://${host}/admin/login`;
    res.writeHead(302, { Location: authUrl });
    res.end();
    return null;
  } else if(cookie?.adminId){
    const userInfo = await prisma.adminUser.findMany({
      where: {
        id: +cookie?.adminId
      }
    });
    if (userInfo.length > 0) {
      user = userInfo[0];
    }else{
      res.setHeader('Set-Cookie', 'userId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT');
      return {};
    }
  }
  if(user?.id){
    res.setHeader('Set-Cookie', `adminId=${user?.id}; HttpOnly; Path=/; Max-Age=${3600 * 24 * 7}`);
  }
  return user;
};
