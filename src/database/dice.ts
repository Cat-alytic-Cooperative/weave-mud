export class Dice {
  count = 0;
  sides = 0;
  modifier = 0;

  constructor(count: number, sides: number, modifier?: number) {
    this.count = count;
    this.sides = sides;
    this.modifier = modifier || 0;
  }

  public roll() {
    let total = 0;
    for (let die = 0; die < this.count; ++die) {
      total = total + Math.floor(Math.random() * this.sides + 1);
    }
    total += this.modifier;
    return total;
  }
}
