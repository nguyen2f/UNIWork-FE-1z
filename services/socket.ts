import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: Client | null = null

export const connectSocket = () => {
  if (stompClient && stompClient.connected) {
    console.log("STOMP already connected")
    return stompClient
  }

  console.log("CONNECTING STOMP...")

  stompClient = new Client({
    webSocketFactory: () => new SockJS("http://localhost:8297/ws-chat"),
    reconnectDelay: 5000,
    debug: (str) => console.log("STOMP:", str),
  })

  stompClient.onConnect = () => {
    console.log("✅ STOMP CONNECTED")
  }

  stompClient.onStompError = (frame) => {
    console.error("❌ STOMP ERROR:", frame)
  }

  stompClient.activate()
  return stompClient
}

export const getStompClient = () => stompClient

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    console.log("STOMP DISCONNECTED")
  }
}
