import { useEffect, useState } from "react";
import { Line } from "../types/Line";
import axios from "axios";

/**
 * Fetches and lists the lines from the backend
 *
 * You should probably not use this component, it just serves as an example.
 */
export default function LinesDummy() {
  const [lines, setLines] = useState<Line[]>([]);
  useEffect(() => {
    async function fetchLines() {
      const response = await axios.get("http://localhost:8080/lines");
      setLines(response.data);
    }

    fetchLines();
  }, []);

  return (
    <>
      <span>Hello!</span>{" "}
      {lines.length > 0 && (
        <div>
          <p>I have fetched these lines from the backend:</p>
          <div>{}</div>
          <p style={{ fontSize: 10 }}>
            {lines.map((line) => (
              <div>{JSON.stringify(line)}</div>
            ))}
          </p>
        </div>
      )}
    </>
  );
}
