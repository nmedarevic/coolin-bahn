import { lines } from "../data";
import { UBahn } from "../data/UBahn";
import { Line } from "../domain/Line";

const _ubahn = new UBahn();

_ubahn.initialize(lines as Line[]);

export const ubahn = _ubahn