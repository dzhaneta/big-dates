export type Date = {
  year: string;
  info: string;
}

export type Period = {
  id: number;
  name: string;
  start: number;
  end: number;
  dates: Date[];
};