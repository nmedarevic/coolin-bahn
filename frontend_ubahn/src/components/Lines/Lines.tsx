import classNames from 'clsx';
import { Line } from "../../types/Line";
import styles from "./Lines.module.scss"

/**
 * Fetches and lists the lines from the backend
 *
 * You should probably not use this component, it just serves as an example.
 */
export default function Lines({
  currentLine,
  lines,
  onLineSelect,
}: { lines: Line[]; onLineSelect?: (stationName: string) => void; currentLine?: string | null  }) {
  return (
    <>
      {lines.length > 0 && (
        
          <div className={styles.linesWrapper} style={{ fontSize: 10 }}>
            {lines.map((line) => (
              <div className={classNames(styles.line, {
                isFocused: line.name === currentLine
              })} style={{ backgroundColor: line.color }} onClick={() => onLineSelect && onLineSelect(line.name)}>{line.name}</div>
            ))}
        
        </div>
      )}
    </>
  );
}
