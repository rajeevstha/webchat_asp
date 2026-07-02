import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export async function startSignalR() {
    if (connection) {
        return connection;
    }
    
    const token = localStorage.getItem("accessToken");

    connection = new signalR.HubConnectionBuilder()
        .withUrl("http://localhost:5107/chatHub", {
            accessTokenFactory: () => token ?? "",
            withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

    connection.onclose(() => {
        console.log("Disconnected");
    });

    connection.onreconnecting(() => {
        console.log("Reconnecting...");
    });

    connection.onreconnected(() => {
        console.log("Connected again");
    });

    await connection.start();

    console.log("SignalR Connection initiated");

    return connection;
}

export function getConnection() {
    return connection;
}