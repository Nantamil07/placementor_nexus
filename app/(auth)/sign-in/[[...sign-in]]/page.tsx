import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-lg border rounded-xl",
          },
        }}
      />
    </div>
  );
}
