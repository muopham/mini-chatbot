"use client";
import Logo from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signInSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignInSchema = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInSchema) => {
    await signIn(data.username, data.password);
    router.replace("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-inter text-slate-900 dark:bg-background-dark dark:text-slate-100">
      {/* Top Nav */}
      <nav className="flex w-full justify-center px-10 py-6">
        <div className="flex w-full max-w-[1440px] items-center justify-between">
          <Logo variant="yellow" />
          <Link
            href="/signup"
            className="neo-border neo-shadow-sm neo-button bg-white px-6 py-2 font-inter text-sm font-bold transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neo"
          >
            Create Account
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="neo-border neo-shadow flex w-full max-w-[520px] flex-col gap-8 bg-white p-10">
          {/* Header */}
          <div className="text-center md:text-left">
            <h1 className="mb-2 font-poppins text-4xl font-bold">
              Welcome Back!
            </h1>
            <p className="font-inter font-medium text-slate-600">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Form */}
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-bold uppercase tracking-wider">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="Enter your username"
                className="neo-border h-14 w-full bg-background-light px-4 font-inter font-medium outline-none focus:border-black focus:ring-0"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="font-inter text-sm font-bold uppercase tracking-wider">
                  Password
                </label>
                <a href="#" className="font-inter text-xs font-bold underline">
                  Forgot?
                </a>
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className="neo-border h-14 w-full bg-background-light px-4 font-inter font-medium outline-none focus:border-black focus:ring-0"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="neo-border neo-shadow neo-button relative mt-4 flex h-16 w-full items-center justify-center gap-2 bg-accent-yellow font-poppins text-xl font-bold transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neo"
              translate="no"
            >
              <span
                className={`flex items-center gap-2 ${
                  isSubmitting ? "invisible" : "visible"
                }`}
              >
                <span>LOG IN</span>
                <span className="material-symbols-outlined font-bold">
                  arrow_forward
                </span>
              </span>
              <span
                className={`material-symbols-outlined absolute text-2xl ${
                  isSubmitting ? "animate-spin visible" : "invisible"
                }`}
              >
                autorenew
              </span>
            </button>
          </form>

          <p className="text-center font-inter font-medium">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-bold text-primary underline transition-colors hover:text-accent-orange"
            >
              Create Account
            </Link>
          </p>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="fixed bottom-10 left-10 z-10 hidden lg:block">
        <div className="neo-border neo-shadow h-24 w-24 rotate-12 bg-primary" />
      </div>
      <div className="fixed right-20 top-40 z-10 hidden lg:block">
        <div className="neo-border neo-shadow h-32 w-32 -rotate-6 rounded-full bg-accent-yellow" />
      </div>
      <div className="fixed bottom-20 right-40 z-10 hidden lg:block">
        <div className="neo-shadow-sm h-16 w-16 rotate-45 bg-black" />
      </div>
    </div>
  );
}
