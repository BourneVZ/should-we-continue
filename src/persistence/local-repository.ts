import { WORKSPACE_SCHEMA_VERSION } from "@/config/version";
import { parseWorkspaceDocument } from "@/domain/schemas";
import type { WorkspaceDocument } from "@/domain/types";

export type SaveResult = { ok: true } | { ok: false; error: "storage-write-failed" };
export type ClearScope = "user" | "partner" | "all";

export interface LocalWorkspaceRepositoryOptions {
  storage: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  storageKey: string;
}

export interface LocalWorkspaceRepository {
  load(): WorkspaceDocument | null;
  save(document: WorkspaceDocument): SaveResult;
  clear(scope: ClearScope): void;
}

export function createEmptyWorkspaceDocument(): WorkspaceDocument {
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    user: {
      answers: {},
      answersRevision: 0,
      reportView: null,
      reportSourceRevision: null,
    },
    partner: {
      answers: {},
      answersRevision: 0,
      reportView: null,
      reportSourceRevision: null,
    },
    shared: {
      discussion: null,
    },
    deepDive: {
      completedModuleIds: [],
      skippedAll: false,
    },
    regionCache: {
      status: "empty",
      checkedAt: null,
      expiresAt: null,
      verifiedFields: [],
    },
  };
}

export function createLocalWorkspaceRepository(
  options: LocalWorkspaceRepositoryOptions,
): LocalWorkspaceRepository {
  const { storage, storageKey } = options;

  function load(): WorkspaceDocument | null {
    try {
      const raw = storage.getItem(storageKey);
      if (!raw) {
        return null;
      }

      const parsed = parseWorkspaceDocument(JSON.parse(raw));
      if (parsed.schemaVersion !== WORKSPACE_SCHEMA_VERSION) {
        storage.removeItem(storageKey);
        return null;
      }
      return parsed;
    } catch {
      storage.removeItem(storageKey);
      return null;
    }
  }

  function save(document: WorkspaceDocument): SaveResult {
    try {
      storage.setItem(storageKey, JSON.stringify(document));
      return { ok: true };
    } catch {
      return {
        ok: false,
        error: "storage-write-failed",
      };
    }
  }

  function clear(scope: ClearScope): void {
    if (scope === "all") {
      try {
        storage.removeItem(storageKey);
      } catch {
        return;
      }
      return;
    }

    const current = load() ?? createEmptyWorkspaceDocument();
    const next: WorkspaceDocument = {
      ...current,
      user:
        scope === "user"
          ? createEmptyWorkspaceDocument().user
          : current.user,
      partner:
        scope === "partner"
          ? createEmptyWorkspaceDocument().partner
          : current.partner,
      shared: scope === "user" || scope === "partner" ? { discussion: null } : current.shared,
    };

    save(next);
  }

  return {
    load,
    save,
    clear,
  };
}
