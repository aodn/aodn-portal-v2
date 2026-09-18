import { expect, it, afterEach } from "vitest";
import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import TabsPanelContainer, {
  Tab,
} from "@/components/common/tab/TabsPanelContainer";
import { portalTheme } from "@/styles";

const StatefulPanel = () => {
  const [text, setText] = useState("");
  return (
    <input
      aria-label="Panel notes"
      value={text}
      onChange={(event) => setText(event.target.value)}
    />
  );
};

const tabs: Tab[] = [
  { label: "Summary", value: "summary", component: <div>Summary content</div> },
  { label: "Details", value: "details", component: <StatefulPanel /> },
];

const view = (
  props: {
    tabValue?: number;
    lazyMount?: boolean;
    tabs?: Tab[];
    record?: string;
  } = {}
) => (
  <ThemeProvider theme={portalTheme}>
    <TabsPanelContainer key={props.record} tabs={tabs} {...props} />
  </ThemeProvider>
);

afterEach(cleanup);

it("keeps eager mounting as the default for other consumers", () => {
  render(view());
  expect(screen.getByLabelText("Panel notes")).toBeInTheDocument();
});

it("mounts on first selection and preserves state when hidden", () => {
  render(view({ lazyMount: true }));
  expect(screen.queryByLabelText("Panel notes")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Details" }));
  fireEvent.change(screen.getByLabelText("Panel notes"), {
    target: { value: "Keep my notes" },
  });
  fireEvent.click(screen.getByRole("tab", { name: "Summary" }));
  expect(screen.getByLabelText("Panel notes")).not.toBeVisible();
  fireEvent.click(screen.getByRole("tab", { name: "Details" }));
  expect(screen.getByLabelText("Panel notes")).toHaveValue("Keep my notes");
});

it("honours direct selection and navigation back to index zero", () => {
  const { rerender } = render(view({ lazyMount: true, tabValue: 1 }));
  expect(screen.queryByText("Summary content")).not.toBeInTheDocument();
  expect(screen.getByLabelText("Panel notes")).toBeVisible();
  rerender(view({ lazyMount: true, tabValue: 0 }));
  expect(screen.getByText("Summary content")).toBeVisible();
  expect(screen.getByLabelText("Panel notes")).not.toBeVisible();
  rerender(view({ lazyMount: true, tabValue: 1 }));
  expect(screen.getByLabelText("Panel notes")).toBeVisible();
});

it("keeps panel identity when mobile inserts a map tab", () => {
  const { rerender } = render(view({ lazyMount: true, tabValue: 1 }));
  fireEvent.change(screen.getByLabelText("Panel notes"), {
    target: { value: "Survives resize" },
  });
  const mobileTabs = [
    tabs[0],
    { label: "Map", value: "map", component: <div>Map content</div> },
    tabs[1],
  ];
  rerender(view({ lazyMount: true, tabValue: 2, tabs: mobileTabs }));
  expect(screen.getByLabelText("Panel notes")).toHaveValue("Survives resize");
  expect(screen.getByLabelText("Panel notes")).toBeVisible();
  expect(screen.queryByText("Map content")).not.toBeInTheDocument();
  rerender(view({ lazyMount: true, tabValue: 1 }));
  expect(screen.getByLabelText("Panel notes")).toHaveValue("Survives resize");
});

it("resets visited panels when the dataset key changes", () => {
  const { rerender } = render(
    view({ lazyMount: true, tabValue: 1, record: "first" })
  );
  rerender(view({ lazyMount: true, tabValue: 0, record: "second" }));
  expect(screen.queryByLabelText("Panel notes")).not.toBeInTheDocument();
});
