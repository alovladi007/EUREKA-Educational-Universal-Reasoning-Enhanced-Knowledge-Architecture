export default function AdminHome() {
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  return (
    <main>
      <h1>EUREKA Admin</h1>
      <p>
        API: <code>{api}</code>
      </p>
      <p>This is a minimal shell so the admin dev container runs. Extend under <code>apps/admin/app</code>.</p>
    </main>
  );
}
