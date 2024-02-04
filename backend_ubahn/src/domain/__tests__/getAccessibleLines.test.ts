import { getAccessibleLines } from "../getAccessibleLines";
import { Line } from "../Line";
import { LineType } from "../LineType";

const line1: Line = {
  name: "dummy",
  color: "#ff0000",
  type: LineType.Linear,
  stations: ["Station1", "Station2", "Station3"],
};

const line2: Line = {
  name: "dummy2",
  color: "#ff00ff",
  type: LineType.Linear,
  stations: ["Station3", "Station4", "Station5"],
};

const allLines = [line1, line2];

it(`returns empty array if no other line is accessible`, () => {
  const result = getAccessibleLines(line1, "Station1", allLines);
  expect(result).toStrictEqual([]);
});

it(`returns other line if another line matches the station`, () => {
  const result = getAccessibleLines(line1, "Station3", allLines);
  expect(result).toStrictEqual([line2]);
});
