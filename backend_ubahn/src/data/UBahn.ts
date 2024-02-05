import { Line } from "../domain/Line";
import slugify from "slugify"
import { Station } from "../domain/Station";

type VisitedStation = {
  name: string;
  line: string
}
export class UBahn {
  public stations: Station[];
  public stationsUrlToName: { [key: string]: string};
  public stationsNameToUrl: { [key: string]: string};
  public connections: { [key: string]: Station[] };

  constructor() {
    this.connections = {};
    this.stations = [];
    this.stationsNameToUrl = {}
    this.stationsUrlToName = {}
  }

  findStationByName(name: string): Station {
    return this.stations.find((s: Station) => s.name === name)!;
  }

  initialize(lines: Line[]) {
    this.initializeStationConnections(lines);
    this.initializeUrlEncodedStatations();
  }

  private initializeUrlEncodedStatations() {
    for (const station of this.stations) {
      this.stationsUrlToName[slugify(station.name)] = station.name;
      this.stationsNameToUrl[station.name] = slugify(station.name);
    }
  }

  private initializeStationConnections(lines: Line[]) {
    for (const line of lines) {
      for (let i = 0; i < line.stations.length; i++) {
        let station = this.stations.find((item: Station) => item.name === line.stations[i])

        if (station) {
          const hasAnotherLine = station.lines.every((ln: string) => ln !== line.name)

          if (hasAnotherLine) {
            station.lines.unshift(line.name)
          }
        } else {
          station = {
            name: line.stations[i],
            lines: [line.name]
          }
        }

        this.addStation(station);

        if (line.stations[i - 1]) {
          const previousStation = this.stations.find((item: Station) => item.name === line.stations[i - 1])

          if (!previousStation) {
            continue
          }

          this.addConnection(station, previousStation)
          this.addConnection(previousStation, station)
        }
      }
    }
  }

  addStation(station: Station) {
    if (!this.stations.find((s: Station) => s.name === station.name)) {
      this.stations.push(station);
    }
    if (!this.connections[station.name]) this.connections[station.name] = [];
  }

  addConnection(station1: Station, station2: Station) {
    if (!this.connections[station1.name].find((stationsName) => stationsName.name === station2.name)) {
      this.connections[station1.name].unshift(station2);
    }
    if (!this.connections[station2.name].find((stationsName) => stationsName.name === station1.name)) {
      this.connections[station2.name].unshift(station1);
    }
  }

  removeConnection(station1: Station, station2: Station) {
    this.connections[station1.name] = this.connections[station1.name].filter(
      vertex => vertex.name !== station2.name
    );
    this.connections[station2.name] = this.connections[station2.name].filter(
      vertex => vertex.name !== station1.name
    );
  }

  removeStation(station: Station) {
    while (this.connections[station.name].length) {
      const adjacentVertex = this.connections[station.name].pop();

      if (!adjacentVertex) {
        continue
      }

      this.removeConnection(station, adjacentVertex);
    }

    delete this.connections[station.name];
  }

  findRouteBFS(start: Station, end: Station) {
    const visited: VisitedStation[] = [];
    const visitQueue: VisitedStation[] = [];
    const path: Station[] = [];

    const first = this.stations.find((s: Station) => s.name === start.name);

    for (const line of first!.lines) {
      visitQueue.push({
        name: first!.name,
        line: line
      });
    }

    visited.push({ name: first!.name, line: first!.lines[0] });
    path.push(first!);

    while (visitQueue.length) {
      const current = visitQueue[0];

      if (path.length >= 1) {
        const station = this.stations.find((s: Station) => s.name === current.name)!
        const previousInPath = path[path.length - 1];
        const isConnectedWithPrevious = this.connections[previousInPath.name].find((item: Station) => item.name === station.name)

        if (isConnectedWithPrevious) {
          path.push(station);
        }
      }

      visitQueue.shift();

      const connectingStations = this.connections[current.name];

      const allPaths = connectingStations.reduce((acc: VisitedStation[], station: Station) => {
        return acc.concat(station.lines.map((line: string) => {
          return {
            name: station.name,
            line: line
          }
        }))
      }, [])

      const sameLinePaths = allPaths.filter((path: VisitedStation) => path.line === current.line).filter((vs: VisitedStation) => (
        !visited.find((vtd: VisitedStation) => (vtd.name === vs.name)
        )));
      const otherLinePaths = allPaths.filter((vs: VisitedStation) => vs.line !== current.line).filter((vs: VisitedStation) => (
        !visited.find((vtd: VisitedStation) => (vtd.name === vs.name)
        )));

      for (const p of sameLinePaths) {
        if (visited.find((s: VisitedStation) => s.name === p.name && s.line === p.line)) {
          continue;
        }
        visited.push(p)
        visitQueue.push(p);
      }
      for (const p of otherLinePaths) {
        if (visited.find((s: VisitedStation) => s.name === p.name && s.line === p.line)) {
          continue
        }
        visited.push(p)
        visitQueue.push(p);
      }

      if (current.name === end.name) {
        return path;
      }
    }
  }
}