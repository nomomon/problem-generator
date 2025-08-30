import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LoginFormProps extends React.ComponentProps<"div"> {
  login: (formData: FormData) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
  className?: string;
}

export function LoginForm({
  login,
  signup,
  className,
  ...props
}: LoginFormProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-bold">Добро пожаловать</h1>
              <p className="text-muted-foreground text-balance">
                Войдите или создайте аккаунт
              </p>
            </div>
            <Tabs defaultValue="login" className="w-full">
              <TabsList>
                <TabsTrigger value="login">Войти</TabsTrigger>
                <TabsTrigger value="signup">Зарегистрироваться</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-4">
                <form className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="login-email">Электронная почта</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Пароль</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                    />
                  </div>
                  <Button formAction={login} type="submit" className="w-full">
                    Войти
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-4">
                <form className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="signup-email">Электронная почта</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="signup-password">Пароль</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      autoComplete="new-password"
                    />
                  </div>
                  <Button formAction={signup} type="submit" className="w-full">
                    Создать аккаунт
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/placeholder.svg"
              alt="Изображение"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
