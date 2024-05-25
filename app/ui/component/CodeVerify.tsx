'use client'
import React, { useCallback } from 'react';
import { Input } from 'antd';
import api from '@/app/lib/api';

const App: React.FC<{
  userId: number
}> = ({userId}) => {
  const bindCode = useCallback<(text: string) => void>(text => {
    api("/api/user/bindCode", {
      userId,
      code: text
    }).then(res => {
      if(!res.code){
        location.reload();
      }
    });
  }, [userId]);
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl">
        输入您的兑换码
      </h1>
      <div>
        <Input.OTP formatter={(str) => str.toUpperCase()} onChange={bindCode} />
      </div>
    </div>
  );
};

export default App;