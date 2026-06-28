export interface BrowserStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export function createBrowserStorageAdapter(getStorage: () => Storage): BrowserStorageAdapter {
  function readStorage(): Storage | null {
    try {
      return getStorage();
    } catch {
      return null;
    }
  }

  return {
    getItem(key) {
      const storage = readStorage();
      if (!storage) {
        return null;
      }

      return storage.getItem(key);
    },
    setItem(key, value) {
      const storage = readStorage();
      if (!storage) {
        throw new Error("browser storage unavailable");
      }

      storage.setItem(key, value);
    },
    removeItem(key) {
      const storage = readStorage();
      if (!storage) {
        return;
      }

      storage.removeItem(key);
    },
  };
}
