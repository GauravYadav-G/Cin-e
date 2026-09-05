import Cinema from "@/components/cinema";
import { films } from "@/lib/catalog";
export const metadata = { title: "The Gaurav Collection — CINÉ" };
export default function Collection() {
  return <Cinema films={films} />;
}
