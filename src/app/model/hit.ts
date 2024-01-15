export class Hit {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public r: number,
    public hit: boolean,
    public attemptTime: number,
    public executionTime: number
  ) {
  }
}
