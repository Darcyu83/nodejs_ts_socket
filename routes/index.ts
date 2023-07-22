import express from "express";

const indexRouter = express.Router();

indexRouter.get("/", (req, res) => {
  res.status(200).json({ code: 200, message: "하이" });
});
export default indexRouter;
