import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { signInMock, ADMIN_CODE, type MockUser } from "@/lib/mock-auth";
import { Loader2, Bus, ShieldCheck, Eye, EyeOff } from "lucide-react";

export function AuthModal() {
  const { open, mode, closeModal } = useAuthModal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<MockUser["role"]>("student");
  const [adminCode, setAdminCode] = useState("");
  const [adminCodeErr, setAdminCodeErr] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [tab, setTab] = useState(mode);

  async function submit(kind: "signin" | "signup") {
    if (!email.includes("@")) return;
    // Admin passcode gate
    if (role === "admin" || kind === "signin") {
      // On sign-in we'll treat any user who filled the code as admin
    }
    const isAdminAttempt = role === "admin";
    if (isAdminAttempt && adminCode !== ADMIN_CODE) {
      setAdminCodeErr(true);
      return;
    }
    setAdminCodeErr(false);
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const finalRole: MockUser["role"] = isAdminAttempt ? "admin" : "student";
    signInMock({
      email,
      name: kind === "signup" ? name || email.split("@")[0] : email.split("@")[0],
      role: finalRole,
    });
    setLoading(false);
    closeModal();
    // Route based on role
    navigate({ to: finalRole === "admin" ? "/dashboard" : "/ride" });
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? null : closeModal())}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Bus className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to Shuttle ETA</DialogTitle>
          <DialogDescription className="text-center">
            Demo mode — no real account is created.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>

          {/* ── SIGN IN ── */}
          <TabsContent value="signin" className="space-y-3 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="si-email">Email</Label>
              <Input id="si-email" type="email" placeholder="you@unilag.edu.ng"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="si-pw">Password</Label>
              <Input id="si-pw" type="password" placeholder="••••••••" defaultValue="demo1234" />
            </div>
            <Button className="w-full" onClick={() => { setRole("student"); submit("signin"); }} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in as Student
            </Button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-2">or</span></div></div>
            <AdminCodeField
              adminCode={adminCode} setAdminCode={setAdminCode}
              showCode={showCode} setShowCode={setShowCode} err={adminCodeErr}
            />
            <Button variant="outline" className="w-full gap-2" onClick={() => { setRole("admin"); submit("signin"); }} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <ShieldCheck className="h-4 w-4 text-primary" /> Sign in as PESSA Admin
            </Button>
          </TabsContent>

          {/* ── SIGN UP ── */}
          <TabsContent value="signup" className="space-y-3 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="su-name">Full name</Label>
              <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Okafor" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email</Label>
              <Input id="su-email" type="email" placeholder="you@unilag.edu.ng"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-pw">Password</Label>
              <Input id="su-pw" type="password" placeholder="••••••••" />
            </div>

            <Button className="w-full" onClick={() => { setRole("student"); submit("signup"); }} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create student account
            </Button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div><div className="relative flex justify-center text-xs text-muted-foreground"><span className="bg-background px-2">PESSA Admin?</span></div></div>
            <AdminCodeField
              adminCode={adminCode} setAdminCode={setAdminCode}
              showCode={showCode} setShowCode={setShowCode} err={adminCodeErr}
            />
            <Button variant="outline" className="w-full gap-2" onClick={() => { setRole("admin"); submit("signup"); }} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <ShieldCheck className="h-4 w-4 text-primary" /> Register as Admin
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function AdminCodeField({ adminCode, setAdminCode, showCode, setShowCode, err }: {
  adminCode: string; setAdminCode: (v: string) => void;
  showCode: boolean; setShowCode: (v: boolean) => void; err: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="admin-code" className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Admin passcode
      </Label>
      <div className="relative">
        <Input
          id="admin-code"
          type={showCode ? "text" : "password"}
          placeholder="Enter PESSA admin code"
          value={adminCode}
          onChange={(e) => setAdminCode(e.target.value)}
          className={err ? "border-destructive ring-destructive/30 ring-1" : ""}
        />
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {showCode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {err && <p className="text-xs text-destructive">Incorrect admin passcode. Try PESSA2026.</p>}
      <p className="text-xs text-muted-foreground">Leave blank to sign in as a student instead.</p>
    </div>
  );
}
