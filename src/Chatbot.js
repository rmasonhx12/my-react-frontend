
import imageUrl from './assets/cello.png'

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chatbot.css';

const Chatbot = () => {
    const [userInput, setUserInput] = useState('');
    const [conversation, setConversation] = useState([]);
    const [visible, setVisible] = useState(false);  // Set initial visibility to false
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
                <div className="chatbot-container card shadow-lg">
                    <div className="card-body d-flex flex-column">
                        <button className="btn btn-link ml-auto" onClick={() => setVisible(false)}>
                            <img src={imageUrl} alt="Hide" className="logo" />
                        </button>
                        <h5 className="card-title text-center">Jacqueline Taylor & Friends AI Bot</h5>
                        <div className="conversation mb-3 flex-grow-1" ref={conversationRef}>
                            {conversation.map((message, index) => (
                                <p key={index} className={`message ${message.sender}`}>
                                    {message.text}
                                </p>
                            ))}
                        </div>
                        <div className="input-group">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                className="form-control"
                                placeholder="Type a message"
                            />
                            <div className="input-group-append">
                                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
                            </div>
                        </div>
                        <p className="powered-by text-center mt-3">Powered by Bujisoft</p>
                    </div>
                </div>
            )}
            {!visible && (
                <button className="plus-button btn btn-primary rounded-circle" onClick={() => setVisible(true)}>
                    +
                </button>
            )}
        </>
    );
};

export default Chatbot;
