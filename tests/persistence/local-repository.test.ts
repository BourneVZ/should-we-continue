import { describe, expect, it } from "vitest";
import { WORKSPACE_SCHEMA_VERSION } from "@/config/version";
import { createReportViewModel, createWorkspaceDocument } from "../fixtures/factories";
import { createLocalWorkspaceRepository } from "@/persistence/local-repository";

class FakeStorage implements Storage {
  private readonly data = new Map<string, string>();

  constructor(private readonly failOnSet = false) {}

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
    if (this.failOnSet) {
      throw new Error("quota exceeded");
    }
    this.data.set(key, value);
  }
}

describe("createLocalWorkspaceRepository", () => {
  it("saves and loads a workspace document atomically", () => {
    const storage = new FakeStorage();
    const repository = createLocalWorkspaceRepository({ storage, storageKey: "workspace" });
    const document = createWorkspaceDocument();

    const result = repository.save(document);

    expect(result.ok).toBe(true);
    expect(repository.load()).toEqual(document);
  });

  it("returns a classified failure without silently persisting when storage write fails", () => {
    const storage = new FakeStorage(true);
    const repository = createLocalWorkspaceRepository({ storage, storageKey: "workspace" });

    const result = repository.save(createWorkspaceDocument());

    expect(result).toEqual({
      ok: false,
      error: "storage-write-failed",
    });
    expect(storage.getItem("workspace")).toBeNull();
  });

  it("clears incompatible persisted data instead of loading it", () => {
    const storage = new FakeStorage();
    storage.setItem(
      "workspace",
      JSON.stringify({
        ...createWorkspaceDocument(),
        schemaVersion: "older-version",
      }),
    );

    const repository = createLocalWorkspaceRepository({ storage, storageKey: "workspace" });

    expect(repository.load()).toBeNull();
    expect(storage.getItem("workspace")).toBeNull();
  });

  it("clears user data without keeping the personal report or shared discussion", () => {
    const storage = new FakeStorage();
    const repository = createLocalWorkspaceRepository({ storage, storageKey: "workspace" });
    repository.save(
      createWorkspaceDocument({
        user: {
          answers: { a1: { status: "answered", value: "x" } },
          answersRevision: 2,
          reportView: createReportViewModel(),
          reportSourceRevision: 2,
        },
        shared: {
          discussion: {
            summaryIds: ["summary-1"],
            pathContinue: [],
            pathEnd: [],
            sharedNotes: [],
          },
        },
      }),
    );

    repository.clear("user");
    const loaded = repository.load();

    expect(loaded?.user.answers).toEqual({});
    expect(loaded?.user.reportView).toBeNull();
    expect(loaded?.shared.discussion).toBeNull();
    expect(loaded?.schemaVersion).toBe(WORKSPACE_SCHEMA_VERSION);
  });

  it("clears only partner data when asked", () => {
    const storage = new FakeStorage();
    const repository = createLocalWorkspaceRepository({ storage, storageKey: "workspace" });
    repository.save(
      createWorkspaceDocument({
        partner: {
          answers: { p1: { status: "answered", value: "y" } },
          answersRevision: 3,
          reportView: createReportViewModel(),
          reportSourceRevision: 3,
        },
      }),
    );

    repository.clear("partner");
    const loaded = repository.load();

    expect(loaded?.partner.answers).toEqual({});
    expect(loaded?.user.answers).toEqual({});
  });
});
