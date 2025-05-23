import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import '../../../src/Css/Mainpage/Chatsection/Chatbox.css';
import { IoMdSend } from "react-icons/io";

const DEFAULT_ROOM = "Dev Circle";

function Chatbox({ username, room, setRoom }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [newRoom, setNewRoom] = useState('');
  const [roomList, setRoomList] = useState([DEFAULT_ROOM]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('get_rooms');
    socket.on('room_list', (rooms) => {
      setRoomList(rooms.includes(DEFAULT_ROOM) ? rooms : [DEFAULT_ROOM, ...rooms]);
    });
    return () => {
      socket.off('room_list');
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('join_room', room);

    const handleLoadMessages = (loadedMessages) => setMessages(loadedMessages);
    const handleReceiveMessage = (data) => setMessages((prev) => [...prev, data]);

    socket.on('load_messages', handleLoadMessages);
    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('load_messages', handleLoadMessages);
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, room]);

  const sendMessage = () => {
    if (message.trim() !== '' && socket) {
      const messageData = {
        username: username || 'Anonymous',
        content: message,
        timestamp: new Date().toISOString(),
        room,
      };
      socket.emit('send_message', messageData);
      setMessage('');
    }
  };

  const handleCreateRoom = () => {
    if (newRoom.trim() !== '' && socket) {
      setRoom(newRoom.trim());
      socket.emit('join_room', newRoom.trim());
      setNewRoom('');
    }
  };

  return (
    <div className="Chatbox-main-layout" style={{ display: 'flex', height: '100%', boxSizing:'border-box',padding:'1em',backgroundColor:'white'}}>
      {/* Main chat area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="Chatbox-header">
          <p><b>Group Chat - {room}</b></p>
        </div>
        <div className="Chatbox-body">
          <div className="Chat-content">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-message ${
                  msg.username === username ? 'chat-message-self' : 'chat-message-other'
                }`}
              >
                <div className="chat-bubble">
                  <p className="chat-username">
                    <b>{msg.username}</b>
                    <span className="chat-timestamp">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </p>
                  <p className="chat-text">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="Chatbox-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage();
            }}
          />
          <IoMdSend className="send-logo" onClick={sendMessage} />
        </div>
      </div>
    </div>
  );
}

export default Chatbox;