import SupportRequests from "@/components/support-requests";
export const metadata = { title: "Your Support Requests — CINÉ" };
export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  return <SupportRequests newId={params.new} />;
}
