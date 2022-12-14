import { render, screen } from "@testing-library/react";
import { composeStories } from "@storybook/testing-react";
import * as stories from "./BaseAsset.stories";

const {
  SingleAsset,
  SingleAssetWithOverrideLabel,
  SingleAssetWithoutLabel,
  SingleAssetWithoutIcon,
  PairAssets,
  PairAssetsWithDescription,
  PairAssetsWithOverrideLabel,
  PairAssetsWithoutLabel,
} = composeStories(stories);

describe("BaseAsset", () => {
  test("SingleAsset", () => {
    render(<SingleAsset />);

    expect(screen.queryAllByText("Token1")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset with override label", () => {
    render(<SingleAssetWithOverrideLabel />);

    expect(screen.queryAllByText("Single Asset")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset without label", () => {
    render(<SingleAssetWithoutLabel />);

    expect(screen.queryAllByText("Token1")).toHaveLength(0);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(1);
  });

  test("SingleAsset without icon", () => {
    render(<SingleAssetWithoutIcon />);

    expect(screen.queryAllByText("Token1")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(0);
  });

  test("PairAssets without description", () => {
    render(<PairAssets />);

    expect(screen.queryAllByText("Token1/Token2")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(2);
    expect(screen.queryAllByText("Token1 label/Token2 label")).toHaveLength(0);
  });

  test("PairAssets with description", () => {
    render(<PairAssetsWithDescription />);

    expect(screen.queryAllByText("Token1/Token2")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(2);
    expect(screen.queryAllByText("Token1 label/Token2 label")).toHaveLength(1);
  });

  test("PairAssets with override label", () => {
    render(<PairAssetsWithOverrideLabel />);

    expect(screen.queryAllByText("Pair Assets")).toHaveLength(1);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(2);
  });

  test("PairAssets without label", () => {
    render(<PairAssetsWithoutLabel />);

    expect(screen.queryAllByText("Token1")).toHaveLength(0);
    expect(screen.queryAllByLabelText("Base Asset Icon")).toHaveLength(2);
  });
});
