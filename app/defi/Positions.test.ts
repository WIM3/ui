import {
  mapOriginalPositionStatus,
  OriginalPositionChangeStatuses,
  PositionChangeStatuses,
} from "./Positions";

describe("Positions", () => {
  test("should return Open for 'Opening', 'Changing', 'Margin Changing' statuses", () => {
    expect(
      mapOriginalPositionStatus(OriginalPositionChangeStatuses.Opening)
    ).toEqual(PositionChangeStatuses.Open);

    expect(
      mapOriginalPositionStatus(OriginalPositionChangeStatuses.Changing)
    ).toEqual(PositionChangeStatuses.Open);

    expect(
      mapOriginalPositionStatus(OriginalPositionChangeStatuses.MarginChangin)
    ).toEqual(PositionChangeStatuses.Open);
  });

  test("should return Closed for 'Closing' status", () => {
    expect(
      mapOriginalPositionStatus(OriginalPositionChangeStatuses.Closing)
    ).toEqual(PositionChangeStatuses.Closed);
  });

  test("should return Liquidated for 'Liquidating' status", () => {
    expect(
      mapOriginalPositionStatus(OriginalPositionChangeStatuses.Liquidating)
    ).toEqual(PositionChangeStatuses.Liquidated);
  });
});
