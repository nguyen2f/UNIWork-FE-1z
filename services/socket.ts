import { Client } from "@stomp/stompjs"
import SockJS from "sockjs-client"

let stompClient: Client | null = null
let onConnectCallbacks: Array<(client: Client) => void> = []

export const connectSocket = () => {
  if (stompClient && stompClient.connected) {
    console.log("STOMP already connected")
    return stompClient
  }

  // Don't create a new client if one is already activating
  if (stompClient && stompClient.active) {
    return stompClient
  }

  console.log("CONNECTING STOMP...")

  const token = typeof window !== "undefined" ? localStorage.getItem("Authorization") : null

  const wsUrl =
    process.env.NEXT_PUBLIC_WS_URL ||
    (process.env.NEXT_PUBLIC_API_BASE_URL
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/ws-chat`
      : "http://localhost:8297/ws-chat")

  stompClient = new Client({
    webSocketFactory: () => new SockJS(wsUrl),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    debug: (str) => console.log("STOMP:", str),
  })

  stompClient.onConnect = () => {
    console.log("✅ STOMP CONNECTED")
    // Execute all pending onConnect callbacks
    onConnectCallbacks.forEach((cb) => {
      try {
        cb(stompClient!)
      } catch (e) {
        console.error("STOMP onConnect callback error:", e)
      }
    })
  }

  stompClient.onStompError = (frame) => {
    console.error("❌ STOMP ERROR:", frame)
  }

  stompClient.onWebSocketClose = () => {
    console.log("🔌 STOMP WebSocket closed")
  }

  stompClient.activate()
  return stompClient
}

export const getStompClient = () => stompClient

/**
 * Register a callback that fires when the STOMP client connects (or immediately if already connected).
 * Returns an unsubscribe function.
 */
export const onSocketConnected = (callback: (client: Client) => void): (() => void) => {
  // If already connected, fire immediately
  if (stompClient && stompClient.connected) {
    try {
      callback(stompClient)
    } catch (e) {
      console.error("STOMP onConnect callback error:", e)
    }
  }

  // Also register for future reconnections
  onConnectCallbacks.push(callback)

  return () => {
    onConnectCallbacks = onConnectCallbacks.filter((cb) => cb !== callback)
  }
}

export const disconnectSocket = () => {
  if (stompClient) {
    stompClient.deactivate()
    stompClient = null
    onConnectCallbacks = []
    console.log("STOMP DISCONNECTED")
  }
}
