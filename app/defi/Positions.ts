export enum PositionChangeStatuses {
  Open = "Open",
  Closed = "Closed",
  Liquidated = "Liquidated",
}

export enum OriginalPositionChangeStatuses {
  Opening = "Opening",
  Closing = "Closing",
  Changing = "Changing",
  MarginChangin = "Margin Changing",
  Liquidating = "Liquidating",
  None = "Invalid",
}

export const mapOriginalPositionStatus = (
  status: OriginalPositionChangeStatuses
) => {
  const openStatuses = [
    OriginalPositionChangeStatuses.Opening,
    OriginalPositionChangeStatuses.Changing,
    OriginalPositionChangeStatuses.MarginChangin,
  ];

  return openStatuses.includes(status)
    ? PositionChangeStatuses.Open
    : OriginalPositionChangeStatuses.Closing === status
      ? PositionChangeStatuses.Closed
      : PositionChangeStatuses.Liquidated;
};
