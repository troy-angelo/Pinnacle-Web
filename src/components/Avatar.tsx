import { useMemo } from 'react';

interface AvatarProps {
  name: string;
  size?: number;
  src?: string;
}

export function Avatar({ name, size = 32, src }: AvatarProps) {
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [name]);

  const bgColor = useMemo(() => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    return colors[name.charCodeAt(0) % colors.length];
  }, [name]);

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover ring-1 ring-[#222C36]"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${bgColor} rounded-full flex items-center justify-center text-white font-semibold ring-1 ring-[#222C36]`}
      style={{ width: size, height: size, fontSize: size / 2.5 }}
    >
      {initials}
    </div>
  );
}
