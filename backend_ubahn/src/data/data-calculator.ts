import { Line } from "../domain/Line";
import { Station } from "../domain/Station";
import { UBahn } from "./UBahn";
import lines from "./lines.json";

const ubahn = new UBahn();

ubahn.initialize(lines as Line[]);
ubahn.findRouteDFS(ubahn.findStationByName("Siemensdamm"), ubahn.findStationByName("Jungfernheide"));