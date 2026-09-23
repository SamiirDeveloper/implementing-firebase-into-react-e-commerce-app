import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Logout from "../pages/Logout";

test("matches snapshot", () => {
  const { asFragment } = render(
    <MemoryRouter>
      <Logout />
    </MemoryRouter>
  );

  expect(asFragment()).toMatchSnapshot();
});