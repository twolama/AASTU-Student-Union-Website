import { redirect } from "next/navigation";

interface ForgotPasswordSentPageProps {
  searchParams?: Promise<{
    email?: string;
  }>;
}

export default async function ForgotPasswordSentPage({ searchParams }: ForgotPasswordSentPageProps) {
  const params = await searchParams;
  const email = params?.email ?? "";
  const destination = email ? `/reset-password/verify?email=${encodeURIComponent(email)}` : "/forgot-password";

  redirect(destination);
}