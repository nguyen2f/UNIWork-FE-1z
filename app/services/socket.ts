import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: Client | null = null

export const connectSocket = () => {
    if (stompClient && stompClient.connected) return stompClient

    const socket = new SockJS("http://localhost:8297/ws-chat")

    stompClient = new Client({
        webSocketFactory: () => socket as any,
        reconnectDelay: 5000,
        debug: (str) => console.log("[STOMP]", str),
    })

    stompClient.activate()
    return stompClient
}

export const getStompClient = () => stompClient

export const disconnectSocket = () => {
    if (stompClient) {
        stompClient.deactivate()
        stompClient = null
    }
}
