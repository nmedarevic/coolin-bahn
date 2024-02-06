import "./App.css";
import { useEffect, useState } from "react";
import { Line } from "./types/Line";
import axios from "axios"
import Lines from "./components/Lines/Lines";
import { Stations } from "./components/Stations/Stations";

const backend = "http://localhost:8080/"
const linesUrl = `${backend}lines`

export type Station = {
  name: string;
  lines: string[];
}

export type StationWithConnections = { 
  name: string; 
  connections: { name: string; lines: string[] }[] 
}

export type LinesWithStations = { 
  [lineName: string]: StationWithConnections[]
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
    const response = await axios.get(`${linesUrl}/${lineName}/stations`);
    setlinesWithStations({ ...linesWithStations, [lineName]: response.data });
  }

  const onStationSelect = async (stationName: string) => {
    setCurrentStation(stationName)
  }

  const focusedStation = currentStation && currentLine ? linesWithStations[currentLine].find((station: StationWithConnections) => station.name === currentStation) : null
console.log('\n\n', focusedStation, '\n\n');
  return (
    <div className="App">
      <header className="App-header">
        <h1>Berlin U-Bahn lines</h1>
        <Lines currentLine={currentLine} lines={lines} onLineSelect={onLineSelect} />
        <div className="content">
        {currentLine && linesWithStations[currentLine] ? <Stations stations={linesWithStations[currentLine]} onStationSelect={onStationSelect} /> : null}
        {focusedStation ? <div className="lines">
          <div><Lines lines={(focusedStation?.connections?.reduce((acc: string[], conn: Station) => {
            const lines = conn.lines;

            const uniqueLines = lines.filter((line) => !acc.includes(line))
            
            return [...acc, ...uniqueLines]
          }, []).map((line) => ({
            name: line,
            color: lines.find((ln: Line) => ln.name === line)?.color,  
          })) || []) as Line[]}/></div>
        </div> : null}
        <div className="">{focusedStation?.name}</div>
        </div>
      </header>
    </div>
  );
}

export default App;
