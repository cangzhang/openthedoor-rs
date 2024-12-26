import { Link, redirect, useLoaderData, Outlet } from 'react-router';
import ky from 'ky';

export type IUser = {
  name: string;
  email: string;
  pid: string;
};

export async function loader({ request }: { request: Request }) {
  const ck = request.headers.get('Cookie');
  if (!ck) {
    return redirect('/login');
  }
  try {
    const resp = await ky(`${process.env.API_HOST}/api/auth/current`, {
      headers: {
        Cookie: request.headers.get('Cookie') || '',
      },
    });
    if (!resp.ok) {
      return redirect('/login');
    }

    return await resp.json();
  } catch (err) {
    if (err.response?.status === 401) {
      return redirect('/login');
    }
  }
}

export function useUser() {
  return useLoaderData<typeof loader>();
}

export default function AuthLayout() {
  const data = useUser();

  return (
    <main className="container h-dvh">
      <ul className="list-disc">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/doors">My Doors</Link>
        </li>
      </ul>
      <Outlet context={data} />
    </main>
  );
}
