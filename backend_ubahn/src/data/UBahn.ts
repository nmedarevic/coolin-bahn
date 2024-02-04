import { Line } from "../domain/Line";
import { Station } from "../domain/Station";

export class UBahn {
  public stations: Station[];
  public connections: { [key: string]: Station[] };

  constructor() {
    this.connections = {};
    this.stations = [];
  }

  findStationByName(name: string): Station {
    return this.stations.find((s: Station) => s.name === name)!;
  }

  initialize(lines: Line[]) {
    for (const line of lines) {
      for (let i = 0; i < line.stations.length; i++) {
        let station = this.stations.find((item: Station) => item.name === line.stations[i])
    
        if (station) {
          const hasAnotherLine = station.lines.every((ln: string) => ln !== line.name)
    
          if (hasAnotherLine) {
            station.lines.push(line.name)
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
      this.connections[station1.name].push(station2);
    }
    if (!this.connections[station2.name].find((stationsName) => stationsName.name === station1.name)) {
      this.connections[station2.name].push(station1);
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
    const visited: Station[] = [];
    const qqq: Station[] = [];

    const first = this.stations.find((s: Station) => s.name === start.name);

    qqq.push(first!)
    visited.push(first!);
  
    while (qqq.length) {
      const current = qqq[0];
      qqq.shift();

      const connectingStations = this.connections[current.name];
      
      for (const connection of connectingStations) {
        if (visited.find((s: Station) => s.name === connection.name)) {
          continue;
        }

        if (connection.name === end.name) {
          return;
        }

        visited.push(connection)
        qqq.push(connection)
      }
    } 
  }

  dfsBody(connection: Station, visited: Station[], end: Station, path: Station[] = []) {
    const connectingStations = this.connections[connection!.name];
    visited.push(connection);
    path.push(connection);

    for (const connection of connectingStations) {
      if (connection.name === end.name) {
        return
      }

      if (visited.find((s: Station) => s.name === connection.name)) {
        continue;
      }

      this.dfsBody(connection, visited, end, path)
    }
  
    path.pop();
  }

  findRouteDFS(start: Station, end: Station) {
    const visited: Station[] = [];
    const path: Station[] = [];

    const first = this.stations.find((s: Station) => s.name === start.name);
    visited.push(first!);
    this.dfsBody(first!, visited, end, path)
  }
}