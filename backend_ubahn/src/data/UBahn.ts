import { Line } from "../domain/Line";
import { Station } from "../domain/Station";

type VisitedStation = {
  name: string;
  line: string
}
export class UBahn {
  public stations: Station[];
  public connections: { [key: string]: Station[] };
  public lineConnections: { [key: string]: string[]};

  constructor() {
    this.connections = {};
    this.stations = [];
    this.lineConnections = {};
  }

  findStationByName(name: string): Station {
    return this.stations.find((s: Station) => s.name === name)!;
  }

  initialize(lines: Line[]) {
    this.initializeStationConnections(lines);
    this.initializeLineConnections(lines);
  }

  private initializeLineConnections(lines: Line[]) {
    if (Object(this.connections).length === 0) {
      throw new Error("Initialize connections first!");
    }

    for (const line of lines) {
      const allStations = this.stations.filter((s: Station) => s.lines.includes(line.name));

      const allConections = allStations.reduce((lineConnections: string[], station: Station) => {
        if (lineConnections.length === 0) {
          return [...station.lines.filter((s: string) => s !== line.name)]
        }

        for (const singleStation of this.connections[station.name]) {
          if (lineConnections.find((conn: string) => singleStation.lines.includes(conn))) {
            lineConnections.concat(singleStation.lines);
          }
        }
        return lineConnections
      }, [])

      this.lineConnections[line.name] = allConections;
    }
  }

  private initializeStationConnections(lines: Line[]) {
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
    const path: Station[] = [];

    const first = this.stations.find((s: Station) => s.name === start.name);

    qqq.push(first!)
    visited.push(first!);
    path.push(first!);
  
    while (qqq.length) {
      const current = qqq[0];
      path.push(current);
      qqq.shift();

      const connectingStations = this.connections[current.name];
      
      for (const connection of connectingStations) {
        if (visited.find((s: Station) => s.name === connection.name)) {
          continue;
        }

        if (connection.name === end.name) {
          path.push(connection);
          return;
        }

        visited.push(connection)
        qqq.push(connection)
      }
      path.pop();
    } 
  }

  dfsBody(connection: Station, visited: VisitedStation[], end: Station, path: Station[], line: string) {
    const connectingStations = this.connections[connection!.name];
    visited.push({
      name: connection!.name,
      line: line
    });
    path.push(connection);
  
    for (const station of connectingStations) {
      if (station.name === end.name) {
        path.push(station);
        console.log('\n\n', "FOUND!", path, '\n\n');
        return true
      }

      for (const line of station.lines) {
        if (visited.find((s: VisitedStation) => s.name === station.name && line === s.line)) {
          continue;
        }
  
        const result = this.dfsBody(station, visited, end, path, line)

        if (result) {
          return true
        }
        
      }  
      
      // path.pop();
    }
  
    path.pop();
  }

  findRouteDFS(start: Station, end: Station) {
    const visited: VisitedStation[] = [];
    const path: Station[] = [];

    const first = this.stations.find((s: Station) => s.name === start.name);
    
    for (const line of first!.lines) {
      visited.push({
        name: first!.name,
        line: line
      });
      this.dfsBody(first!, visited, end, path, line);
    }
  }
}