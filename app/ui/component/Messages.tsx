'use client'
import React from 'react';
import { List, Avatar, Button } from 'antd';
import { LoadingOutlined} from "@ant-design/icons";
import Remarkable from 'react-remarkable'; // 引入react-remarkable组件

const Messages: React.FC<{
  data: IMessage[],
  userId: string,
  reChat: (index: number) => void
}> = ({
  data,
  userId,
  reChat
}) => {
  return (
    <List
      itemLayout="horizontal"
      dataSource={data}
      className='text-left px-2'
      renderItem={(item, index) => {
        const isRight = item?.userId == userId;
        const remarkable = item?.isLoading ? item?.description + " ..." : item.description;
        const isError = item?.isError || !remarkable;
        return (
          <List.Item>
            <List.Item.Meta
              className={`flex ${isRight ? "flex-row-reverse text-right" : ""}`}
              avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${isRight ? 1 : 0}`} />}
              title={
                <div className='text-slate-100'>
                  {item.title}&nbsp;
                  {item?.isLoading && <LoadingOutlined />}
                </div>
              }
              description={
                <span
                  className={`${isRight ? "ml-12" : "mr-12"} text-slate-200 p-2 border text-left border-slate-500/25 border-solid inline-block rounded-md bg-emerald-500/25`}
                >
                  {isError ? <Button type='link' onClick={() => reChat(index)}>发生错误，点击重试</Button> : <Remarkable source={remarkable} />}
                </span>
              }
            />
          </List.Item>
        );
      }}
    />
  );
}

export default Messages;