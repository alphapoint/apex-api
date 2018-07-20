class Trade {
  constructor(arr) {
    this.TradeId = arr[0];
    this.InstrumentId = arr[1];
    this.Quantity = arr[2];
    this.Price = arr[3];
    this.Order1Id = arr[4];
    this.Order2Id = arr[5];
    this.Timestamp = arr[6];
    this.Direction = arr[7];
    this.TakerSide = arr[8];
  }
}

export default Trade;
