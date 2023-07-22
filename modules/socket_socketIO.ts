import { Server } from "socket.io";
import http from "http";

const initSocketIO = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
) => {
  const io = new Server(server, {
    path: "/socket.io",
    transports: ["websocket"],
  }); // path 클라이언트도 같아야함.

  io.on("connection", (socket) => {
    const req = socket.request;

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    console.log("새로운 클라이언트 접속 io :: ", ip, socket.id);

    socket.on("disconnect", () => {
      console.log("클라이언트 접속 종료 io :: ", ip, socket.id);
      clearInterval(interval);
    });

    socket.on("error", (err) => {
      console.error(err);
    });

    // 커스텀
    socket.on("reply", (data) => {
      console.log(data, "from client");
    });
    const interval = setInterval(() => {
      socket.emit("news", "매 3초 뉴스(news) 발송");
    }, 3000);
  });
};

export default initSocketIO;
