import React, { useEffect, useState, useRef, useCallback } from "react";
import { FaVideo, FaPaperPlane, FaTrash, FaArrowLeft } from "react-icons/fa";
import { reusableColor } from "../ReusableComponent/reusableColor";
import VideoCallModal from "./VideoCall";
import { io } from "socket.io-client";
import axios from "axios";
import { BASE_URL } from "../../utils/config.js";
import { v4 as uuidv4 } from "uuid";

// Initialize socket outside component to prevent reconnections
let socket = null;

const CallCenter = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [userList, setUserList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    
    // Store all chats in memory to prevent losing messages when switching
    const [allChats, setAllChats] = useState({});
    
    const chatContainerRef = useRef(null);
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem("user_id");
    const userRole = parseInt(localStorage.getItem("role"));

    const isChild = userRole === 2;
    const isStaff = userRole === 1;
    const myId = userId;

    console.log("User details:", { userId, userRole, isChild, isStaff });

    // Generate chat room ID consistently
    const generateChatRoomId = useCallback((childId, teacherId) => {
        return `chat_${Math.min(childId, teacherId)}_${Math.max(childId, teacherId)}`;
    }, []);

    // Get current chat room ID
    const getCurrentChatRoomId = useCallback(() => {
        if (!selectedUser) return null;
        const childId = isChild ? myId : selectedUser.user_id;
        const teacherId = isChild ? selectedUser.user_id : myId;
        return generateChatRoomId(childId, teacherId);
    }, [selectedUser, isChild, myId, generateChatRoomId]);

    // Initialize socket connection
    useEffect(() => {
        if (!socket && myId && userRole) {
            socket = io("https://childcare-backend-production-14ca.up.railway.app", {
                transports: ['websocket', 'polling'],
                timeout: 20000,
                forceNew: true
            });

            socket.on('connect', () => {
                console.log('Socket connected:', socket.id);
                setIsConnected(true);
                
                // Join user to their personal room
                socket.emit("join_user_room", { 
                    userId: myId, 
                    userRole: userRole,
                    socketId: socket.id 
                });
            });

            socket.on('disconnect', () => {
                console.log('Socket disconnected');
                setIsConnected(false);
            });

            socket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            // Handle receiving messages via socket - FIXED VERSION
            const handleReceiveMessage = (msg) => {
                console.log("Received message via socket:", msg);
                
                const messageRoomId = msg.roomId || generateChatRoomId(msg.childId, msg.teacherId);
                
                // Ensure message has required fields
                const processedMessage = {
                    ...msg,
                    messageId: msg.messageId || uuidv4(),
                    created_at: msg.created_at || new Date().toISOString(),
                    roomId: messageRoomId
                };
                
                // Update allChats - FIXED to properly update state
                setAllChats(prevAllChats => {
                    const roomMessages = prevAllChats[messageRoomId] || [];
                    
                    // Check if message already exists
                    const exists = roomMessages.some(m => 
                        m.messageId === processedMessage.messageId || 
                        (m.message === processedMessage.message && 
                         Math.abs(new Date(m.created_at) - new Date(processedMessage.created_at)) < 1000)
                    );
                    
                    if (exists) {
                        console.log("Message already exists, skipping");
                        return prevAllChats;
                    }
                    
                    const updatedMessages = [...roomMessages, processedMessage];
                    console.log(`Updated messages for room ${messageRoomId}:`, updatedMessages);
                    
                    return {
                        ...prevAllChats,
                        [messageRoomId]: updatedMessages
                    };
                });
                
                // Update current chat if it's the active one - FIXED
                setCurrentChatRoom(currentRoom => {
                    if (currentRoom === messageRoomId) {
                        setChatMessages(prevMessages => {
                            const exists = prevMessages.some(m => 
                                m.messageId === processedMessage.messageId ||
                                (m.message === processedMessage.message && 
                                 Math.abs(new Date(m.created_at) - new Date(processedMessage.created_at)) < 1000)
                            );
                            
                            if (exists) {
                                return prevMessages;
                            }
                            
                            console.log("Adding message to current chat");
                            return [...prevMessages, processedMessage];
                        });
                    }
                    return currentRoom;
                });
            };

            // Listen to multiple event names that your backend might emit
            socket.on("receive_message", handleReceiveMessage);
            socket.on("new_message", handleReceiveMessage);
            socket.on("message_sent", handleReceiveMessage);
            socket.on("chat_message", handleReceiveMessage); // Another common event name

            // Cleanup function for socket events
            const cleanupSocketEvents = () => {
                socket.off("receive_message", handleReceiveMessage);
                socket.off("new_message", handleReceiveMessage); 
                socket.off("message_sent", handleReceiveMessage);
                socket.off("chat_message", handleReceiveMessage);
            };

            return cleanupSocketEvents;
        }

        return () => {
            // Don't disconnect socket on component unmount
            // socket?.disconnect();
        };
    }, [myId, userRole, generateChatRoomId]);

    // Auto scroll to bottom
    const scrollToBottom = useCallback(() => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, scrollToBottom]);

    // Load chat history from API
    const loadChatHistory = async (childId, teacherId) => {
        setIsLoading(true);
        const roomId = generateChatRoomId(childId, teacherId);
        
        try {
            console.log(`Loading chat history for child: ${childId}, teacher: ${teacherId}`);
            
            const response = await axios.get(
                `${BASE_URL}/child-callCentre/chat-history/${childId}/${teacherId}`
            );
            
            console.log("API Response:", response.data);
            
            // Your API returns array directly
            const messages = Array.isArray(response.data) ? response.data : [];
            
            // Transform backend data to match frontend expected format
            const transformedMessages = messages.map(msg => ({
                messageId: msg.id || msg.message_id || uuidv4(),
                message: msg.message,
                created_at: msg.created_at,
                sender: msg.sender === 'child' ? childId : teacherId,
                sender_id: msg.sender === 'child' ? childId : teacherId,
                senderRole: msg.sender === 'child' ? 2 : 1,
                childId: childId,
                teacherId: teacherId,
                roomId: roomId
            }));
            
            console.log("Transformed messages:", transformedMessages);
            
            // Store in allChats and set current chat
            setAllChats(prev => ({
                ...prev,
                [roomId]: transformedMessages
            }));
            
            setChatMessages(transformedMessages);
            
        } catch (err) {
            console.error("Error loading chat history:", err.response || err);
            
            // Set empty array for this chat room
            setAllChats(prev => ({
                ...prev,
                [roomId]: []
            }));
            setChatMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle sending messages
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) {
            console.log("Cannot send message:", { newMessage: newMessage.trim(), selectedUser });
            return;
        }

        const childId = isChild ? myId : selectedUser.user_id;
        const teacherId = isChild ? selectedUser.user_id : myId;
        const roomId = generateChatRoomId(childId, teacherId);

        // Create message for frontend display
        const frontendMessage = {
            messageId: uuidv4(),
            message: newMessage.trim(),
            created_at: new Date().toISOString(),
            sender: myId,
            sender_id: myId,
            senderRole: userRole,
            childId: childId,
            teacherId: teacherId,
            roomId: roomId
        };

        // Create payload for backend API (matches your backend structure)
        const backendPayload = {
            child_id: parseInt(childId),
            teacher_id: parseInt(teacherId),
            sender_type: isChild ? 'child' : 'teacher',
            message: newMessage.trim()
        };

        console.log("Sending message:", { frontendMessage, backendPayload });

        try {
            // Add to local state immediately (optimistic update) - MOVED BEFORE API CALL
            const newMessages = [...(allChats[roomId] || []), frontendMessage];
            setAllChats(prev => ({
                ...prev,
                [roomId]: newMessages
            }));
            setChatMessages(newMessages);
            setNewMessage(""); // Clear input immediately

            // Save to database via your existing API
            const response = await axios.post(`${BASE_URL}/child-callCentre/chat`, backendPayload);
            console.log("Message saved to DB:", response.data);

            // Send via socket for real-time updates to other users
            if (socket && isConnected) {
                socket.emit("send_message", frontendMessage);
                console.log("Message sent via socket");
            }
            
        } catch (error) {
            console.error("Error sending message:", error);
            
            // Rollback optimistic update on error
            const rollbackMessages = (allChats[roomId] || []).filter(msg => msg.messageId !== frontendMessage.messageId);
            setAllChats(prev => ({
                ...prev,
                [roomId]: rollbackMessages
            }));
            setChatMessages(rollbackMessages);
            setNewMessage(newMessage.trim()); // Restore message input
            
            alert("Failed to send message. Please try again.");
        }
    };

    // Handle user selection
    const handleUserSelect = async (user) => {
        console.log("Selecting user:", user);
        
        setSelectedUser(user);
        clearSelection();
        
        const childId = isChild ? myId : user.user_id;
        const teacherId = isChild ? user.user_id : myId;
        const roomId = generateChatRoomId(childId, teacherId);
        
        setCurrentChatRoom(roomId);

        // Join socket room
        if (socket && isConnected) {
            socket.emit("join_chat_room", { 
                childId, 
                teacherId, 
                roomId,
                userId: myId 
            });
            console.log(`Joined chat room: ${roomId}`);
        }

        // Check if we have messages in memory first
        if (allChats[roomId]) {
            console.log("Loading messages from memory:", allChats[roomId]);
            setChatMessages(allChats[roomId]);
        } else {
            console.log("Loading messages from API");
            setChatMessages([]);
        }
        
        // Always load fresh data from API
        await loadChatHistory(childId, teacherId);
    };

    // Fetch users list
    const fetchUsers = async () => {
        try {
            let endpoint = isChild ? `${BASE_URL}/teachers` : `${BASE_URL}/children`;
            
            console.log("Fetching users from:", endpoint);
            
            const { data } = await axios.get(endpoint);
            
            console.log("Fetched users data:", data);
            
            // Handle your backend response format
            let users = [];
            if (Array.isArray(data)) {
                users = data;
            } else if (data && Array.isArray(data.data)) {
                users = data.data;
            }
            
            // Transform teacher data to match expected format
            if (isChild && users.length > 0) {
                users = users.map(teacher => ({
                    user_id: teacher.user_id,
                    first_name: teacher.first_name || '',
                    last_name: teacher.last_name || '',
                    name: teacher.name || '',
                    initials: teacher.name ? teacher.name.split(' ').map(n => n[0]).join('') : 'T'
                }));
            }
            
            setUserList(users);
            
        } catch (err) {
            console.error("Error fetching users:", err.response || err);
            setUserList([]);
        }
    };

    useEffect(() => {
        if (myId && userRole) {
            fetchUsers();
        }
    }, [myId, userRole]);

    // Selection and deletion handlers
    const toggleSelectMessage = (index) => {
        setSelectedIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index]
        );
    };

    const clearSelection = () => setSelectedIndexes([]);

    const deleteSelectedMessages = async () => {
        if (selectedIndexes.length === 0) return;
        
        try {
            // For now, just delete from frontend since you don't have delete API
            // You can add delete API later if needed
            
            const roomId = getCurrentChatRoomId();
            const filtered = chatMessages.filter((_, i) => !selectedIndexes.includes(i));
            
            setAllChats(prev => ({
                ...prev,
                [roomId]: filtered
            }));
            setChatMessages(filtered);
            clearSelection();
            
            console.log("Messages deleted from frontend only");
            
        } catch (err) {
            console.error("Error deleting messages:", err);
        }
    };

    const formatMessageTime = (timestamp) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return "";
        }
    };

    return (
        <div className="container-fluid py-3">
            <div className="row bg-white shadow-sm rounded" style={{ minHeight: "80vh" }}>
                {/* Left Sidebar */}
                <div className="col-md-4 border-end p-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 style={{ color: reusableColor.customTextColor }}>
                            {isChild ? "Staff Members" : "Children"}
                        </h5>
                        <span className={`badge ${isConnected ? 'bg-success' : 'bg-danger'}`}>
                            {isConnected ? 'Online' : 'Offline'}
                        </span>
                    </div>
                    
                    <ul className="list-group list-group-flush">
                        {userList.length > 0 ? (
                            userList.map((user, index) => (
                                <li
                                    key={user.user_id || index}
                                    className={`list-group-item d-flex align-items-center cursor-pointer ${selectedUser?.user_id === user.user_id ? 'bg-light' : ''}`}
                                    onClick={() => handleUserSelect(user)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                                        style={{ width: 35, height: 35, fontSize: '14px' }}>
                                        {user.initials || 
                                         (user.first_name?.[0] || '') + (user.last_name?.[0] || '') || 
                                         user.name?.[0] || '??'}
                                    </div>
                                    <div>
                                        <div className="fw-semibold">
                                            {user.first_name && user.last_name 
                                                ? `${user.first_name} ${user.last_name}`
                                                : user.name || 'Unknown User'}
                                        </div>
                                        <small className="text-muted">ID: {user.user_id}</small>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item text-muted">
                                No {isChild ? 'staff members' : 'children'} available
                            </li>
                        )}
                    </ul>
                </div>

                {/* Right Chat Panel */}
                <div className="col-md-8 p-3 d-flex flex-column">
                    {selectedUser ? (
                        <>
                            {/* Header */}
                            {selectedIndexes.length > 0 ? (
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaArrowLeft style={{ cursor: "pointer" }} onClick={clearSelection} />
                                        <strong>{selectedIndexes.length} selected</strong>
                                    </div>
                                    <button className="btn btn-danger btn-sm" onClick={deleteSelectedMessages}>
                                        <FaTrash className="me-1" /> Delete
                                    </button>
                                </div>
                            ) : (
                                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                                    <div>
                                        <h5 className="mb-0">
                                            {selectedUser.first_name && selectedUser.last_name 
                                                ? `${selectedUser.first_name} ${selectedUser.last_name}`
                                                : selectedUser.name || 'Unknown User'}
                                        </h5>
                                        <small className="text-muted">
                                            {isChild ? 'Staff Member' : 'Child'} • {isConnected ? 'Online' : 'Offline'}
                                        </small>
                                    </div>
                                    <button
                                        className="btn btn-sm"
                                        style={{
                                            color: reusableColor.customTextColor,
                                            border: `1px solid ${reusableColor.customTextColor}`,
                                            backgroundColor: "white",
                                        }}
                                        onClick={() => setShowVideoModal(true)}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor = reusableColor.customTextColor;
                                            e.target.style.color = "white";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor = "white";
                                            e.target.style.color = reusableColor.customTextColor;
                                        }}
                                    >
                                        <FaVideo className="me-2" />
                                        Video Call
                                    </button>
                                </div>
                            )}

                            {/* Messages Container */}
                            <div 
                                ref={chatContainerRef}
                                className="flex-grow-1 overflow-auto mb-3 px-2" 
                                style={{ maxHeight: "60vh", minHeight: "400px" }}
                            >
                                {isLoading ? (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading chat history...</span>
                                        </div>
                                    </div>
                                ) : chatMessages.length > 0 ? (
                                    <>
                                        {chatMessages.map((msg, i) => {
                                            const isMine = String(msg.sender) === String(myId) || String(msg.sender_id) === String(myId);
                                            const isSelected = selectedIndexes.includes(i);
                                            
                                            return (
                                                <div
                                                    key={msg.messageId || `msg-${i}`}
                                                    className={`mb-3 d-flex ${isMine ? "justify-content-end" : "justify-content-start"}`}
                                                >
                                                    <div
                                                        className={`p-3 rounded-3 position-relative ${
                                                            isMine
                                                                ? isSelected 
                                                                    ? "bg-danger text-white" 
                                                                    : "bg-primary text-white"
                                                                : isSelected 
                                                                    ? "bg-warning text-dark" 
                                                                    : "bg-light border"
                                                        }`}
                                                        style={{ 
                                                            maxWidth: "70%", 
                                                            cursor: "pointer",
                                                            wordWrap: "break-word"
                                                        }}
                                                        onClick={() => toggleSelectMessage(i)}
                                                    >
                                                        <div className="mb-1">{msg.message}</div>
                                                        <small 
                                                            className={`${isMine ? 'text-white-50' : 'text-muted'}`}
                                                            style={{ fontSize: '0.75rem' }}
                                                        >
                                                            {formatMessageTime(msg.created_at)}
                                                        </small>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <div ref={messagesEndRef} />
                                    </>
                                ) : (
                                    <div className="d-flex justify-content-center align-items-center h-100">
                                        <div className="text-center text-muted">
                                            <div className="mb-2">💬</div>
                                            <p>No messages yet. Start the conversation!</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message Input */}
                            <div className="d-flex gap-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    disabled={selectedIndexes.length > 0 || !isConnected}
                                    style={{ borderRadius: '20px' }}
                                />
                                <button
                                    className="btn text-white px-3"
                                    style={{ 
                                        backgroundColor: reusableColor.customTextColor,
                                        borderRadius: '20px'
                                    }}
                                    onClick={handleSendMessage}
                                    disabled={selectedIndexes.length > 0 || !newMessage.trim() || !isConnected}
                                >
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="d-flex justify-content-center align-items-center h-100 text-center">
                            <div>
                                <div className="mb-3" style={{ fontSize: '3rem' }}>💬</div>
                                <h5 className="text-muted">Select a {isChild ? "Staff Member" : "Child"}</h5>
                                <p className="text-muted">Choose someone from the list to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Call Modal */}
            <VideoCallModal
                show={showVideoModal}
                onClose={() => setShowVideoModal(false)}
                teacher={isChild ? selectedUser : {}}
            />
        </div>
    );
};

export default CallCenter;