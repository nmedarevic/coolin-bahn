import { LineType } from "./LineType";

/**
 * A railway line.
 */

export interface Line {
  /** name of the line, can be used as an ID */
  name: string;
  /** the brand color to display the line with */
  color: string;
  /** ignore this for now */
  type: LineType;
  /** the stations corresponding to that line */
  stations: string[];
}
