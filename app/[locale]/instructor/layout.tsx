import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";

export default async function InstructorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const allowed =
    session?.user &&
    (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN");

  if (!allowed) {
    return redirect({ href: "/become-instructor", locale });
  }

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>;
}
