import { PrismaClient } from '@prisma/client';


declare global {
  interface IMessage{
    message_id: string;
    title: string;
    userId?: string | number;
    description: string;
    isLoading?: boolean;
  }
  interface IUser{
    id: string;
    nickname: string;
    activationCode: string;
    conversation_id: string;
  }
  interface GlobalThis {
    prisma: PrismaClient;
  }
}