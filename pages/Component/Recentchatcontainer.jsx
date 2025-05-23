import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import '../../src/Css/Mainpage/Chatsection/Chatlist.css';

const DEFAULT_ROOM = "Dev Circle";

function Recentcontainer({ onRoomSelect, currentRoom }) {
  const [rooms, setRooms] = useState([DEFAULT_ROOM]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.emit('get_rooms');
    socket.on('room_list', (roomList) => {
      setRooms(roomList.includes(DEFAULT_ROOM) ? roomList : [DEFAULT_ROOM, ...roomList]);
    });
    return () => socket.off('room_list');
  }, [socket]);

  return (
    <>
      <div className="Chatlist-lastchat-container">
        {rooms.map((room) => (
          <div
            className="recentchat-container"
            key={room}
            style={{
              cursor: 'pointer',
              marginBottom: '0.5em',
              background: currentRoom === room ? '#e6f7ff' : '#E6E6E6'
            }}
            onClick={() => onRoomSelect && onRoomSelect(room)}
          >
            <div className="recentchat-image">
              <img src="https://c4.wallpaperflare.com/wallpaper/399/722/332/one-punch-man-saitama-hd-wallpaper-preview.jpg" alt="" />
            </div>
            <div className="recentchat-content">
              <p><b>{room}</b></p>
              <p>Click to join</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Recentcontainer;