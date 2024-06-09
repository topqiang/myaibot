import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../prismaClient'

// 假设你使用了一个名为`paginate`的自定义函数来处理分页逻辑
// 这里简化处理，直接在Prisma查询中使用skip和take来实现分页
async function getSession(page = 1, pageSize = 10, userId: number) {
  const skip = (page - 1) * pageSize; // 计算跳过的记录数
  const take = pageSize; // 每页的记录数

  // 构造模糊搜索条件，使用模糊搜索like操作符

  try {
    // 执行查询，包括分页和模糊搜索
    const sessionList = await prisma.session.findMany({
      where: {
        userId,
        expirationDate: {
          gt: new Date()
        }
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc', // 可选：按创建时间降序排序
      },
    });

    // 获取总记录数以便计算总页数（如果需要）
    const totalSessionList = await prisma.session.count({
      where: {
        userId,
        expirationDate: {
          gt: new Date()
        }
      }
    });

    // 计算总页数
    const totalPages = Math.ceil(totalSessionList / pageSize);

    return {
      sessionList,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalSessionList,
      },
    };
  } catch (error) {
    console.error('Error fetching redemption codes:', error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res:NextApiResponse ) {
    const { userId, page, pageSize, code } = req.body; // 获取 POST 请求的入参
    if(!page){
      res.status(200).json({
        message: '入参有误！',
        code: 500
      });
      return;
    }
    try {
      const result = await getSession(parseInt(page, 10), parseInt(pageSize, 10), userId);
      res.status(200).json({
        message: '列表查询成功！',
        result,
        code: 0
      });
    } catch (error) {
      res.status(200).json({
        message: 'An error occurred while fetching the data.',
        code: 500
      });
    }
}