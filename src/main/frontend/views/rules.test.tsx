import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import RulesView, { loader } from "./rules";

const { useForm, useFormPart, useLoaderData, useRevalidator, RuleService } =
  vi.hoisted(() => ({
    useForm: vi.fn(),
    useFormPart: vi.fn(),
    useLoaderData: vi.fn(),
    useRevalidator: vi.fn(),
    RuleService: {
      getRules: vi.fn(),
      saveRule: vi.fn(),
      deleteRule: vi.fn(),
    },
  }));

vi.mock("@vaadin/hilla-react-form", () => ({
  useForm,
  useFormPart,
}));

vi.mock("Frontend/generated/endpoints", () => ({
  RuleService,
}));

vi.mock("Frontend/generated/com/example/models/MediaRuleModel", () => ({
  default: class MediaRuleModel {},
}));

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useLoaderData, useRevalidator };
});

const mockModel = { name: {}, targetDirectory: {}, id: {} };

function makeFormMock({ read = vi.fn(), reset = vi.fn() } = {}) {
  useForm.mockReturnValue({
    field: vi.fn().mockReturnValue({}),
    model: mockModel,
    submit: vi.fn(),
    reset,
    read,
  });
  useFormPart.mockReturnValue({ invalid: false, ownErrors: [] });
}

describe("loader", () => {
  it("fetches rules and filters out null entries", async () => {
    RuleService.getRules.mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/movies" },
      null,
      { id: 2, name: "TV", targetDirectory: "/tv" },
    ]);
    const result = await loader();
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("Movies");
    expect(result[1].name).toBe("TV");
  });
});

describe("RulesView", () => {
  const mockRevalidate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useLoaderData.mockReturnValue([]);
    useRevalidator.mockReturnValue({
      revalidate: mockRevalidate,
      state: "idle",
    });
    makeFormMock();
  });

  it('shows "No rules exist." when loader data is empty', () => {
    render(<RulesView />);
    expect(screen.getByText("No rules exist.")).toBeInTheDocument();
  });

  it("renders rule rows from loader data", () => {
    useLoaderData.mockReturnValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
      { id: 2, name: "TV Shows", targetDirectory: "/mnt/nas/tv" },
    ]);
    render(<RulesView />);
    expect(screen.getByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("/mnt/nas/movies")).toBeInTheDocument();
    expect(screen.getByText("TV Shows")).toBeInTheDocument();
  });

  it('shows "New Rule" heading, "Save Rule" and Reset buttons by default', () => {
    render(<RulesView />);
    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Rule" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.queryByText("+ New Rule")).not.toBeInTheDocument();
  });

  it('switches to edit mode when "Edit" is clicked', () => {
    useLoaderData.mockReturnValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    render(<RulesView />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByText("Edit Rule")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Update Rule" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Reset" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("+ New Rule")).toBeInTheDocument();
  });

  it('calls read() with the selected rule when "Edit" is clicked', () => {
    const rule = { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" };
    useLoaderData.mockReturnValue([rule]);
    const mockRead = vi.fn();
    makeFormMock({ read: mockRead });

    render(<RulesView />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));

    expect(mockRead).toHaveBeenCalledWith(rule);
  });

  it('returns to create mode when "Editing" button is clicked', () => {
    useLoaderData.mockReturnValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    const mockReset = vi.fn();
    makeFormMock({ reset: mockReset });

    render(<RulesView />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Editing" }));

    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(mockReset).toHaveBeenCalled();
  });

  it('returns to create mode when "+ New Rule" is clicked', () => {
    useLoaderData.mockReturnValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    render(<RulesView />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByText("+ New Rule"));

    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(screen.queryByText("+ New Rule")).not.toBeInTheDocument();
  });

  it("calls deleteRule with the rule id and triggers revalidation", async () => {
    useLoaderData.mockReturnValue([
      { id: 7, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    RuleService.deleteRule.mockResolvedValue(undefined);

    render(<RulesView />);
    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(RuleService.deleteRule).toHaveBeenCalledWith(7));
    await waitFor(() => expect(mockRevalidate).toHaveBeenCalled());
  });

  it('shows "Editing" state on the active row and "Edit" on others', () => {
    useLoaderData.mockReturnValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
      { id: 2, name: "TV Shows", targetDirectory: "/mnt/nas/tv" },
    ]);
    render(<RulesView />);
    fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);

    expect(screen.getByRole("button", { name: "Editing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
