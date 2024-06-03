import 'tailwindcss/tailwind.css';
import '@/app/globals.css';
import Chat from "../app/ui/component/Chat";
import { CodeVerify } from "@/app/ui/component/index";
import checkUser from "./api/middleware/login";
import checkConversation from "./api/middleware/checkConversation";

export const metadata = {
  title: '星哥小秘求学择业规划',
  description: '根据当下环境，未来科技社会发展以及你的个人优劣势、兴趣爱好为你量身定制未来规划。青春不迷茫，未来可期！',
}
//@ts-ignore
export default function Index({user, messageList}) {
  return (
    <div className={"tech-background h-screen w-screen flex-col flex text-center justify-center content-center"}>
      {user?.activationCode ? <Chat user={user} messageList={messageList}/> : <CodeVerify userId={user?.id}/>}
      <footer style={{
        height: "40px"
      }} className="text-center opacity-50 flex-none">
        星哥小秘 ©{new Date().getFullYear()} Created by 星哥智能化规划研究室
      </footer>
    </div>
  )
}
//@ts-ignore
export async function getServerSideProps(context) {
  let user = await checkUser(context);
  let messageList = [];
  if(user?.activationCode){
    let a = await checkConversation(context, user);
    user = a.user;
    if(typeof a.messageList === 'string' && a.messageList.length > 0){
      try {
        messageList = JSON.parse(a.messageList);
      } catch (error) {
        messageList = [];
      }
    }
  }
  
  // 将用户信息作为 prop 传递给页面
  return { props: {
      user: {
        id: user?.id || "",
        nickname: user?.nickname || "",
        activationCode: user?.activationCode || "",
        conversation_id: user?.conversation_id || ""
      },
      messageList
    }};
}
