export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-green-50">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-green-700">
          🐷 FarmCare
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Sign in to your account
        </p>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border p-3"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 p-3 font-semibold text-white hover:bg-green-800">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
