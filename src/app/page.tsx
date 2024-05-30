"use client"

import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignInButton mode="modal"></SignInButton>
     <Button>Hello world</Button>
    </main>
  );
}
