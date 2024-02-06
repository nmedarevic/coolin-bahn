import express from "express";
import { lines } from "../data";
import { Direction } from "../domain/Direction";
import {ubahn} from "../services/ubahn.service";

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

    const response = {
      ...requestedLine,
      stations: requestedLine.stations.map((station) => ubahn.stationsNameToUrl[station])
    }
    res.send(response);
  }
);

router.get(
  "/:id/:station/:direction?/:numberOfStations?",
  /**
   * returns a specific line by id, e.g. `GET /lines/U8`
   */
  async function getLineById(req, res) {
    // find the specific line by key
    const requestedLineId = req.params.id;
    const requestedStation = req.params.station;
    const requestedDirection = req.params.direction;
    const requestedNumberOfStations = req.params.numberOfStations ? Number(req.params.numberOfStations) : 3;
    const realName = ubahn.stationsUrlToName[requestedStation];
    const requestedLine = lines.find((line) => line.name === requestedLineId);

    if (!requestedLine) {
      res.sendStatus(404);
      return;
    }

    const stationIndex = requestedLine.stations.findIndex((station) => station === realName);  

    let stations: string[] = requestedLine.stations.map((station) => ubahn.stationsNameToUrl[station])
    
    if (requestedDirection === Direction.Forward) {
      stations = stations.slice(stationIndex, stationIndex + requestedNumberOfStations);
    }

    if (requestedDirection === Direction.Backward) {
      const startOfSlice = stationIndex - requestedNumberOfStations < 0 ? 0 : stationIndex - requestedNumberOfStations

      stations = stations.slice(startOfSlice, stationIndex);
    }

    res.send(stations.map((station: string) => ({
      name: station,
      connections: ubahn.connections[station]
    })));
  }
);

// TODO: add further routes here

export const lineRoutes = router;
