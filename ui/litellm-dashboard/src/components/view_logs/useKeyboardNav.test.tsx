import { renderHook, act } from "@testing-library/react";
import { useKeyboardNav } from "./useKeyboardNav";
import { createRef } from "react";

describe("useKeyboardNav", () => {
  const mockData = [
    { id: "1", name: "Log 1" },
    { id: "2", name: "Log 2" },
    { id: "3", name: "Log 3" },
  ];

  const defaultProps = {
    data: mockData,
    onSelectLog: jest.fn(),
    onOpenDrawer: jest.fn(),
    onCloseDrawer: jest.fn(),
    searchInputRef: createRef<HTMLInputElement>(),
    onToggleLive: jest.fn(),
    onShowHelp: jest.fn(),
    isDrawerOpen: false,
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with selectedIndex -1", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));
    expect(result.current.selectedIndex).toBe(-1);
  });

  it("increments selectedIndex on 'j' key press", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const event = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(event);
    });

    expect(result.current.selectedIndex).toBe(0);
    expect(defaultProps.onSelectLog).toHaveBeenCalledWith(mockData[0]);
  });

  it("decrements selectedIndex on 'k' key press", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const jEvent = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(jEvent);
    });

    act(() => {
      const jEvent = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(jEvent);
    });

    expect(result.current.selectedIndex).toBe(1);

    act(() => {
      const kEvent = new KeyboardEvent("keydown", { key: "k" });
      document.dispatchEvent(kEvent);
    });

    expect(result.current.selectedIndex).toBe(0);
    expect(defaultProps.onSelectLog).toHaveBeenCalledWith(mockData[0]);
  });

  it("does not decrement below 0", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const kEvent = new KeyboardEvent("keydown", { key: "k" });
      document.dispatchEvent(kEvent);
    });

    expect(result.current.selectedIndex).toBe(-1);
  });

  it("does not increment beyond data length", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));

    for (let i = 0; i < 5; i++) {
      act(() => {
        const jEvent = new KeyboardEvent("keydown", { key: "j" });
        document.dispatchEvent(jEvent);
      });
    }

    expect(result.current.selectedIndex).toBe(2);
  });

  it("opens drawer on Enter key when a row is selected", () => {
    const { result } = renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const jEvent = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(jEvent);
    });

    act(() => {
      const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
      document.dispatchEvent(enterEvent);
    });

    expect(defaultProps.onOpenDrawer).toHaveBeenCalled();
  });

  it("closes drawer on Escape key when drawer is open", () => {
    const props = { ...defaultProps, isDrawerOpen: true };
    renderHook(() => useKeyboardNav(props));

    act(() => {
      const escEvent = new KeyboardEvent("keydown", { key: "Escape" });
      document.dispatchEvent(escEvent);
    });

    expect(defaultProps.onCloseDrawer).toHaveBeenCalled();
  });

  it("toggles live mode on 'l' key press", () => {
    renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const lEvent = new KeyboardEvent("keydown", { key: "l" });
      document.dispatchEvent(lEvent);
    });

    expect(defaultProps.onToggleLive).toHaveBeenCalled();
  });

  it("shows help modal on '?' key press", () => {
    renderHook(() => useKeyboardNav(defaultProps));

    act(() => {
      const helpEvent = new KeyboardEvent("keydown", { key: "?" });
      document.dispatchEvent(helpEvent);
    });

    expect(defaultProps.onShowHelp).toHaveBeenCalled();
  });

  it("does not trigger shortcuts when input is focused", () => {
    renderHook(() => useKeyboardNav(defaultProps));

    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    act(() => {
      const jEvent = new KeyboardEvent("keydown", {
        key: "j",
        bubbles: true,
      });
      Object.defineProperty(jEvent, "target", { value: input, enumerable: true });
      document.dispatchEvent(jEvent);
    });

    expect(defaultProps.onSelectLog).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it("resets selectedIndex when data changes", () => {
    const { result, rerender } = renderHook(
      (props) => useKeyboardNav(props),
      { initialProps: defaultProps },
    );

    act(() => {
      const jEvent = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(jEvent);
    });

    expect(result.current.selectedIndex).toBe(0);

    rerender({ ...defaultProps, data: [] });

    expect(result.current.selectedIndex).toBe(-1);
  });

  it("does not trigger shortcuts when disabled", () => {
    const props = { ...defaultProps, enabled: false };
    renderHook(() => useKeyboardNav(props));

    act(() => {
      const jEvent = new KeyboardEvent("keydown", { key: "j" });
      document.dispatchEvent(jEvent);
    });

    expect(defaultProps.onSelectLog).not.toHaveBeenCalled();
  });
});
