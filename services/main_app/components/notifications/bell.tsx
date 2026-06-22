import Link from "next/link";

export function Bell(
    { unreadCount }: { unreadCount: number }
) {
    return (
        <Link
            href={`/notifications`}            
            className="relative p-2 rounded-lg bg-[#111] border border-[#1f1f1f] hover:bg-[#161616] transition"
        >
            🔔

            {/* Badge */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full px-1.5 py-0.5">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
}
