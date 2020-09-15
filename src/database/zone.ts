export type ZoneId = string & { _type?: "zone" };
export class Zone {
  id: ZoneId = "";
  names: string[] = [];
}
