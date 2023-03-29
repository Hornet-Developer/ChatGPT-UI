"use client";
import { useEffect, useState } from 'react';
import { Source_Serif_Pro } from 'next/font/google'

const inter = Source_Serif_Pro({ subsets: ['latin'],weight:"400" })

const base_url = process.env.NEXT_PUBLIC_BASE_URL

const Chatbot = () => {
    const [chat_id, setChatId] = useState("");
    const [id, setId] = useState("");
    const [inputMessage, setInputMessage] = useState("")
    const [isFetching, setIsFetching] = useState(false)

    const [messages, setMessages] = useState([
        { content: "Hi! What can I answer for you today?", role: 'assistant' }
    ]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const id = params.get("id")
        setId(id)
        fetch(`${base_url}/api/chats?id=${id}&chat_id=${chat_id}`)
            .then(response => response.json())
            .then(data => setMessages([...messages, ...data]))
            .catch(error => console.error(error));

        document.getElementById('input1').addEventListener("keypress", function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (document.querySelector('input').value!==""){
                    document.getElementById('myBtn').click();
                }
            }
        })

    }, [])

    const handleChatResponse = (message, answer, chat_id) => {
        document.getElementById('loading').style.display = "none"
        setMessages([...messages,
            ...[{ "content": answer, "role": "assistant" },]
        ])
        setChatId(chat_id)
        setInputMessage("")
        setIsFetching(false)
    }

    useEffect(()=>{
        if (isFetching){
            console.log("fetching...")
            document.getElementById('loading').style.display = "flex";

            // let data = {
            //     answer: 'Here is response #' + Math.random(),
            //     chat_id: 100
            // }
            // setTimeout(() => {
            //     handleChatResponse(inputMessage, data.answer, data.chat_id)
            //     document.getElementById('loading').style.display = "none";
            // }, 2000)

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id, chat_id: chat_id, query: inputMessage })
            };

            const dataFetch = async () => {
                const data = await (
                    await fetch(
                        `${base_url}/api/chat`, requestOptions
                    )
                ).json();
                handleChatResponse(inputMessage,data.answer, data.chat_id)
            }
            dataFetch()

            document.getElementById('input1').value = '';
        }

    },[isFetching])

    useEffect(()=>{
        if (inputMessage){
            setMessages([...messages, { "content": inputMessage, "role": 'user' }])
            setIsFetching(true)
        }
    },[inputMessage])

    const handleSendMessageMock = (message) => {
        if (!inputMessage){
            setInputMessage(message)
        }
    }

    const loadingDiv = () => {
        return (<span className="loader"></span>);
    }

    return (
        <div className={inter.className}>
            <div className="chat-container">
                {/* Render the messages */}
                <div>
                    <div className='chat-content'>
                        {messages.map((message, index) => (
                            <div key={index} className={`message ${message.role === 'user' ? 'user' : 'bot'}`}>
                                {message.content}
                            </div>
                        ))}
                    </div>

                    <div id='loading' style={{ 'display': 'none' }}>
                        <span className="loader"></span>
                    </div>
                </div>
                <div>
                    {/* Input for sending messages */}
                    <div className="help-box-container">
                        <div className="help-box" onClick={() => handleSendMessageMock("What questions can you answer for me?")}> What questions can you answer for me? </div>
                    </div>
                    <div className="input-container">
                        <input
                            id='input1'
                            type="text"
                            className="input-text"
                            placeholder="Type your message here..."

                        />
                        <button id='myBtn' className="send-button" onClick={() => handleSendMessageMock(document.querySelector('input').value)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="1.25rem" height="1.25rem"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"></path></svg></button>
                    </div>
                    {/* Powered by Abhi */}
                    <div className="powered-by-container">
                        <span>Powered by Zeus</span>
                    </div>
                </div>

                {/* Style options */}
                <style jsx>{`
              body {
                margin: 0;
                padding: 0.5rem;
              }

              .chat-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background-color: #ffffff;
                width: 100%;
                height: calc(100vh - 0.5rem);
              }

              .chat-content {
                overflow-y: scroll;
                -ms-overflow-style: none;
                scrollbar-width: none;
                border-radius: 8px;
                font-size: 1rem;
                line-height: 1.75;
                display: flex;
                flex-direction: column;
              }

              .chat-content::-webkit-scrollbar {
                display: none;
              }

              .message {
                border-radius: 4px;
                padding: 8px;
                margin-bottom: 8px;
                word-wrap: break-word;
                overflow-wrap: anywhere;
                text-align: left;
              }

              .message.user {
                background-color: rgb(79, 69, 228);
                color: white;
                align-self: flex-end;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                margin-bottom: 0.5rem;
                margin-left: 10%;
              }

              .message.bot {
                background-color: #f4f4f5;
                color: #4b5563;
                align-self: flex-start;
                border-radius: 0.5rem;
                padding: 0.75rem 1rem;
                margin-bottom: 0.5rem;
                margin-right: 10%;
              }

              .input-container {
                display: flex;
                margin-top: 0.5rem;
                bottom: 25px;
                background-color: white;
                z-index: 1;
                padding: 4px 4px 4px 12px;
                border-radius: 0.25rem;
                border: 1px solid #e4e4e7;
                align-item: center;
              }

              input[type=text] {
                flex: 1 1 0%;
                padding: 0;
                margin: 0;
                line-height: 1.25rem;
                font-size: .875rem;
                border: unset;
                height: 36px
              }

              input[type=text]:focus {
                outline: 2px solid transparent;
                outline-offset: 2px;
              }

              .send-button {
                border: unset;
                background: unset;
              }

              .help-box-container {
                display: flex;
                flex-wrap: wrap;
                justify-content: left;
                gap: 8px;
                margin-bottom: 15px;
                margin-left: 2px;
                bottom: 50px; /* height of the input container */
              }

              .help-box {
                background-color: white;
                border: 1px solid #ccc;
                border-radius: 4px;
                padding: 8px;
                text-align: center;
                cursor: pointer;
                z-index: 1;
                margin-top: 50px
              }
              .powered-by-container {
                display: flex;
                justify-content: left;
                align-items: center;
                font-size: 10px;
                margin-top: 0.5rem;
                color: #999;
                bottom: 5px;
                margin-bottom: 0.5rem;
              }

              .loader {
                width: 64px;
                height: 44px;
                position: relative;
                border: 5px solid #959394;
                border-radius: 8px;
              }
              .loader::before {
                content: '';
                position: absolute;
                width: 32px;
                height: 28px;
                border-radius: 50% 50% 0 0;
                left: 50%;
                top: 0;
                transform: translate(-50% , -100%)

              }
              .loader::after {
                content: '';
                position: absolute;
                transform: translate(-50% , -50%);
                left: 50%;
                top: 50%;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #959394;
                box-shadow: 16px 0 #959394, -16px 0 #959394;
                animation: flash 0.5s ease-out infinite alternate;
              }

              @keyframes flash {
                0% {
                  background-color: rgba(149, 147,148, 0.25);
                  box-shadow: 16px 0 rgba(149, 147,148, 0.25), -16px 0 rgba(149, 147,148,, 1);
                }
                50% {
                  background-color: rgba(149, 147,148, 1);
                  box-shadow: 16px 0 rgba(149, 147,148, 0.25), -16px 0 rgba(149, 147,148, 0.25);
                }
                100% {
                  background-color: rgba(149, 147,148, 0.25);
                  box-shadow: 16px 0 rgba(149, 147,148, 1), -16px 0 rgba(149, 147,148, 0.25);
                }
              }

            `}</style>

            </div>
        </div>

    );
};

export default Chatbot;
