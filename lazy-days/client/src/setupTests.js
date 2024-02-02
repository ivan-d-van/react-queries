
import "@testing-library/jest-dom/vitest";

import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

import { server } from "./mocks/server.js";

expect.extend(matchers);

vi.mock("./auth/AuthContext", () => ({
  __esModule: true,
  useLoginData: () => ({ userId: 1 }),
  default: ({ children }) => children,
}));

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());
