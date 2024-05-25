// lib/redis.js
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT ? +process.env.REDIS_PORT : 6379,
});

// 例如，设置一个键值对
// redis.set('mykey', 'Hello', function (err, result) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result); // 打印 OK
//   }
// });

// // 获取键的值
// redis.get('mykey', function (err, result) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(result); // 打印 Hello
//   }
// });

export default redis;