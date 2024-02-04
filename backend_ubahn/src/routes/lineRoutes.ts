import express from "express";
import { lines } from "../data";

const router = express.Router();

router.get(
  "/",
  /**
   * returns an array of line information from the route "/"":
   *
   * ```json
   * {
   *  "name": "string";
   *  "color": "string";
   * }
   * ```
   */
  async function getAllLines(req, res) {
    const responseItems = lines.map((line) => ({
      name: line.name,
      color: line.color,
    }));
    res.send(responseItems);
  }
);

router.get(
  "/:id",
  /**
   * returns a specific line by id, e.g. `GET /lines/U8`
   */
  async function getLineById(req, res) {
    // find the specific line by key
    const requestedLineId = req.params.id;

    const requestedLine = lines.find((line) => line.name === requestedLineId);
    if (!requestedLine) {
      res.sendStatus(404);
      return;
    }

    res.send(requestedLine);
  }
);

// TODO: add further routes here

export const lineRoutes = router;
