import { createContext, useContext, useState, type ReactNode } from "react";

type AuthModalCtx = {
  open: boolean;
  mode: "signin" | "signup";
  openModal: (mode?: "signin" | "signup") => void;
  closeModal: () => void;
};

const Ctx = createContext<AuthModalCtx | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  return (
    <Ctx.Provider
      value={{
        open,
        mode,
        openModal: (m = "signin") => {
          setMode(m);
          setOpen(true);
        },
        closeModal: () => setOpen(false),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuthModal() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuthModal must be used inside AuthModalProvider");
  return v;
}
