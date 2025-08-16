import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const App = () => {
  const [hidden, sethidden] = useState(true)
  const [loading, setloading] = useState(false)
  const [socket, setSocket] = useState(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'Boot',
      content: 'Hello, how can I help you?',
      time: '12:22:33',
    },
  ]);

  useEffect(() => {
    const newSocket = io('http://localhost:3030');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });
    newSocket.on('ai-message-response', (data) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'Boot',
          content: data,
          time: new Date().toTimeString().split(' ')[0],
        },
      ]);
      setloading(false);
    });
    
    

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setloading(true);
    const newMessage = {
      role: 'user',
      content: input,
      time: new Date().toTimeString().split(' ')[0],
    };

    setMessages((prev) => [...prev, newMessage]);
   
    if (socket) {
      socket.emit('message', { content: input });
    }

    setInput('');
  };

  return (
    <>
    <div onClick={()=>{
      sethidden(!hidden)
    }} className='w-20 h-20 rounded-full cursor-pointer  absolute bottom-5 right-10 flex itmes-center justify-center'>
      <img className='w-full h-full object-cover ' src="https://png.pngtree.com/png-clipart/20230401/original/pngtree-smart-chatbot-cartoon-clipart-png-image_9015126.png" alt="" />
    </div>
    
    <div className={`absolute top-5 right-5 max w-[20vw] h-[80vh] flex border-1 border-gray-400 rounded-t-lg rounded-bl-lg flex-col items-center ${hidden?"hidden":""}`}>
      <header className="w-full h-20 bg-blue-500 rounded-lg text-center p-5">
        <h1 className="text-2xl text-white font-bold uppercase">AI Chat Bot :-</h1>
      </header>
      <main className="w-full overflow-x-hidden flex-grow overflow-y-auto">
        <div className="pb-20">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`w-full overflow-auto p-4 m-2 rounded-lg ${
                msg.role === 'Boot'
                  ? 'bg-blue-100 text-blue-500'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <strong>{msg.role}:</strong> {msg.content}
              <p className="text-sm">{msg.time}</p>
            </div>
          ))}
         {loading && <div className={`w-full overflow-auto p-4 m-2 bg-gray-300 rounded-lg `}>
              wait....
        </div>}
        </div>
      </main>
      <footer className="w-full h-20 p-2 flex items-center justify-between gap-5">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-15 border border-gray-600 rounded-lg p-2 outline-none"
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-green-500 py-3 px-6 rounded-lg font-bold text-xl cursor-pointer"
        >
         {loading ? 'Sending...' : 'Send'}
        </button>
      </footer>
    </div>
    </>
  );
};

export default App;