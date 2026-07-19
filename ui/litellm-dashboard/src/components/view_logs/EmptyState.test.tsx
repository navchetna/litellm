import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders no-logs-in-range variant correctly", () => {
    render(
      <EmptyState
        variant="no-logs-in-range"
        timeRange="Last 24 hours"
      />
    );

    expect(screen.getByText("No logs in this time range")).toBeInTheDocument();
    expect(screen.getByText(/No logs found in Last 24 hours/)).toBeInTheDocument();
  });

  it("renders filtered-empty variant with active filters", () => {
    const filters = ["search: test", "status: failure"];
    render(
      <EmptyState
        variant="filtered-empty"
        activeFilters={filters}
      />
    );

    expect(screen.getByText("No matching logs")).toBeInTheDocument();
    expect(screen.getByText(/search: test, status: failure/)).toBeInTheDocument();
  });

  it("renders first-time variant correctly", () => {
    render(
      <EmptyState variant="first-time" />
    );

    expect(screen.getByText("No logs yet")).toBeInTheDocument();
    expect(screen.getByText(/Your API requests will appear here/)).toBeInTheDocument();
  });

  it("calls onResetFilters when Reset Filters button is clicked", async () => {
    const user = userEvent.setup();
    const onResetFilters = jest.fn();

    render(
      <EmptyState
        variant="filtered-empty"
        activeFilters={["test filter"]}
        onResetFilters={onResetFilters}
      />
    );

    const resetButton = screen.getByRole("button", { name: /reset filters/i });
    await user.click(resetButton);

    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });

  it("calls onExpandTimeRange when Expand Time Range button is clicked", async () => {
    const user = userEvent.setup();
    const onExpandTimeRange = jest.fn();

    render(
      <EmptyState
        variant="no-logs-in-range"
        timeRange="Last 24 hours"
        onExpandTimeRange={onExpandTimeRange}
      />
    );

    const expandButton = screen.getByRole("button", { name: /expand time range/i });
    await user.click(expandButton);

    expect(onExpandTimeRange).toHaveBeenCalledTimes(1);
  });

  it("does not render action button for first-time variant", () => {
    render(<EmptyState variant="first-time" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
