// Chatbot component 
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chatbot.css';
import imageUrl from './assets/cello.png'

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [visible, setVisible] = useState(true);
    const conversationRef = useRef(null);

    const sendMessage = async () => {
        if (userInput.trim()) {
            const newConversation = [...conversation, { text: userInput, sender: 'user' }];
            setConversation(newConversation);
            setUserInput('');
            try {
                const response = await axios.post('http://localhost:8000/api/chatbot/', { message: userInput });
                setConversation([...newConversation, { text: response.data.message, sender: 'bot' }]);
            } catch (error) {
                console.error('Error sending message:', error);
                setConversation([...newConversation, { text: 'Error: Unable to get a response from the server.', sender: 'bot' }]);
            }
        }
    };

    useEffect(() => {
        if (conversationRef.current) {
            conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
        }
    }, [conversation]);

    return (
        <>
            {visible && (
                <div className="chatbot-container">
                    <button className="toggle-button" onClick={() => setVisible(false)}>
                        Hide
                    </button>
                    <img src={imageUrl} alt="Logo" className="logo" />
                    <h1>Chat with our AI Bot</h1>
                    <div className="conversation" ref={conversationRef}>
                        {conversation.map((message, index) => (
                            <p key={index} className={message.sender}>
                                {message.text}
                            </p>
                        ))}
                    </div>
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                    <p className="powered-by">Jacqueline Taylor & Friends</p>
                </div>
            )}
            {!visible && (
                <button className="plus-button" onClick={() => setVisible(true)}>
                    +
                </button>
            )}
        </>
    );
};

export default Chatbot;
