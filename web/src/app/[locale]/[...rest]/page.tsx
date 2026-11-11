import { notFound } from "next/navigation";

// Mọi đường dẫn không tồn tại dưới /vi hoặc /en sẽ hiển thị app/[locale]/not-found.tsx (đã dịch).
export default function CatchAllPage() {
  notFound();
}
