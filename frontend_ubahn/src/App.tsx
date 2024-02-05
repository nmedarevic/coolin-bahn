import "./App.css";
import { useEffect, useState } from "react";
import { Line } from "./types/Line";
import axios from "axios"
import Lines from "./components/Lines/Lines";
import { Stations } from "./components/Stations/Stations";

const backend = "http://localhost:8080/"
const linesUrl = `${backend}lines`

function App() {
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<string | null>(null);
  const [stations, setStations] = useState<{[lineName: string]: string[]}>({});
  useEffect(() => {
    async function fetchLines() {
      const response = await axios.get(linesUrl);
      setLines(response.data);
    }

    fetchLines();
  }, []);

  const onStationSelect = async (lineName: string) => {
    setCurrentLine(lineName)
    const response = await axios.get(`${linesUrl}/${lineName}/stations`);
    setStations({...stations, [lineName]: response.data});
  }

  return (
    <div className="App">
      <header className="App-header">
        <Lines currentLine={currentLine} lines={lines} onStationSelect={onStationSelect}/>
        {currentLine && stations[currentLine] ? <Stations stations={stations[currentLine]} /> : null}
      </header>
    </div>
  );
}

export default App;
