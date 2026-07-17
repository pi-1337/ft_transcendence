import Link from "next/link";
import Image from "next/image";

export function Bell({ unreadCount }: { unreadCount: number }) {
  return (
    <Link
      href={`/notifications`}
      className="relative p-2 rounded-3xl bg-white border border-gray-800 hover:border-gray-700 transition-colors"
    >
      <Image
        src="/notification.png"
        alt="notification icon"
        width={16}
        height={16}
      />

      {/* Badge */}
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5">
          {unreadCount}
        </span>
      )}
    </Link>
  );
}
