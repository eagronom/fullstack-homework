import { shallow } from "enzyme";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Table from "./Table";
import { fetchCrops, fetchFields, fetchHumusBalance } from "./api";

jest.mock("./api");

describe("<Table />", () => {
  const crops = [{ value: 1, label: "Crop 1", humus_delta: 1 }];
  const fields = [
    {
      id: 1,
      name: "Mäeotsa",
      area: 0.93,
      crops: [
        { year: 2020, crop: { value: 1, label: "Crop 1", humus_delta: 1 } },
        { year: 2021, crop: { value: 2, label: "Crop 2", humus_delta: 1 } },
        { year: 2022, crop: { value: 3, label: "Crop 3", humus_delta: 1 } },
        { year: 2023, crop: { value: 4, label: "Crop 4", humus_delta: 1 } },
        { year: 2024, crop: { value: 5, label: "Crop 5", humus_delta: 1 } },
      ],
    },
  ];

  const humusBalance = {
    field_id: 1,
    humus_balance: -4.3,
    previous_humus_balance: -3,
  };

  beforeEach(() => {
    fetchCrops.mockReturnValue(crops);
    fetchFields.mockReturnValue(fields);
    fetchHumusBalance.mockReturnValue({});
  });

  it("renders with empty data", async () => {
    expect(await shallow(<Table />)).toMatchSnapshot();
  });

  it("loads data when component mounted", async () => {
    expect(
      await shallow(<Table />)
        .instance()
        .componentDidMount()
    ).toMatchSnapshot();
  });

  it("loads data when component mounted with humus balance information", async () => {
    fetchHumusBalance.mockReturnValue(humusBalance);
    expect(
      await shallow(<Table />)
        .instance()
        .componentDidMount()
    ).toMatchSnapshot();
  });

  it("shows new humus balance value after select different crop", async () => {
    fetchCrops.mockReturnValue([
      ...crops,
      { value: 6, label: "Crop 6", humus_delta: 1 },
    ]);

    fetchHumusBalance
      .mockReturnValueOnce(humusBalance)
      .mockReturnValueOnce({ ...humusBalance, humus_balance: 100.0 });

    render(<Table />);

    const cropDropDown = await screen.findByText("Crop 1");
    userEvent.click(cropDropDown);

    const newCropOption = await screen.findByText("Crop 6");
    userEvent.click(newCropOption);
    expect(await screen.findByText(/100\.00/i)).toBeTruthy();
  });

  it("shows humus balance as good", async () => {
    fetchCrops.mockReturnValue([
      ...crops,
      { value: 6, label: "Crop 6", humus_delta: 1 },
    ]);

    const goodHumusBalance = 100.0;

    fetchHumusBalance
      .mockReturnValueOnce(humusBalance)
      .mockReturnValueOnce({
        ...humusBalance,
        humus_balance: goodHumusBalance,
      });

    render(<Table />);

    const cropDropDown = await screen.findByText("Crop 1");
    userEvent.click(cropDropDown);

    const newCropOption = await screen.findByText("Crop 6");
    userEvent.click(newCropOption);
    const humusBalanceText = await screen.findByText(
      goodHumusBalance.toFixed(2)
    );

    expect(humusBalanceText).toMatchSnapshot();
  });

  it("shows humus balance as bad balance", async () => {
    fetchCrops.mockReturnValue([
      ...crops,
      { value: 6, label: "Crop 6", humus_delta: 1 },
    ]);
    const badHumusBalance = humusBalance.previous_humus_balance - 1;
    fetchHumusBalance.mockReturnValueOnce(humusBalance).mockReturnValueOnce({
      ...humusBalance,
      humus_balance: badHumusBalance,
    });

    render(<Table />);

    const cropDropDown = await screen.findByText("Crop 1");
    userEvent.click(cropDropDown);

    const newCropOption = await screen.findByText("Crop 6");
    userEvent.click(newCropOption);
    const humusBalanceText = await screen.findByText(
      badHumusBalance.toFixed(2)
    );

    expect(humusBalanceText).toMatchSnapshot();
  });
});
