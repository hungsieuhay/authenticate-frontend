import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export type Dayjs = dayjs.Dayjs;
export type { ConfigType } from 'dayjs';
export default dayjs;
