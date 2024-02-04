import { LineType } from "../domain/LineType";
import { UBahn } from "./UBahn";
import lines from "./lines.json";

type LineConnection = {
  lineName: string;
  connectsTo: string[];
}
const connections: LineConnection[] = []

console.log('\n\n', lines, '\n\n');

export type Station = {
  name: string;
  lines: string[];
}

type Line = {
  /** name of the line, can be used as an ID */
  name: string;
  /** the brand color to display the line with */
  color: string;
  /** ignore this for now */
  type: LineType;
  /** the stations corresponding to that line */
  stations: Station[];
}

const linesMap: { [name: string]: Line } = {}

const ubahn = new UBahn();

const stations: Station[] = [];

for (const line of lines) {
  for (let i = 0; i < line.stations.length; i++) {
    let station = stations.find((item: Station) => item.name === line.stations[i])

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

      stations.push(station)
    }

    ubahn.addStation(station);

    if (line.stations[i - 1]) {
      const previousStation = stations.find((item: Station) => item.name === line.stations[i - 1])
      
      if (!previousStation) {
        continue
      }

      ubahn.addConnection(station, previousStation)
      ubahn.addConnection(previousStation, station)
    }
  }
}

console.log('\n\n', ubahn, '\n\n');
console.log('\n\n', stations, '\n\n');