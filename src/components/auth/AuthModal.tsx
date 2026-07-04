import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthModal } from "@/hooks/use-auth-modal";
import { signInMock, type MockUser } from "@/lib/mock-auth";
import { Loader2, Bus } from "lucide-react";

export function AuthModal() {
  const { open, mode, closeModal } = useAuthModal();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<MockUser["role"]>("admin");

  async function submit(kind: "signin" | "signup") {
    if (!email.includes("@")) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    signInMock({
      email,
      name: kind === "signup" ? name || email.split("@")[0] : email.split("@")[0],
      role: kind === "signup" ? role : "admin",
    });
    setLoading(false);
    closeModal();
    navigate({ to: "/dashboard" });
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
        <Tabs defaultValue={mode} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-3 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="si-email">Email</Label>
              <Input
                id="si-email"
                type="email"
                placeholder="you@unilag.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="si-pw">Password</Label>
              <Input id="si-pw" type="password" placeholder="••••••••" defaultValue="demo1234" />
            </div>
            <Button className="w-full" onClick={() => submit("signin")} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => submit("signin")}
              disabled={loading}
            >
              Continue with Google
            </Button>
          </TabsContent>
          <TabsContent value="signup" className="space-y-3 pt-4">
            <div className="space-y-1.5">
              <Label htmlFor="su-name">Full name</Label>
              <Input
                id="su-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Okafor"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-email">Email</Label>
              <Input
                id="su-email"
                type="email"
                placeholder="you@unilag.edu.ng"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="su-pw">Password</Label>
              <Input id="su-pw" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as MockUser["role"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">PESSA Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={() => submit("signup")} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
