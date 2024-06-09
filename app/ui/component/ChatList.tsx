'use client'
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  List,
  message
} from 'antd';
import api from '@/app/lib/api';

const App: React.FC<{userId: number}> = ({
  userId
}) => {
  const [list, setList] = useState([]);
  const getList = useCallback(async () => {
    const res = await api("api/session", {
      userId,
      page: 1,
      pageSize: 100
    });
    if(!res?.code){
      setList(res?.result?.sessionList)
    }
    console.log(list, "----listlistlist");
  }, []);

  useEffect(() => {
    getList();
  }, []);

  const setDefaultConvosation = useCallback((conversation_id: string) => {
    api("/api/session/saveForUser",{
      userId,
      conversation_id
    }).then(res => {
      if(!res?.code){
        message.success("设置成功！");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });
  }, [userId]);

  return (
    <List
      size="large"
      bordered
      dataSource={list}
      renderItem={(item) => (
        <List.Item
          actions={[<Button
            onClick={() => {
              setDefaultConvosation(item?.conversation_id);
            }}
          >切换到当前会话</Button>]}
        >
          {item?.title || item?.conversation_id}
        </List.Item>
      )}
    />
  );
};

export default App;