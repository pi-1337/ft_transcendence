'use client'

import { useState, useRef } from "react";
import { changeAvatar } from "@/lib/changeAvatar";
import { Camera, AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AvatarSetting({ initialAvatar }: { initialAvatar: string }) {
    const [avatar, setAvatar] = useState(initialAvatar);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarChange = async (formData: FormData) => {
        setLoading(true);
        setError("");
        setSaved(false);

        try {
            const { success, error: apiError, avatarLink } = await changeAvatar(formData);

            if (success && avatarLink) {
                setAvatar(avatarLink);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
                
                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                setError(apiError || "Failed to upload avatar.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-900 border-gray-800 mb-8">
            <CardHeader className="pb-4 border-b border-gray-800">
                <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                    <Camera className="w-4 h-4 text-green-500" /> Profile Picture
                </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-6">
                {saved && (
                    <div className="mb-6 rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Photo updated successfully!
                    </div>
                )}
                {error && (
                    <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <form action={handleAvatarChange} className="flex flex-col sm:flex-row items-center gap-8">
                    <div className="relative group shrink-0">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-800 bg-gray-950 shadow-xl relative">
                            <img
                                src={avatar}
                                alt="profile avatar"
                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gray-950/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px] pointer-events-none">
                            <Camera className="w-8 h-8 text-white/80" />
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-gray-400">Upload new avatar</label>
                            <input
                                type="file"
                                name="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-400 
                                file:mr-4 file:py-1.5 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold 
                                file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700 hover:file:text-white transition-all cursor-pointer focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-green-700 hover:bg-green-800 text-white w-full sm:w-auto gap-2"
                        >
                            {loading ? "Uploading..." : <><Upload className="w-4 h-4" /> Update Photo</>}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}