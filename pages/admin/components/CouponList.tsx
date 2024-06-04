"use client"
import { Table, Button, message } from 'antd';
import api from '@/app/lib/api';
import React, { useCallback, useEffect, useState } from 'react';

const CouponList: React.FC = () => {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 100,
    code: ''
  });
  const [data, setData] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '兑换码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (value: number) =>{
        return value != 0 ? "已激活" : "未启用"
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    }
  ];

  const getCodeList = useCallback(async () => {
    const res = await api("/api/redemptionCode", params);
    if(res?.code === 0){
      setData(res.result?.redemptionCodes || []);
    }
  }, [params]);

  const addCode = useCallback(async () => {
    const res = await api("/api/redemptionCode/add", params);
    if(res?.code === 0){
      message.success("新建成功！");
      getCodeList();
    }
  }, [getCodeList]);

  useEffect(() => {
    getCodeList();
  }, [params]);

  return <>
    <Button onClick={addCode}>新建code</Button>
    <Table dataSource={data} columns={columns}/>
  </>;
};

export default CouponList;