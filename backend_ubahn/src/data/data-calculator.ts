import { Line } from "../domain/Line";
import { Station } from "../domain/Station";
import { UBahn } from "./UBahn";
import lines from "./lines.json";

const ubahn = new UBahn();

ubahn.initialize(lines as Line[]);

// console.log('\n\n', ubahn.connections["Mehringdamm"], '\n\n');
ubahn.findRouteDFS(ubahn.findStationByName("Kochstraße"), ubahn.findStationByName("Yorckstraße"));