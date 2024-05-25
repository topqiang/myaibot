import { PrismaClient } from '@prisma/client';
declare global {
  // 为 NodeJS 的全局类型添加一个 prisma 属性
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient;
    }
  }
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
  // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;