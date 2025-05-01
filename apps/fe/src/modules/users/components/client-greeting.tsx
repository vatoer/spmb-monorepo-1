'use client';
import { useTRPC } from '@repo/trpc/client';
import { useQuery } from '@tanstack/react-query';
export function ClientGreeting() {
  const trpc = useTRPC();
  const users = useQuery(trpc.users.getMany.queryOptions());
  return <div>
    <div>
      isLoading: {users.isLoading ? 'true' : 'false'}
    </div>
    <div>{JSON.stringify(users.data, null, 2)}</div>
    </div>;
}