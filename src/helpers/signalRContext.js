import React, { createContext, useEffect } from 'react'
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import { getAccessToken, getUserInfo } from './../helpers'

const SignalRContext = createContext()

const SignalRProvider = ({ children }) => {
    const user = getUserInfo()
    const token = getAccessToken()
    const URL = `http://localhost:54568/notify`
    const connection = new HubConnectionBuilder()
        .withUrl(URL, {
            headers: { "Authorization": `${token}` },
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build()


    connection.onclose((error) => {
        // Thực hiện các hành động tại đây khi kết nối bị đóng, ví dụ: thử kết nối lại
    });

    connection.onreconnecting((error) => {
        // Thực hiện các hành động tại đây khi đang thử kết nối lại
    });

    connection.onreconnected((connectionId) => {
        // Thực hiện các hành động tại đây khi kết nối đã được khôi phục
        connection.invoke("OnConnected", user.accountCompanyId);
    });

    const checkNegotiate = async () => {
        try {
            await connection.start()
                .then(async () => {
                    await connection.invoke("OnConnected", user.accountCompanyId);
                    connection.on('notify', (message) => {
                        console.log(message)
                    })
                })
                .catch((error) => {
                    console.log(`Error starting SignalR connection: ${error}`)
                    // validateResponse({ status: EStatusResponse.unauthorized })
                });
        } catch (error) {
            console.error('Error requesting negotiate:', error);
        }
    };

    useEffect(() => {
        window.onbeforeunload = (event) => {
            // event.preventDefault();
            // console.log('unload')
            // console.log(connection)
            // await connection.invoke("OnConnected");
            if (connection) {
                // connection.stop()
                connection.invoke("OnDisConnected", user.accountCompanyId);
                connection.stop()
            }
            return undefined
        }

        checkNegotiate()

        return () => {
            if (connection) {
                // connection.stop()
            }
        }
    }, [])

    return (
        <SignalRContext.Provider value={connection}>
            {children}
        </SignalRContext.Provider>
    )
}

export { SignalRContext, SignalRProvider }