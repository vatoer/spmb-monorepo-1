import { prismaDbAuth } from "@repo/db";
import { Button } from "@repo/ui/components/ui/button";

export default async function Home() {
  const user = await prismaDbAuth.user.findMany();
  console.log(user);

  return (
    <div className="bg-blue-500 h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Welcome to Next.js!</h1>
      <p className="mt-4 text-lg text-white">
        Turborepo Shadcn Integration
      </p>
      <div className="mt-8">
        <Button variant="destructive" size="lg">
          Click Me
        </Button>
      </div>
      
    </div>
  );
}
