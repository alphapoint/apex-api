class Level2 {
  constructor(obj) {
    const [
      UpdateId,
      NumberOfAccounts,
      UpdateDateTime,
      ActionType,
      LastTradePrice,
      NumberOfOrders,
      Price,
      ProductPairCode,
      Quantity,
      Side
    ] = obj;
    return {
      UpdateId,
      NumberOfAccounts,
      UpdateDateTime,
      ActionType,
      LastTradePrice,
      NumberOfOrders,
      Price,
      ProductPairCode,
      Quantity,
      Side
    };
  }
}

export default Level2;
