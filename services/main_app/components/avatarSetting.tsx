'use client'

import { changeAvatar } from "@/lib/changeAvatar";
import { Camera } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function AvatarSetting({ initialAvatar }: { initialAvatar: string }) {

    const [avatar, setAvatar] = useState(initialAvatar)
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const changeAvatarWrapper = async (formdata: FormData) => {
        const {
            success,
            error,
            avatarLink
        }: {
            success: boolean;
            error: string;
            avatarLink: string | null;
        } = await changeAvatar(formdata);

        setSaved(success);
        if (success)
            setAvatar(avatarLink as string)
        setError(error);
    };


    return (
        <>
            {saved && (
                <div className="mb-6 rounded-lg bg-green-900/40 border border-green-600 text-green-400 text-sm px-4 py-3">
                    Settings saved successfully!
                </div>
            )}
            {error !== "" && (
                <div className="mb-6 rounded-lg bg-red-900/40 border border-red-600 text-red-400 text-sm px-4 py-3">
                    {error}
                </div>
            )}

            <form action={changeAvatarWrapper} className="space-y-6">
                <div className="bg-[#0b1120]/50 border border-gray-800 rounded-[2rem] p-8 relative overflow-hidden group">
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <h2 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-2">
                        <Camera className="w-3.5 h-3.5" />
                        Profile Picture
                    </h2>

                    <div className="flex flex-col sm:flex-row items-center gap-10">
                        <div className="relative group">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-800 shadow-2xl relative">
                                <img
                                    src={avatar}
                                    alt="profile avatar"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500 h-full"
                                />
                            </div>
                            <div className="absolute inset-0 bg-indigo-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">
                                    Upload new avatar
                                </label>
                                <input
                                    type="file"
                                    name="file"
                                    className="w-full bg-gray-900/50 border border-gray-800 rounded-xl px-4 py-3 text-sm text-gray-400 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20 transition-all cursor-pointer"
                                />
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 py-3.5 transition-all shadow-xl shadow-indigo-500/20"
                                >
                                    <Camera className="w-4 h-4" />
                                    Update Photo
                                </button>
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-800 text-white font-bold rounded-xl px-8 py-3.5 border border-gray-700 transition-all"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>

    );
}
