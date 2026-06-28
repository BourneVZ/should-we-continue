import { describe, expect, it } from "vitest";
import { createBrowserStorageAdapter } from "@/persistence/browser-storage";

class MemoryStorage implements Storage {
  private readonly data = new Map<string, string>();

  get length(): number {
    return this.data.size;
  }

  clear(): void {
    this.data.clear();
  }

  getItem(key: string): string | null {
    return this.data.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.data.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }
}

describe("createBrowserStorageAdapter", () => {
  it("reads and writes through when browser storage is available", () => {
    const storage = new MemoryStorage();
    const adapter = createBrowserStorageAdapter(() => storage);

    adapter.setItem("workspace", "saved");

    expect(adapter.getItem("workspace")).toBe("saved");
  });

  it("returns null on reads when browser storage access is blocked", () => {
    const adapter = createBrowserStorageAdapter(() => {
      throw new Error("SecurityError");
    });

    expect(adapter.getItem("workspace")).toBeNull();
  });

  it("throws on writes when browser storage access is blocked", () => {
    const adapter = createBrowserStorageAdapter(() => {
      throw new Error("SecurityError");
    });

    expect(() => adapter.setItem("workspace", "saved")).toThrow("browser storage unavailable");
  });

  it("ignores remove attempts when browser storage access is blocked", () => {
    const adapter = createBrowserStorageAdapter(() => {
      throw new Error("SecurityError");
    });

    expect(() => adapter.removeItem("workspace")).not.toThrow();
  });
});
