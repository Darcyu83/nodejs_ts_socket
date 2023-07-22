import express from "express";

const indexRouter = express.Router();

indexRouter.get("/ws", (req, res) => {
  res.render("index_ws");
});
indexRouter.get("/io", (req, res) => {
  res.render("index_io");
});
export default indexRouter;
