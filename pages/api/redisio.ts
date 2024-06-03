// lib/redis.js
import Redis from 'ioredis';
const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
};

let redis: Redis;
export async function setCache(key: string, value: string) {
  try {
    redis = new Redis(redisConfig); // 创建ioredis客户端实例
    await redis.set(key, value); // 使用await等待set操作完成
    return true;
  } catch (error) {
    console.error('Error setting value:', error);
  } finally {
    redis.quit(); // 关闭客户端连接
  }
  return false;
}

export async function getCache(key: string) {
  try {
    redis = new Redis(redisConfig); // 创建ioredis客户端实例
    const value = await redis.get(key); // 使用await等待get操作完成
    if (value !== null) {
      return value;
    }
  } catch (error) {
    console.error('Error getting value:', error);
  } finally {
    redis.quit(); // 关闭客户端连接
  }
  return '';
}


// 例如，设置一个键值对
// redis.set('mykey', 'Hello', function (err, result) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result); // 打印 OK
//   }
// });

// 获取键的值
// redis.get('mykey', function (err, result) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result); // 打印 Hello
//   }
// });
