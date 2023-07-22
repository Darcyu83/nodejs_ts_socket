import { WebSocket } from "ws";
import http from "http";

const Socket = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    console.log(" 새로운 클라이언트 접속 ::", ip);

    ws.on("message", (data) => {
      // 클라이언트가 보낸 메시지
      console.log("on message :: ", data.toString());
    });

    ws.on("error", (err) => {
      console.error(err);
    });

    ws.on("close", () => {
      console.log("클라이언트 접속 해제 :: ", ip);

      clearInterval(wsInterval);
    });

    let cnt = 0;

    const wsInterval = setInterval(() => {
      if (ws.readyState === ws.OPEN) {
        ws.send(`test: Hi threre from server ${cnt++}`);
      }
    }, 3000);
  });
};

export default Socket;
