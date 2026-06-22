import Link from "next/link";
import { Bell as BellIcon } from "lucide-react";

export function Bell(
    { unreadCount }: { unreadCount: number }
) {
    return (
        <Link
            href={`/notifications`}            
            className="relative p-2.5 rounded-xl bg-gray-900/50 border border-gray-800 hover:bg-gray-800 hover:border-gray-700 transition-all group"
        >
            <BellIcon className="w-5 h-5 text-gray-400 group-hover:text-indigo-400 transition-colors" />

            {/* Badge */}
            {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-lg shadow-indigo-500/20 ring-2 ring-[#030712]">
                    {unreadCount}
                </span>
            )}
        </Link>
    );
}
