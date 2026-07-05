import { redirect } from 'next/navigation';

// The root route sends everyone to the dashboard, which handles the
// signed-in and signed-out states.
export default function Home() {
  redirect('/dashboard');
}
