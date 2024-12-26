import type { Route } from './+types/home';

export async function loader({ request }: { request: Request }) {
  const user = await fetch(`${process.env.API_HOST}/api/auth/current`, {
    headers: {
      Cookie: request.headers.get('Cookie') || '',
    },
  }).then((r) => r.json());
  return { user };
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home({ loaderData }) {
  return (
    <div>
      User:
      <pre>{JSON.stringify(loaderData.user, null, 2)}</pre>
    </div>
  );
}
