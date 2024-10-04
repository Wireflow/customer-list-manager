"use client";

import { signInAction } from "@/actions/auth";
import SubmitButton from "@/components/form/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, signInType } from "@/types/auth/sign-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: signInAction,
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Signed in successfully");
        router.push("/dashboard/lists");
      } else {
        toast.error(data.error || "An error occurred during sign in");
      }
    },
    onError: (error) => {
      toast.error("An unexpected error occurred");
    },
  });

  const form = useForm<signInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: signInType) => {
    mutate(data);
  };

  return (
    <form
      className="flex-1 flex flex-col max-w-96 w-full justify-center"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <h1 className="text-2xl font-medium">Sign in</h1>
      <p className="text-sm text-foreground">
        Enter your credentials to sign in
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Email</Label>
        <Input
          {...form.register("email")}
          placeholder="you@example.com"
          required
        />
        <div className="flex justify-between items-center">
          <Label htmlFor="password">Password</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          {...form.register("password")}
          placeholder="Your password"
          required
        />

        <SubmitButton
          pending={isPending}
          type="submit"
          pendingText="Signing In..."
          size={"lg"}
          loading={isPending}
        >
          Sign in
        </SubmitButton>
      </div>
    </form>
  );
}
