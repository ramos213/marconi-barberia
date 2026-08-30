import { Scissors } from "lucide-react";

export default function RazorDivider() {
  return (
    <div className="flex items-center gap-4 my-2" aria-hidden="true">
      <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
      <Scissors size={16} color="var(--copper)" />
      <div style={{ flex: 1, height: 1, background: "var(--divider)" }} />
    </div>
  );
}
