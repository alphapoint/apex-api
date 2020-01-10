class Trade {
  constructor(arr) {
    const [
      TradeId,
      InstrumentId,
      Quantity,
      Price,
      Order1Id,
      Order2Id,
      Timestamp,
      Direction,
      TakerSide
    ] = arr;
    return {
      TradeId,
      InstrumentId,
      Quantity,
      Price,
      Order1Id,
      Order2Id,
      Timestamp,
      Direction,
      TakerSide
    };
  }
}

export default Trade;
