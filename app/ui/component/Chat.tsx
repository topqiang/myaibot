"use client"
import { Input, Tooltip, Spin, Modal } from "antd"
import { SwapOutlined, SettingOutlined, LoadingOutlined} from "@ant-design/icons"
import { useCallback, useEffect, useState, useRef } from "react";
import { SendIcon, UserInfo, ChatList, Messages } from "@/app/ui/component/index";

const data: IMessage[] = [
  {
    message_id: '1',
    title: '星哥小秘',
    description: '你好！我是星哥的智能小秘，为了帮助新一代学生在未来多变的社会能够更好的求学就业，我为你提供专业的定制化咨询服务，让我们一起找到未来的自己，优秀的自己！',
  }
];
let incompleteData = '';
// 解析数据的方法
function parseData(data: string) {
  // 如果有未完整的数据，则和当前数据拼接
  incompleteData = incompleteData + data;
  let jsonData;
  try {
    // 尝试解析为JSON
    jsonData = JSON.parse(incompleteData);
    // 清空未完整的数据
    incompleteData = '';
    return jsonData;
  } catch (e) {
    // 如果解析失败，说明数据不完整，将当前数据保存到未完整的数据中
    // incompleteData = data;
    return null;
  }
}

// @ts-ignore
export default function Chat({user}) {
  // 用户输入问题的临时变量
  const [question, setQuestion] = useState("");
  const chatContainerRef = useRef(null);
  const [messageList, setMessageList] = useState<IMessage[]>(data);
  const [loading, setLoading] = useState(false);
  const [modal, contextHolder] = Modal.useModal();
  const chat = useCallback(() => {
    if(!question.trim() || loading){
      return;
    }
    const message_id = Date.now() + "";
    setMessageList([...messageList, {
      message_id,
      title: user?.nickname,
      userId: user.id,
      description: question,
    }, {
      message_id: message_id + "callback",
      title: '星哥小秘',
      userId: 0,
      isLoading: true,
      description: "",
    }]);
    setLoading(true);
    setQuestion("");
    fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: question,
        conversation_id: user?.conversation_id
      }),
    })
    .then(async streamResponse => {
      // 在这里可以使用 Response 对象中的流式数据进行处理
      // @ts-ignore
      const reader = streamResponse.body.getReader(); // 获取可读流的 reader
      let messageStr = "";
      const timer = setInterval(async() => {
        const { done, value } = await reader.read(); // 从流式数据中读取数据
        if(!value){
          return;
        }
        if (done) {
          clearInterval(timer); // 读取结束，退出循环
        }
        const buffer = Buffer.from(value); // 使用 Buffer 将十进制字符编码转换成字符串
        const string = buffer.toString('utf8');
        const jsonData = string.split("data: "); // 从 event.data 中匹配出 JSON 数据
        if (jsonData.length > 0) {
          jsonData.forEach((jsonString) => {
            if(!jsonString) return;
            try {
              const parsedData = parseData(jsonString);
              messageStr += parsedData.answer;
              setMessageList(prev => {
                const newList = [...prev];
                newList[newList.length - 1].description = messageStr;
                newList[newList.length - 1].isLoading = !parsedData.is_completion;
                return newList;
              });
            } catch (error) {
              console.log("answer", jsonString, error);
            }
          });
        }
      }, 300);
    })
    .catch(error => {
      console.error('获取流式数据出错:', error);
    })
    .finally(() => {
      setLoading(false);
    });
  }, [question, messageList, loading]);

  const chatComponent = {
    title: '切换会话',
    content: <ChatList />,
  };

  const updUser = {
    title: '修改身份信息',
    content: <UserInfo />,
  };

  useEffect(() => {
    if(chatContainerRef?.current){
      // @ts-ignore
      chatContainerRef.current.scrollTop = chatContainerRef.current?.scrollHeight;
    }
  }, [messageList, chatContainerRef]);

  return (
    <main className="blur-effect flex-1 flex flex-col divide-y divide-gray-700/50">
      <header className="justify-between flex flex-none flex  px-8 py-4 text-gray-300 leading-6">
        <h3>和{user.nickname}的对话</h3>
        {/* <span>
          <Tooltip title="切换会话">
            <SwapOutlined className="mr-2" onClick={() => {
              modal.confirm(chatComponent);
            }}/>
          </Tooltip>
          <Tooltip title="设置身份">
            <SettingOutlined onClick={() => {
              modal.confirm(updUser);
            }}/>
          </Tooltip>
        </span> */}
      </header>
      <div className="flex flex-col flex-1 p-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto" ref={chatContainerRef}>
          <Messages
            data={messageList}
            userId={user.id}
          />
        </div>
        <div className="flex-none h-18 p-2">
          <Input
            className="w-full"
            size="large"
            onChange={(e) => {
              setQuestion(e.target.value);
            }}
            value={question}
            onPressEnter={chat}
            suffix={
            <Tooltip title="点击发送">
              <span className="cursor-pointer" onClick={chat}>
                {loading ? <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> : <SendIcon/>}
              </span>
            </Tooltip>
            }
          />
        </div>
      </div>
      {contextHolder}
    </main>
  )
}
