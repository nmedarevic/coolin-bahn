import { StationWithConnections } from "../../App";
import styles from './Stations.module.scss';

export const Stations = ({
  stations,
  onStationSelect
}: {stations: StationWithConnections[]; onStationSelect: (stationName: string) => void}) => {
  console.log('\n\n', stations, '\n\n');
  return (
    <div className={styles.stationsWrapper}>
    {stations.map((station) => <div key={station.name} onClick={() => {
      onStationSelect(station.name);
    }}>{station.name}</div>)}
    </div>
  )
}