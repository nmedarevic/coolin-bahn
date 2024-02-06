import { StationWithConnections } from "../../App"
import { Line } from "../../types/Line";
import Lines from "../Lines/Lines";

export type SelectedLineProps = { selectedStationLines: Line[]; selectedStationNextStations: StationWithConnections[] | undefined }

export const SelectedLine = ({
  selectedStationLines,
  selectedStationNextStations,
}: SelectedLineProps) => {
  if (!selectedStationLines || selectedStationLines.length === 0) {
    return null
  }

  return (
    <div>
      {selectedStationLines ? <div className="lines">
        <div><Lines lines={selectedStationLines} /></div>
      </div> : null}
      <div>{selectedStationNextStations ? selectedStationNextStations.map((station) => <p key={station.name}>{station.name}</p>) : null}</div>
    </div>
  )
}