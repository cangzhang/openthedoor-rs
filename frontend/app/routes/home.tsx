import { redirect } from 'react-router';

export async function loader({ request }: { request: Request }) {
  try {
    const ck = request.headers.get('Cookie');
    if (!ck) {
      return redirect('/login', {
        headers: {
          'Set-Cookie': 'token=; Path=/; HttpOnly; SameSite=Strict;',
        },
      });
    }
    const user = await fetch(`${process.env.API_HOST}/api/auth/current`, {
      headers: {
        Cookie: request.headers.get('Cookie') || '',
      },
    }).then((r) => r.json());
    return { user };
  } catch (error) {
    return { user: null };
  }
}

export function meta() {
  return [
    { title: 'Open the Door' },
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
