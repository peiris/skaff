import { authConfigPath, authProviders } from "@/lib/auth-providers";
import type { FileMap } from "@/types/file-map";

const authSource = `import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";
import { emulatedProviders } from "@/lib/auth/emulated-providers";

const emulated = process.env.AUTH_EMULATE === "true";

export const auth = betterAuth({
  database: new Database("sqlite.db"),
  socialProviders: emulated
    ? {}
    : {
${authProviders
  .map(
    (provider) =>
      `        ${provider.id}: {
          clientId: process.env.${provider.envPrefix}_CLIENT_ID ?? "",
          clientSecret: process.env.${provider.envPrefix}_CLIENT_SECRET ?? "",
        },`,
  )
  .join("\n")}
      },
  plugins: [...(emulated ? [genericOAuth({ config: emulatedProviders })] : []), nextCookies()],
});
`;

const emulatedProvidersSource = `import type { GenericOAuthConfig } from "better-auth/plugins";

const origin = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

type GithubProfile = { id: number; login: string; name: string | null; email: string | null; avatar_url: string };

export const emulatedProviders: GenericOAuthConfig[] = [
  {
    providerId: "google",
    clientId: "emulated",
    clientSecret: "emulated",
    discoveryUrl: \`\${origin}/api/emulate/google/.well-known/openid-configuration\`,
    authorizationUrl: \`\${origin}/emulated-sign-in/google\`,
    scopes: ["openid", "email", "profile"],
  },
  {
    providerId: "github",
    clientId: "emulated",
    clientSecret: "emulated",
    authorizationUrl: \`\${origin}/emulated-sign-in/github\`,
    tokenUrl: \`\${origin}/api/emulate/github/login/oauth/access_token\`,
    scopes: ["read:user", "user:email"],
    getUserInfo: async (tokens) => {
      const response = await fetch(\`\${origin}/api/emulate/github/user\`, { headers: { Authorization: \`Bearer \${tokens.accessToken}\` } });
      if (!response.ok) {
        return null;
      }
      const profile: GithubProfile = await response.json();
      return {
        id: String(profile.id),
        email: profile.email ?? undefined,
        name: profile.name ?? profile.login,
        image: profile.avatar_url,
        emailVerified: true,
      };
    },
  },
];
`;

const emulatedAccountsSource = `export type EmulatedAccount = { id: string; name: string; email: string };

export const emulatedAccounts = {
  google: [{ id: "ada@example.com", name: "Ada Lovelace", email: "ada@example.com" }],
  github: [{ id: "grace", name: "Grace Hopper", email: "grace@example.com" }],
} satisfies Record<string, EmulatedAccount[]>;
`;

const emulatedSignInPageSource = `import { EmulatedAccountPicker } from "@/components/emulated-account-picker";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Sign in (emulated)" };

export default function EmulatedSignInPage(props: PageProps<"/emulated-sign-in/[provider]">) {
  return (
    <Suspense>
      <EmulatedAccountPicker {...props} />
    </Suspense>
  );
}
`;

const emulatedAccountPickerSource = (shadcn: boolean) => `${
  shadcn
    ? `import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
`
    : ""
}import { SectionContainer } from "@/components/section-container";
import { emulatedAccounts } from "@/lib/auth/emulated-accounts";
import { notFound } from "next/navigation";

const pickers = [
${authProviders
  .map(
    (provider) =>
      `  { id: "${provider.id}", label: "${provider.label}", callback: "${provider.emulator.callback}", field: "${provider.emulator.field}", accounts: emulatedAccounts.${provider.id} },`,
  )
  .join("\n")}
];

export async function EmulatedAccountPicker({ params, searchParams }: PageProps<"/emulated-sign-in/[provider]">) {
  const { provider } = await params;
  const picker = pickers.find((entry) => entry.id === provider);
  if (!picker) {
    notFound();
  }
  const forwarded = Object.entries(await searchParams).map(([name, value]) => [name, Array.isArray(value) ? value[0] : value] as const);
  return (
    <main className="flex flex-1 flex-col">
      <section className="flex flex-1 items-center py-24 md:py-32">
        <SectionContainer className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm text-muted-foreground">Emulated</p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Sign in to {picker.label}</h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Pick a seeded account. No real {picker.label} request is made; edit the list in lib/auth/emulated-accounts.ts.
            </p>
          </div>
          <div className="flex w-full max-w-md flex-col gap-3">
            {picker.accounts.map((account) => (
              <form key={account.id} method="post" action={picker.callback}>
                <input type="hidden" name={picker.field} value={account.id} />
                {forwarded.map(([name, value]) => (
                  <input key={name} type="hidden" name={name} value={value ?? ""} />
                ))}
                ${
                  shadcn
                    ? `<Button type="submit" variant="outline" size="lg" className="h-auto w-full justify-start">
                  <Avatar>
                    <AvatarFallback>{account.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <span className="flex flex-col items-start">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-sm text-muted-foreground">{account.email}</span>
                  </span>
                </Button>`
                    : `<button type="submit" className="flex w-full items-center gap-3 rounded-md border px-4 py-3 text-left">
                  <span className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium">{account.name.slice(0, 1)}</span>
                  <span className="flex flex-col">
                    <span className="font-medium">{account.name}</span>
                    <span className="text-sm text-muted-foreground">{account.email}</span>
                  </span>
                </button>`
                }
              </form>
            ))}
          </div>
        </SectionContainer>
      </section>
    </main>
  );
}
`;

const emulateRouteSource = `import { createEmulateHandler } from "@emulators/adapter-next";
import * as github from "@emulators/github";
import * as google from "@emulators/google";
import { emulatedAccounts } from "@/lib/auth/emulated-accounts";

const emulator = createEmulateHandler({
  services: {
    google: {
      emulator: google,
      seed: { users: emulatedAccounts.google.map((account) => ({ email: account.email, name: account.name })) },
    },
    github: {
      emulator: github,
      seed: { users: emulatedAccounts.github.map((account) => ({ login: account.id, name: account.name, email: account.email })) },
    },
  },
});

const enabled = process.env.AUTH_EMULATE === "true";
const disabled: typeof emulator.GET = () => Promise.resolve(new Response(null, { status: 404 }));

export const GET = enabled ? emulator.GET : disabled;
export const POST = enabled ? emulator.POST : disabled;
export const PUT = enabled ? emulator.PUT : disabled;
export const PATCH = enabled ? emulator.PATCH : disabled;
export const DELETE = enabled ? emulator.DELETE : disabled;
`;

const authClientSource = `import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
`;

const routeSource = `import { auth } from "@/lib/auth/server";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);
`;

const signInButtonsSource = (shadcn: boolean) => `"use client";

${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { authClient } from "@/lib/auth/client";

const providers = [
${authProviders.map((provider) => `  { id: "${provider.id}", label: "Continue with ${provider.label}" },`).join("\n")}
] as const;

export function AuthSignInButtons() {
  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        ${
          shadcn
            ? `<Button
          key={provider.id}
          variant="outline"
          onClick={() => authClient.signIn.social({ provider: provider.id, callbackURL: "/dashboard" })}
        >
          {provider.label}
        </Button>`
            : `<button
          key={provider.id}
          type="button"
          className="rounded-md border px-4 py-2 text-sm font-medium"
          onClick={() => authClient.signIn.social({ provider: provider.id, callbackURL: "/dashboard" })}
        >
          {provider.label}
        </button>`
        }
      ))}
    </div>
  );
}
`;

const signOutButtonSource = (shadcn: boolean) => `"use client";

${shadcn ? 'import { Button } from "@/components/ui/button";\n' : ""}import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export function AuthSignOutButton() {
  const router = useRouter();
  const signOut = () => authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  return ${
    shadcn
      ? `(
    <Button variant="outline" onClick={signOut}>
      Sign out
    </Button>
  )`
      : `(
    <button type="button" onClick={signOut} className="rounded-md border px-4 py-2 text-sm font-medium">
      Sign out
    </button>
  )`
  };
}
`;

const proxySource = `import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const signedIn = Boolean(getSessionCookie(request));
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/dashboard") && !signedIn) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (pathname === "/sign-in" && signedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/sign-in"] };
`;

const signedInRedirectSource = `import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function AuthSignedInRedirect() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/dashboard");
  }
  return null;
}
`;

const dashboardWelcomeSource = `import { AuthSignOutButton } from "@/components/auth-sign-out-button";
import { auth } from "@/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function DashboardWelcome() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/sign-in");
  }
  return (
    <>
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Welcome, {session.user.name}</h1>
        <p className="max-w-xl text-lg text-muted-foreground">Signed in as {session.user.email}.</p>
      </div>
      <AuthSignOutButton />
    </>
  );
}
`;

const signInPageSource = `import { AuthSignInButtons } from "@/components/auth-sign-in-buttons";
import { AuthSignedInRedirect } from "@/components/auth-signed-in-redirect";
import { SectionContainer } from "@/components/section-container";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main className="flex flex-1 flex-col">
      <Suspense>
        <AuthSignedInRedirect />
      </Suspense>
      <section className="flex flex-1 items-center py-24 md:py-32">
        <SectionContainer className="flex flex-col items-start gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Sign in</h1>
            <p className="max-w-xl text-lg text-muted-foreground">Use one of your existing accounts to continue.</p>
          </div>
          <AuthSignInButtons />
        </SectionContainer>
      </section>
    </main>
  );
}
`;

const dashboardPageSource = `import { DashboardWelcome } from "@/components/dashboard-welcome";
import { SectionContainer } from "@/components/section-container";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="py-24 md:py-32">
        <SectionContainer className="flex flex-col items-start gap-6">
          <Suspense
            fallback={
              <div className="flex flex-col gap-4" aria-busy="true">
                <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">Welcome</h1>
                <p className="max-w-xl text-lg text-muted-foreground">Loading your account…</p>
              </div>
            }
          >
            <DashboardWelcome />
          </Suspense>
        </SectionContainer>
      </section>
    </main>
  );
}
`;

export function authFiles(shadcn: boolean): FileMap {
  return {
    [authConfigPath]: authSource,
    "lib/auth/client.ts": authClientSource,
    "lib/auth/emulated-providers.ts": emulatedProvidersSource,
    "lib/auth/emulated-accounts.ts": emulatedAccountsSource,
    "app/(auth)/emulated-sign-in/[provider]/page.tsx": emulatedSignInPageSource,
    "components/emulated-account-picker.tsx": emulatedAccountPickerSource(shadcn),
    "app/api/emulate/[...path]/route.ts": emulateRouteSource,
    "app/api/auth/[...all]/route.ts": routeSource,
    "app/(auth)/sign-in/page.tsx": signInPageSource,
    "app/(dashboard)/dashboard/page.tsx": dashboardPageSource,
    "proxy.ts": proxySource,
    "components/auth-signed-in-redirect.tsx": signedInRedirectSource,
    "components/dashboard-welcome.tsx": dashboardWelcomeSource,
    "components/auth-sign-in-buttons.tsx": signInButtonsSource(shadcn),
    "components/auth-sign-out-button.tsx": signOutButtonSource(shadcn),
  };
}
