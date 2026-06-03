export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className="shrink-0 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center font-semibold text-[#374151]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </div>
  );
}
