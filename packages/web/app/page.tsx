import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          UI Vault
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage, preview, and export UI style foundations
        </p>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Open Dashboard
        </Link>
      </div>
    </div>
  );
}
