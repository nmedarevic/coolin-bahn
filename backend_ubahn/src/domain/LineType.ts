export enum LineType {
  /** if a linear line reaches the end station, the car turns over and runs the line backward.
   * if it reaches the starting station, it changes direction again */
  Linear = "linear",
  /**
   * a cyclic line runs in circles, i.e. if it reaches the end station it does not change direction but continues with the starting station.
   */
  Cyclic = "cyclic",
}
