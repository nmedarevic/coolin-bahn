export const Stations = ({
  stations
}: {stations: string[]}) => {
  console.log('\n\n', stations, '\n\n');
  return (
    <>
    {stations.map((station) => <div key={station}>{station}</div>)}
    </>
  )
}