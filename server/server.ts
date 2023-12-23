import Fastify from "fastify";
import websocket, { SocketStream } from "@fastify/websocket";
import cors from "@fastify/cors";

async function buildServer() {
    const app = Fastify();
    await app.register(cors, {
        origin: `http://localhost:5173`,
        methods: ["GET", "POST"],
    });
    await app.register(websocket);

    const messages: string[] = ["Welcome to chat!"];

    app.get(
        "/ws",
        { websocket: true },
        function wsHandler(connection: SocketStream, req) {
            connection.setEncoding("utf8");
            console.info("Client connected");

            connection.socket.on("close", () => {
                console.info("Client disconnected");
            });

            connection.socket.on("message", (message: string) => {
                messages.push(message.toString());

                app.websocketServer.clients.forEach((client) => {
                    if (client.readyState === 1) {
                        client.send(message.toString());
                    }
                });
            });
        }
    );

    return app;
}

async function main() {
    const app = await buildServer();

    try {
        await app.listen({ port: 3000 });
        console.log(`🚀 Server running at: http://localhost:3000`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

main();
