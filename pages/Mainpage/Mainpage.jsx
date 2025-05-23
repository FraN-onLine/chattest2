import { useState, useEffect } from "react";
import Sidebar from "./Chatsection/Sidebar";
import Chatlist from "./Chatsection/Chatlist";
import Chatbox from "./Chatsection/Chatbox";
import '../../src/Css/Mainpage/Mainchat/Mainchat.css'

function Mainpage() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("Dev Circle");

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <div className="Main-content">
      <Sidebar />
      <div className="feature-contents">
          <Chatlist username={username} setUsername={setUsername} room={room} setRoom={setRoom} />
          <Chatbox username={username} room={room} setRoom={setRoom} />
      </div>
      
    </div>
  );
}

export default Mainpage;