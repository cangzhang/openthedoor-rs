import { redirect, useFetcher, data } from 'react-router';
import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  TextField,
} from '@radix-ui/themes';
import { UserIcon, KeyIcon, InboxIcon } from '@heroicons/react/24/outline';
import ky from 'ky';

import type { Route } from './+types/signup';

export function meta() {
  return [
    {
      title: 'Log In',
    },
  ];
}

export default function Login(_: Route.ComponentProps) {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;
  return (
    <Container size="1" className='place-items-center h-dvh'>
      <fetcher.Form method="post" autoComplete="off">
        <Flex direction="column" gap="4">
          <Box>
            <TextField.Root type="email" name="email">
              <TextField.Slot>
                <InboxIcon className="size-4" />
              </TextField.Slot>
            </TextField.Root>
            {errors?.email ? <em>{errors.email}</em> : null}
          </Box>
          <Box>
            <TextField.Root type="password" name="password">
              <TextField.Slot>
                <KeyIcon className="size-4" />
              </TextField.Slot>
            </TextField.Root>
            {errors?.password ? <em>{errors.password}</em> : null}
          </Box>
          <Button type="submit" size="2">
            Sign In
          </Button>
        </Flex>
      </fetcher.Form>
    </Container>
  );
}

type IFormError = {
  email?: string;
  password?: string;
};

export type IUserResp = {
  name: string;
  pid: string;
  token: string;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: IFormError = {};
  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }
  if (password.length < 4) {
    errors.password = 'Password should be at least 4 characters';
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const resp = await ky.post(`${process.env.API_HOST}/api/auth/login`, {
    json: { email, password },
  });
  const body: IUserResp = await resp.json();
  return redirect('/', {
    headers: {
      'Set-Cookie': `token=${body.token}; Path=/; HttpOnly; SameSite=Strict;`,
    }
  });
}
