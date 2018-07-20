class Level2 {
  constructor(obj) {
    this.UpdateId = obj[0];
    this.NumberOfAccounts = obj[1];
    this.UpdateDateTime = obj[2];
    this.ActionType = obj[3];
    this.LastTradePrice = obj[4];
    this.NumberOfOrders = obj[5];
    this.Price = obj[6];
    this.ProductPairCode = obj[7];
    this.Quantity = obj[8];
    this.Side = obj[9];
  }
}

export default Level2;
