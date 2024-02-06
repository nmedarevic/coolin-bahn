import "./App.css";
import { useEffect, useState } from "react";
import { Line } from "./types/Line";
import axios from "axios"
import Lines from "./components/Lines/Lines";
import { Stations } from "./components/Stations/Stations";
import { SelectedLine } from "./components/SelectedLine/SelectedLine";

const backend = "http://localhost:8080/"
const linesUrl = `${backend}lines`

export type Station = {
  name: string;
  lines: string[];
}

export type StationWithConnections = {
  name: string;
  connections: Station[]
}

export type LinesWithStations = {
  [lineName: string]: StationWithConnections[]
}

const findSelectedStationLines = ({ 
  stations, 
  currentLine, 
  focusedStationIndex, 
  lines 
}: { 
  stations: LinesWithStations; 
  currentLine: string | null; 
  focusedStationIndex: number | null; 
  lines: Line[] 
}) => {
  if (!currentLine || !focusedStationIndex || focusedStationIndex === -1) {
    return []
  }

  return (stations[currentLine][focusedStationIndex]?.connections?.reduce((acc: string[], conn: Station) => {
    const lines = conn.lines;
    const uniqueLines = lines.filter((line) => !acc.includes(line))
    return [...acc, ...uniqueLines]
  }, []).map((line) => ({
    name: line,
    color: lines.find((ln: Line) => ln.name === line)?.color || "",
  })) || [] as Line[])
}

function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [currentStation, setCurrentStation] = useState<string | null>(null);
  const [linesWithStations, setlinesWithStations] = useState<LinesWithStations>({});

  useEffect(() => {
    async function fetchLines() {
      const response = await axios.get(linesUrl);
      setLines(response.data);
    }

    fetchLines();
  }, []);

  const onLineSelect = async (lineName: string) => {
    setCurrentLine(lineName)
    setCurrentStation(null)

    if (!linesWithStations[lineName]) {
      const response = await axios.get(`${linesUrl}/${lineName}/stations`);
      setlinesWithStations({ ...linesWithStations, [lineName]: response.data });
    }
  }

  const onStationSelect = async (stationName: string) => {
    setCurrentStation(stationName)
  }

  const focusedStationIndex = currentStation && currentLine ? linesWithStations[currentLine].findIndex((station: StationWithConnections) => station.name === currentStation) : null
  const selectedStationLines = findSelectedStationLines({ currentLine, focusedStationIndex, lines, stations: linesWithStations })
  const selectedStationNextStations = currentLine && focusedStationIndex ? linesWithStations[currentLine].slice(focusedStationIndex, focusedStationIndex + 3) as StationWithConnections[] : [] as StationWithConnections[]

  return (
    <div className="App">
      <header className="App-header">
        <h1>Berlin U-Bahn lines</h1>
        <Lines currentLine={currentLine} lines={lines} onLineSelect={onLineSelect} />
        <div className="content">
          {currentLine && linesWithStations[currentLine] ? <Stations stations={linesWithStations[currentLine]} onStationSelect={onStationSelect} /> : null}
          <SelectedLine selectedStationLines={selectedStationLines} selectedStationNextStations={selectedStationNextStations} />
        </div>
      </header>
    </div>
  );
}

export default App;
