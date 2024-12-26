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
      title: 'Sign Up',
    },
  ];
}

export default function SignUp(_: Route.ComponentProps) {
  const fetcher = useFetcher();
  const errors = fetcher.data?.errors;
  return (
    <Container size="1" className="place-items-center h-dvh">
      <fetcher.Form method="post" autoComplete="off">
        <Flex direction="column" gap="4">
          <Box>
            <TextField.Root type="text" name="name">
              <TextField.Slot>
                <UserIcon className="size-4" />
              </TextField.Slot>
            </TextField.Root>
            {errors?.name ? <em>{errors.name}</em> : null}
          </Box>
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
          <Text>{errors?.msg}</Text>
          <Button type="submit" size="2">
            Create Account
          </Button>
        </Flex>
      </fetcher.Form>
    </Container>
  );
}

type IFormError = {
  name?: string;
  email?: string;
  password?: string;
  msg?: string;
};

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const name = String(formData.get('name'));

  const errors: IFormError = {};

  if (!name) {
    errors.name = 'Name is required';
  }

  if (!email.includes('@')) {
    errors.email = 'Invalid email address';
  }

  if (password.length < 4) {
    errors.password = 'Password should be at least 4 characters';
  }

  if (Object.keys(errors).length > 0) {
    return data({ errors }, { status: 400 });
  }

  const resp = await ky.post(`${process.env.API_HOST}/api/auth/register`, {
    json: { email, password, name },
  });
  if (resp.ok) {
    return redirect('/login');
  }
  return data({ msg: 'Failed to create account' }, { status: 400 });
}
