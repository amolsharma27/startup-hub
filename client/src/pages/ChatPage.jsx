import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { FiMessageSquare, FiSend, FiUsers, FiHash } from 'react-icons/fi';

const ChatPage = ({ user, showToast }) => {
  const [socket,          setSocket]          = useState(null);
  const [messages,        setMessages]        = useState([]);
  const [text,            setText]            = useState('');
  const [startups,        setStartups]        = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [loading,         setLoading]         = useState(true);
  const messagesEndRef = useRef(null);

  /* Auto-scroll to bottom */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  /* Fetch user's startups */
  useEffect(() => {
    const fetchStartups = async () => {
      if (!user) return;
      try {
        const data = await api.get('/startups');
        const all  = data.startups || [];
        const myId = user?.id || user?._id;
        const mine = all.filter(
          (s) =>
            s.founder?._id === myId ||
            s.founder       === myId ||
            s.teamMembers?.some((m) => m._id === myId || m === myId)
        );
        setStartups(mine);
        if (mine.length > 0) setSelectedStartup(mine[0]._id);
      } catch (err) {
        showToast?.(err.message || 'Failed to load startups', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStartups();
  }, [user]);

  /* Socket connection */
  useEffect(() => {
    const newSocket = io('/', { transports: ['websocket', 'polling'] });
    setSocket(newSocket);
    newSocket.on('newMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => newSocket.close();
  }, [selectedStartup]);

  /* Load history + join room when startup changes */
  useEffect(() => {
    if (!selectedStartup) return;
    const loadHistory = async () => {
      try {
        const data = await api.get(`/messages/${selectedStartup}`);
        setMessages(data.messages || []);
      } catch (err) {
        showToast?.(err.message || 'Failed to load chat history', 'error');
      }
    };
    loadHistory();
    if (socket) socket.emit('joinStartup', selectedStartup);
  }, [selectedStartup, socket]);

  const handleSend = async () => {
    if (!text.trim() || !socket || !selectedStartup) return;
    try {
      const data   = await api.get('/auth/me');
      const userId = data.user?._id || data.user?.id || user?.id;
      if (!userId) { showToast?.('Please login again', 'error'); return; }
      socket.emit('sendMessage', { startupId: selectedStartup, senderId: userId, text });
      setText('');
    } catch (err) {
      showToast?.(err.message || 'Failed to send message', 'error');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const selectedStartupInfo = startups.find((s) => s._id === selectedStartup);
  const selectedName = selectedStartupInfo?.name || 'Chat';

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="skeleton h-8 w-40 rounded-xl" />
          <div className="skeleton h-[500px] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-2xl font-extrabold text-heading mb-0.5">Team Chat</h1>
          <p className="text-sm text-muted">Real-time messaging with your startup teams</p>
        </div>

        {/* ── No teams empty state ── */}
        {startups.length === 0 ? (
          <div className="card p-14 text-center animate-fade-in">
            <div className="icon-tile icon-tile-blue w-16 h-16 rounded-2xl mx-auto mb-4">
              <FiMessageSquare size={24} />
            </div>
            <h3 className="text-base font-semibold text-heading mb-1.5">No teams yet</h3>
            <p className="text-sm text-muted mb-5">
              You're not part of any startup team. Join or create a startup to start chatting.
            </p>
            <Link to="/startups" className="btn-primary text-sm">Browse Startups</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[240px_1fr_220px] md:grid-cols-[220px_1fr] grid-cols-1 gap-4 h-[calc(100vh-14rem)] min-h-[480px] animate-fade-in-up" style={{ animationDelay: '60ms' }}>

            {/* ── Sidebar: team selector ── */}
            <div className="card p-4 flex flex-col overflow-hidden">
              <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 flex items-center gap-1.5 px-1">
                <FiUsers size={12} /> Your Teams
              </p>
              <div className="space-y-1 overflow-y-auto flex-1">
                {startups.map((s) => {
                  const active = selectedStartup === s._id;
                  return (
                    <button
                      key={s._id}
                      onClick={() => setSelectedStartup(s._id)}
                      className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'dark:bg-primary-500/15 dark:text-primary-400 dark:border dark:border-primary-500/25 light:bg-primary-50 light:text-primary-600 light:border light:border-primary-200'
                          : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0
                        ${active ? 'bg-primary-500' : 'bg-gradient-to-br from-primary-500 to-accent-500'}`}>
                        {s.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">{s.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Chat area ── */}
            <div className="card flex flex-col overflow-hidden">
              {/* Chat header */}
              <div className="px-5 py-3.5 border-b dark:border-secondary-800/60 light:border-secondary-200 flex items-center gap-3 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-success-500 animate-ping-slow" />
                <FiHash size={15} className="text-muted" />
                <span className="text-sm font-semibold text-heading">{selectedName}</span>
                <span className="text-xs text-muted ml-auto">Live</span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="icon-tile icon-tile-blue w-14 h-14 rounded-2xl mb-3">
                      <FiMessageSquare size={20} />
                    </div>
                    <p className="text-sm font-medium text-heading mb-1">No messages yet</p>
                    <p className="text-xs text-muted">Be the first to say something!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const senderId = msg.sender?._id || msg.sender;
                    const isMe     = senderId === user?.id || senderId === user?._id;
                    const name     = msg.sender?.name;
                    const time     = msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : '';

                    return (
                      <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2.5`}>
                        {/* Avatar (other users) */}
                        {!isMe && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-auto mb-1">
                            {name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}

                        <div className={`max-w-[72%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                          {!isMe && name && (
                            <span className="text-[10px] text-muted mb-0.5 px-1">{name}</span>
                          )}
                          <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isMe
                              ? 'bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-br-sm'
                              : 'dark:bg-secondary-800/70 light:bg-secondary-100 dark:text-secondary-200 light:text-secondary-800 rounded-bl-sm border dark:border-secondary-700/50 light:border-secondary-200'
                          }`}>
                            {msg.text}
                          </div>
                          {time && (
                            <span className="text-[10px] text-muted mt-0.5 px-1">{time}</span>
                          )}
                        </div>

                        {/* Avatar (own messages) */}
                        {isMe && (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 mt-auto mb-1">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div className="border-t dark:border-secondary-800/60 light:border-secondary-200 p-3 md:p-4 flex gap-3 flex-shrink-0">
                <input
                  className="input-field flex-1 text-sm"
                  placeholder={`Message #${selectedName.toLowerCase()}…`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim()}
                  className="btn-primary !px-4 flex-shrink-0 disabled:opacity-50"
                  title="Send message"
                >
                  <FiSend size={16} />
                  <span className="hidden sm:inline text-sm">Send</span>
                </button>
              </div>
            </div>

            {/* ── Group Members Sidebar ── */}
            {selectedStartupInfo && (
              <div className="card p-4 flex flex-col overflow-hidden hidden lg:flex animate-fade-in">
                <p className="text-xs font-semibold text-heading uppercase tracking-wider mb-4 flex items-center gap-1.5 px-1 border-b dark:border-secondary-800/60 light:border-secondary-200 pb-3 flex-shrink-0">
                  <FiUsers size={13} className="text-primary-400" />
                  Members ({1 + (selectedStartupInfo.teamMembers?.length || 0)})
                </p>
                <div className="space-y-4 overflow-y-auto flex-1 pr-1">
                  {/* Founder */}
                  <div>
                    <p className="text-[9px] font-extrabold text-primary-500 uppercase tracking-widest mb-2 px-1">Founder</p>
                    <Link
                      to={`/users/${selectedStartupInfo.founder?._id || selectedStartupInfo.founder}`}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:dark:bg-secondary-800/50 hover:light:bg-secondary-100/80 transition-colors duration-200"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden animate-scale-in">
                        {selectedStartupInfo.founder?.profilePhoto ? (
                          <img src={selectedStartupInfo.founder.profilePhoto} alt={selectedStartupInfo.founder?.name} className="w-full h-full object-cover" />
                        ) : (
                          selectedStartupInfo.founder?.name?.charAt(0).toUpperCase() || 'F'
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-heading truncate">{selectedStartupInfo.founder?.name || 'Founder'}</p>
                      </div>
                    </Link>
                  </div>

                  {/* Team Members */}
                  <div>
                    <p className="text-[9px] font-extrabold text-accent-500 uppercase tracking-widest mb-2 px-1">Team</p>
                    {!selectedStartupInfo.teamMembers?.length ? (
                      <p className="text-[11px] text-muted italic px-1.5">No members yet</p>
                    ) : (
                      <div className="space-y-1.5">
                        {selectedStartupInfo.teamMembers.map((m) => (
                          <Link
                            key={m._id}
                            to={`/users/${m._id}`}
                            className="flex items-center gap-2 p-1.5 rounded-xl hover:dark:bg-secondary-800/50 hover:light:bg-secondary-100/80 transition-colors duration-200"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden animate-scale-in">
                              {m.profilePhoto ? (
                                <img src={m.profilePhoto} alt={m.name} className="w-full h-full object-cover" />
                              ) : (
                                m.name?.charAt(0).toUpperCase() || 'M'
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-heading truncate">{m.name}</p>
                              <p className="text-[10px] text-muted truncate capitalize">{m.role || 'Member'}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
