import { Line } from "../domain/Line";
import { UBahn } from "./UBahn";
import lines from "./lines.json";

const ubahn = new UBahn();

ubahn.initialize(lines as Line[]);

const path = ubahn.findRouteBFS(ubahn.findStationByName("Siemensdamm"), ubahn.findStationByName("Jungfernheide"));

console.log('\n\n', path, '\n\n');