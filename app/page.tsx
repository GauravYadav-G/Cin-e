import Portal from "@/components/portal";
import { redirect } from "next/navigation";
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ film?: string }>;
}) {
  const { film } = await searchParams;
  if (film) redirect(`/collection?film=${encodeURIComponent(film)}`);
  return <Portal page="home" />;
}
