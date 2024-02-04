import { Direction } from "../Direction";
import { getNextStops } from "../getNextStops";
import { Line } from "../Line";
import { LineType } from "../LineType";

describe("linear line", () => {
  const linearLine: Line = {
    name: "dummy",
    color: "#ff0000",
    type: LineType.Linear,
    stations: ["Station1", "Station2", "Station3", "Station4", "Station5"],
  };

  it(`returns the next 3 stops if passed 3`, () => {
    const nextStops = getNextStops(
      linearLine,
      Direction.Forward,
      3,
      "Station2"
    );
    expect(nextStops).toStrictEqual(["Station3", "Station4", "Station5"]);
  });

  it(`returns the next 2 stops if passed 2`, () => {
    const nextStops = getNextStops(
      linearLine,
      Direction.Forward,
      2,
      "Station2"
    );
    expect(nextStops).toStrictEqual(["Station3", "Station4"]);
  });

  it(`returns the last 2 stops if invoked at end of array`, () => {
    const nextStops = getNextStops(
      linearLine,
      Direction.Forward,
      3,
      "Station3"
    );
    expect(nextStops).toStrictEqual(["Station4", "Station5"]);
  });

  it(`returns the previous 3 stops if invoked with backward direction`, () => {
    const nextStops = getNextStops(
      linearLine,
      Direction.Backward,
      3,
      "Station5"
    );
    expect(nextStops).toStrictEqual(["Station4", "Station3", "Station2"]);
  });

  it(`throws if requested station is not found`, () => {
    const act = () =>
      getNextStops(linearLine, Direction.Forward, 3, "StationX");
    expect(act).toThrowError();
  });
});

// ignore these for now - we'll talk about it in the interview
xdescribe("cyclic line", () => {
  const cyclicLine: Line = {
    name: "dummy",
    color: "#ff0000",
    type: LineType.Cyclic,
    stations: ["Station1", "Station2", "Station3", "Station4", "Station5"],
  };

  it(`continues with starting station if end is reached`, () => {
    const nextStops = getNextStops(
      cyclicLine,
      Direction.Forward,
      3,
      "Station4"
    );
    expect(nextStops).toStrictEqual(["Station5", "Station1", "Station2"]);
  });

  it(`throws if called with direction Backward`, () => {
    const act = () =>
      getNextStops(cyclicLine, Direction.Backward, 3, "Station5");
    expect(act).toThrowError();
  });
});
