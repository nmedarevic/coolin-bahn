import { Station } from "./data-calculator";

export class UBahn {
  public connections: { [key: string]: Station[] };

  constructor() {
    this.connections = {};
  }

  addStation(station: Station) {
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
}