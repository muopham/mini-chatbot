"use client";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";

const signUpSchema = z.object({
  displayName: z.string().min(2, "Full Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { signUp } = useAuthStore();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    await signUp(data.email, data.password, data.displayName, data.username);
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background-light font-inter dark:bg-background-dark">
      {/* Header */}
      <nav className="flex w-full justify-center px-10 py-6">
        <div className="flex w-full max-w-[1440px] items-center justify-between">
          <Logo variant="yellow" />
          <Link
            href="/login"
            className="neo-border neo-shadow-hover flex items-center justify-center bg-white p-2 transition-all"
          >
            <span className="material-symbols-outlined font-bold text-black">
              arrow_back
            </span>
          </Link>
        </div>
      </nav>

      {/* Main */}
      <main className="flex flex-1 flex-col items-center justify-center p-8 md:p-20">
        <div className="neo-border neo-shadow flex w-full max-w-[560px] flex-col gap-8 bg-white p-10 dark:bg-slate-800">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h1 className="font-poppins text-5xl font-bold uppercase leading-tight tracking-tighter text-black dark:text-white">
              Create Account
            </h1>
            <p className="font-inter text-lg font-medium text-slate-600 dark:text-slate-400">
              Join room chat and start connecting with others!
            </p>
          </div>

          {/* Form Fields */}
          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Full Name
              </label>
              <input
                {...register("displayName")}
                type="text"
                placeholder="John Doe"
                className="neo-border w-full bg-background-light p-4 font-inter text-lg placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:bg-slate-700"
              />
              {errors.displayName && (
                <p className="text-destructive text-sm text-red-400">
                  {errors.displayName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Username
              </label>
              <input
                {...register("username")}
                type="text"
                placeholder="johnDoe"
                className="neo-border w-full bg-background-light p-4 font-inter text-lg placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:bg-slate-700"
              />
              {errors.username && (
                <p className="text-destructive text-sm text-red-400">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="john@example.com"
                className="neo-border w-full bg-background-light p-4 font-inter text-lg placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:bg-slate-700"
              />
              {errors.email && (
                <p className="text-destructive text-sm text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-inter text-sm font-bold uppercase tracking-wider text-black dark:text-white">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                className="neo-border w-full bg-background-light p-4 font-inter text-lg placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:bg-slate-700"
              />
              {errors.password && (
                <p className="text-destructive text-sm text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="neo-border neo-shadow-active group flex w-full items-center justify-center bg-accent-orange px-8 py-5 transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="material-symbols-outlined animate-spin text-2xl text-black">
                  autorenew
                </span>
              ) : (
                <span className="inline-block font-poppins text-2xl font-bold uppercase tracking-widest text-black transition-transform group-hover:scale-105">
                  Sign Up
                </span>
              )}
            </button>
          </form>

          {/* Action */}
          <div className="mt-2 flex flex-col gap-4">
            <div className="mt-2 flex items-center justify-center gap-2 font-inter">
              <span className="text-slate-600 dark:text-slate-400">
                Already have an account?
              </span>
              <Link
                href="/login"
                className="px-1 font-bold text-black underline decoration-accent-yellow decoration-4 transition-colors hover:bg-accent-yellow dark:text-white"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Decorative */}
      <div className="neo-border fixed right-20 top-40 z-10 hidden size-40 rotate-12 bg-accent-yellow lg:block" />
      <div className="neo-border fixed bottom-20 left-20 z-10 hidden size-60 -rotate-6 bg-accent-orange lg:block" />
      <div className="fixed left-10 top-1/2 z-10 hidden size-10 rounded-full bg-black lg:block" />
    </div>
  );
}
