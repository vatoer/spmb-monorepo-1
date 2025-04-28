import { Button } from "@repo/ui/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold">Welcome to the control panel!</h1>
      <Button className="mt-4">Click me</Button>
    </div>
  );
}
