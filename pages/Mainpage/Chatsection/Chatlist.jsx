import { useState, useEffect } from 'react';
import { FaCircle } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import Recentchatcontainer from "../../Component/Recentchatcontainer";
import { io } from 'socket.io-client';
import '../../../src/Css/Mainpage/Chatsection/Chatlist.css';
import { FaEdit } from "react-icons/fa";


function Chatlist({ username, setUsername, room, setRoom }) {
  const [Dropdown, setDropdown] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const [newRoom, setNewRoom] = useState('');

  useEffect(() => {
    async function fetchUsername() {
      try {
        const res = await fetch('http://localhost/CCIS_CONNECT-MASTER/src/php/get_username.php', { credentials: 'include' });
        const data = await res.json();
        if (data.username) {
          setUsername(data.username);
          setNewUsername(data.username);
          setUserId(data.userId);
        } else {
          setUsername('Unknown');
          setNewUsername('Unknown');
        }
      } catch (e) {
        setUsername('Unknown');
        setNewUsername('Unknown');
      }
    }
    fetchUsername();
  }, []);

  useEffect(() => {
    setNewUsername(username);
  }, [username]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (result) => {
      if (result.success) {
        setUsername(result.newUsername);
        setEditing(false);
        setError('');
      } else {
        setError(result.error || 'Failed to change username.');
      }
    };
    socket.on('username_changed', handler);
    return () => socket.off('username_changed', handler);
  }, [socket, setUsername]);

  const handleUsernameChange = (e) => setNewUsername(e.target.value);

  const submitUsernameChange = (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      setError('Username cannot be empty.');
      return;
    }
    if (socket && newUsername !== username) {
      socket.emit('change_username', { userId, newUsername: newUsername.trim() });
    }
  };

  function toggleDropdown() {
    setDropdown(!Dropdown);
  }

  // FIX: Add this function to handle room creation/join
  const handleCreateRoom = () => {
    if (newRoom.trim() !== '' && socket) {
      setRoom(newRoom.trim());
      socket.emit('join_room', newRoom.trim());
      setNewRoom('');
    }
  };

  return (
    <div className="Chatlist-container">
      <div className="Chatlist-header">
        <h1>Chat</h1>
      </div>
      <hr className="Chatlist-divider" />

      <div className="Chatlist-profile-section">
        <div className="profile-placeholder">
          <img
            src="https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
            alt="profile.jpg"
            className='profile-image'
          />
        </div>
        <div className="profile-info">
          <form className="profile-username-row" onSubmit={submitUsernameChange} autoComplete="off">
            {editing ? (
              <>
                <input
                  type="text"
                  value={newUsername}
                  onChange={handleUsernameChange}
                  className="username-input"
                  maxLength={32}
                  autoFocus
                  onBlur={() => setEditing(false)}
                  style={{ width: "8em" }}
                />
                <button
                  className="username-btn save"
                  type="submit"
                  title="Save"
                >✔</button>
                <button
                  className="username-btn cancel"
                  type="button"
                  onClick={() => { setEditing(false); setNewUsername(username); setError(''); }}
                  title="Cancel"
                >✖</button>
              </>
            ) : (
              <>
                <h3 className="username-display">{username || 'No Username'}</h3>
                <button
                  className="username-btn edit"
                  type="button"
                  onClick={() => { setEditing(true); setError(''); }}
                  title="Edit Username"
                ><FaEdit/></button>
              </>
            )}
          </form>
          <span className="profile-status">
            <FaCircle color="#00d26a" size={10} /> Online
          </span>
          {error && <span className="username-error">{error}</span>}
        </div>
      </div>

      <div className="Chatlist-dropdown-section" onClick={toggleDropdown}>
        <span>Recent Chats</span>
        <IoMdArrowDropdown size={22} style={{ transform: Dropdown ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }} />
      </div>
      <div style={{ padding: '0 1em', marginBottom: '1em' }}>
        <input
          type="text"
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          placeholder="New room name"
          style={{ width: '100%', borderRadius: '8px', padding: '0.3em' }}
        />
        <button className='recent-chat-create' onClick={handleCreateRoom}>Create/Join</button>
      </div>
      {Dropdown && (
        <div className="Chatlist-recent-section">
          <Recentchatcontainer onRoomSelect={setRoom} currentRoom={room} />
        </div>
      )}
    </div>
  );
}

export default Chatlist;