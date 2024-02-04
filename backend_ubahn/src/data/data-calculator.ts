import { Station } from "../domain/Station";
import { UBahn } from "./UBahn";
import lines from "./lines.json";

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
    }

    ubahn.addStation(station);

    if (line.stations[i - 1]) {
      const previousStation = ubahn.stations.find((item: Station) => item.name === line.stations[i - 1])
      
      if (!previousStation) {
        continue
      }

      ubahn.addConnection(station, previousStation)
      ubahn.addConnection(previousStation, station)
    }
  }
}

console.log('\n\n', ubahn, '\n\n');
console.log('\n\n', ubahn.stations, '\n\n');