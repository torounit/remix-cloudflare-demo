import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { json } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const getNow = () => {
  return ( new Date() ).toString()
}

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const dateTime = getNow();
  return json({ dateTime });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Now</h1>
      {data.dateTime}
    </div>
  );
}
