import React from 'react';
import CouponList from './components/CouponList';
import checkAdmin from "@/pages/api/admin/checkAdmin";

const CouponManagement: React.FC = () => {

  return (
    <div>
      <h1>兑换码管理</h1>
      <CouponList />
    </div>
  );
};

export default CouponManagement;

//@ts-ignore
export async function getServerSideProps(context) {
  let user = await checkAdmin(context);
  // 将用户信息作为 prop 传递给页面
  
  return {
    props: {
      user: {
        id: user?.id || "",
        username: user?.username || ""
      }
    }
  };
}