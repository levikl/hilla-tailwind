import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import type { Mock } from "vitest";
import RuleEditor from "./rules";

vi.mock("@vaadin/hilla-react-form", () => ({
  useForm: vi.fn(),
  useFormPart: vi.fn(),
}));

vi.mock("Frontend/generated/endpoints", () => ({
  RuleService: {
    getRules: vi.fn(),
    saveRule: vi.fn(),
    deleteRule: vi.fn(),
  },
}));

vi.mock("Frontend/generated/com/example/models/MediaRuleModel", () => ({
  default: class MediaRuleModel {},
}));

import { useForm, useFormPart } from "@vaadin/hilla-react-form";
import { RuleService } from "Frontend/generated/endpoints";

const mockModel = { name: {}, targetDirectory: {}, id: {} };

function makeFormMock({ read = vi.fn(), reset = vi.fn() } = {}) {
  (useForm as Mock).mockReturnValue({
    field: vi.fn().mockReturnValue({}),
    model: mockModel,
    submit: vi.fn(),
    reset,
    read,
  });
  (useFormPart as Mock).mockReturnValue({ invalid: false, ownErrors: [] });
}

describe("RuleEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (RuleService.getRules as Mock).mockResolvedValue([]);
    makeFormMock();
  });

  it('shows "No rules exist." when the list is empty', async () => {
    render(<RuleEditor />);
    expect(await screen.findByText("No rules exist.")).toBeInTheDocument();
  });

  it("renders rule rows when rules are returned", async () => {
    (RuleService.getRules as Mock).mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
      { id: 2, name: "TV Shows", targetDirectory: "/mnt/nas/tv" },
    ]);
    render(<RuleEditor />);
    expect(await screen.findByText("Movies")).toBeInTheDocument();
    expect(screen.getByText("/mnt/nas/movies")).toBeInTheDocument();
    expect(screen.getByText("TV Shows")).toBeInTheDocument();
  });

  it('shows "New Rule" heading, "Save Rule" and Reset buttons by default', () => {
    render(<RuleEditor />);
    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save Rule" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
    expect(screen.queryByText("+ New Rule")).not.toBeInTheDocument();
  });

  it('switches to edit mode when "Edit" is clicked', async () => {
    (RuleService.getRules as Mock).mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    render(<RuleEditor />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));

    expect(screen.getByText("Edit Rule")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Update Rule" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Reset" })).not.toBeInTheDocument();
    expect(screen.getByText("+ New Rule")).toBeInTheDocument();
  });

  it('calls read() with the selected rule when "Edit" is clicked', async () => {
    const rule = { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" };
    (RuleService.getRules as Mock).mockResolvedValue([rule]);
    const mockRead = vi.fn();
    makeFormMock({ read: mockRead });

    render(<RuleEditor />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));

    expect(mockRead).toHaveBeenCalledWith(rule);
  });

  it('returns to create mode when "Editing" button is clicked', async () => {
    (RuleService.getRules as Mock).mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    const mockReset = vi.fn();
    makeFormMock({ reset: mockReset });

    render(<RuleEditor />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Editing" }));

    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(mockReset).toHaveBeenCalled();
  });

  it('returns to create mode when "+ New Rule" is clicked', async () => {
    (RuleService.getRules as Mock).mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
    ]);
    render(<RuleEditor />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByText("+ New Rule"));

    expect(screen.getByText("New Rule")).toBeInTheDocument();
    expect(screen.queryByText("+ New Rule")).not.toBeInTheDocument();
  });

  it("calls deleteRule with the rule id and reloads on Delete click", async () => {
    const rule = { id: 7, name: "Movies", targetDirectory: "/mnt/nas/movies" };
    (RuleService.getRules as Mock).mockResolvedValue([rule]);
    (RuleService.deleteRule as Mock).mockResolvedValue(undefined);

    render(<RuleEditor />);
    fireEvent.click(await screen.findByRole("button", { name: "Edit" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => expect(RuleService.deleteRule).toHaveBeenCalledWith(7));
    await waitFor(() => expect(RuleService.getRules).toHaveBeenCalledTimes(2));
  });

  it('shows "Editing" state on the active row', async () => {
    (RuleService.getRules as Mock).mockResolvedValue([
      { id: 1, name: "Movies", targetDirectory: "/mnt/nas/movies" },
      { id: 2, name: "TV Shows", targetDirectory: "/mnt/nas/tv" },
    ]);
    render(<RuleEditor />);
    const editBtns = await screen.findAllByRole("button", { name: "Edit" });
    fireEvent.click(editBtns[0]);

    expect(screen.getByRole("button", { name: "Editing" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });
});
