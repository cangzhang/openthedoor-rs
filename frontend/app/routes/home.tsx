import { useOutletContext } from 'react-router';

export type IUser = {
  name: string;
  email: string;
  pid: string;
};

export function meta() {
  return [{ title: 'Home' }];
}

export default function Home() {
  const data = useOutletContext();
  return (
    <div>
      User:
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
