export type MockUser = {
  name: string;
  email: string;
  role: "student" | "admin";
};

const KEY = "shuttle-eta-user";

export function getMockUser(): MockUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function signInMock(user: MockUser) {
  window.localStorage.setItem(KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("shuttle-eta-auth"));
}

export function signOutMock() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("shuttle-eta-auth"));
}
