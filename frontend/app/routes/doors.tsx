import ky from 'ky';
import { useLoaderData } from 'react-router';

export async function loader({ request }: { request: Request }) {
  const ck = request.headers.get('Cookie') || '';
  try {
    const resp = await ky.get(`${process.env.API_HOST}/api/doors`, {
      headers: {
        Cookie: ck,
      },
    });
    return await resp.json();
  } catch (err) {
    return [];
  }
}

export function meta() {
  return [
    {
      title: 'Doors'
    }
  ]
}

export default function Doors() {
  const list = useLoaderData();

  return (
    <div>
      <h3>Doors</h3>
      <pre>{JSON.stringify(list, null, 2)}</pre>
    </div>
  );
}
