import React, { createContext, useEffect } from 'react'
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr'
import { getAccessToken } from './../helpers'
import { validateResponse } from 'services'

const SignalRContext = createContext()

const SignalRProvider = ({ children }) => {
    const token = getAccessToken()
    const URL = `${process.env.REACT_APP_API_URL}/notify`
    const connection = new HubConnectionBuilder()
        .withUrl(URL, {
            headers: { "Authorization": `Bearer ${token}` }
        })
        .build()

    connection.onreconnecting((error) => {
        connection.options.headers = {
            Authorization: `Bearer ${token}`
        };
    });

    const checkNegotiate = async () => {
        try {
            const response = await fetch(`${URL}/negotiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({}),
            });

            if (response.status === 200) {
                connection.start()
                    .then(() => {
                    })
                    .catch((error) => console.error('Error starting SignalR connection:', error));
            } else {
                validateResponse(response);
            }
        } catch (error) {
            console.error('Error requesting negotiate:', error);
        }
    };

    const handleBeforeUnload = (event) => {
        // Xử lý logic trước khi trang được tải lại
        event.preventDefault();
        // event.returnValue = ''; // Thông báo cho trình duyệt không thoát trang
        if (connection) {
            connection.stop()
        }
        return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    useEffect(() => {
        checkNegotiate()

        return () => {
            if (connection) {
                connection.stop()
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
