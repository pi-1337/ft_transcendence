'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    UserCog, 
    ArrowLeft, 
    Save, 
    IdCard, 
    Plus, 
    Pencil, 
    Trash2, 
    X
} from 'lucide-react';

// Shadcn UI Imports
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Badge = {
    number: string;
    createdAt: Date;
};

type User = {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
    role: string;
    badge: Badge | null;
};

type FieldErrors = {
    firstname?: string;
    lastname?: string;
    email?: string;
    phoneNumber?: string;
};

type Props = {
    user: User;
    isSelf: boolean;
};

export default function EditUserForm({ user, isSelf }: Props) {
    const router = useRouter();
    
    // User Form State
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [email, setEmail] = useState(user.email);
    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
    const [role, setRole] = useState<'USER' | 'ADMIN'>(user.role as 'USER' | 'ADMIN');
    
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    // Badge State
    const [badge, setBadge] = useState<Badge | null>(user.badge);
    const [badgeNumber, setBadgeNumber] = useState('');
    const [badgeError, setBadgeError] = useState('');
    const [badgeLoading, setBadgeLoading] = useState(false);
    
    const [editingBadge, setEditingBadge] = useState(false);
    const [editBadgeNumber, setEditBadgeNumber] = useState('');

    // ─── 1. Refactored User Functions ──────────────────────────────────────────
    const validateForm = (): boolean => {
        const e: FieldErrors = {};
        let isValid = true;
        
        if (!firstname.trim()) e.firstname = 'First name is required.';
        if (!lastname.trim()) e.lastname = 'Last name is required.';
        
        if (!email) e.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email format.';
        
        if (!phoneNumber) e.phoneNumber = 'Phone number is required.';
        else if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) e.phoneNumber = 'Must start with + and country code.';
        
        if (Object.keys(e).length > 0) isValid = false;
        setErrors(e);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/admin/users/${user.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, phoneNumber, role }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setServerError(data.error || 'Failed to update user.');
                return;
            }
            router.push('/admin/users');
        } catch {
            setServerError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ─── 2. Refactored Badge Functions ─────────────────────────────────────────
    const handleAddBadge = async () => {
        if (!badgeNumber.trim()) return setBadgeError('Badge number is required.');
        
        setBadgeError('');
        setBadgeLoading(true);
        
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: badgeNumber.trim() }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to add badge.');
                return;
            }
            
            setBadge(data.badge);
            setBadgeNumber('');
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    const handleSaveBadge = async () => {
        if (!editBadgeNumber.trim()) return setBadgeError('Badge number is required.');
        
        setBadgeError('');
        setBadgeLoading(true);
        
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: editBadgeNumber.trim() }),
            });
            const data = await res.json();
            
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to edit badge.');
                return;
            }
            
            setBadge(data.badge);
            handleCancelEditBadge();
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    const handleDeleteBadge = async () => {
        if (!window.confirm('Are you sure you want to remove this badge?')) return;
        
        setBadgeError('');
        setBadgeLoading(true);
        
        try {
            const res = await fetch(`/api/admin/users/${user.id}/badges`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await res.json();
            
            if (!res.ok) {
                setBadgeError(data.error || 'Failed to delete badge.');
                return;
            }
            
            setBadge(null);
            handleCancelEditBadge();
        } catch {
            setBadgeError('Network error. Please try again.');
        } finally {
            setBadgeLoading(false);
        }
    };

    const handleStartEditBadge = () => {
        if (badge) {
            setEditingBadge(true);
            setEditBadgeNumber(badge.number);
            setBadgeError('');
        }
    };

    const handleCancelEditBadge = () => {
        setEditingBadge(false);
        setEditBadgeNumber('');
        setBadgeError('');
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            {/* Top bar */}
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/admin/users" className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Users
                </Link>
                <span className="text-gray-700">/</span>
                <span className="text-white text-sm font-medium">Edit user</span>
                {isSelf && (
                    <span className="text-[10px] uppercase tracking-wider bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full font-bold ml-2">
                        You
                    </span>
                )}
            </header>

            <main className="max-w-2xl mx-auto px-6 mt-10 space-y-6">
                
                {/* Header Section */}
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
                        <UserCog className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{user.firstname} {user.lastname}</h1>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>

                {serverError && (
                    <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium">
                        {serverError}
                    </div>
                )}

                {/* Main User Info Form */}
                <Card className="bg-gray-900 border-gray-800">
                    <form onSubmit={handleSubmit} noValidate>
                        <CardHeader className="pb-4 border-b border-gray-800">
                            <CardTitle className="text-gray-200 text-lg font-semibold">User Information</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">First name</label>
                                    <Input
                                        type="text"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 ${errors.firstname ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                    />
                                    {errors.firstname && <span className="text-red-400 text-xs font-medium">{errors.firstname}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">Last name</label>
                                    <Input
                                        type="text"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 ${errors.lastname ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                    />
                                    {errors.lastname && <span className="text-red-400 text-xs font-medium">{errors.lastname}</span>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Email</label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 ${errors.email ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                />
                                {errors.email && <span className="text-red-400 text-xs font-medium">{errors.email}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Phone number</label>
                                <Input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`bg-gray-950/50 border-gray-800 text-white font-mono focus-visible:ring-green-600 ${errors.phoneNumber ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                />
                                {errors.phoneNumber && <span className="text-red-400 text-xs font-medium">{errors.phoneNumber}</span>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Role</label>
                                <Select 
                                    value={role} 
                                    onValueChange={(val) => setRole(val as 'USER' | 'ADMIN')}
                                    disabled={isSelf}
                                >
                                    <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600 disabled:opacity-50">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                                        <SelectItem value="USER" className="focus:bg-gray-800 focus:text-white cursor-pointer">USER</SelectItem>
                                        <SelectItem value="ADMIN" className="focus:bg-gray-800 focus:text-white cursor-pointer text-green-400">ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isSelf && (
                                    <p className="text-yellow-500/80 text-xs font-medium mt-1">You cannot change your own role.</p>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-6 py-4 flex gap-3">
                            <Link href="/admin/users" className="flex-1">
                                <Button type="button" variant="outline" className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
                                    Cancel
                                </Button>
                            </Link>
                            <Button type="submit" disabled={loading} className="flex-1 bg-green-700 hover:bg-green-800 text-white gap-2">
                                {loading ? 'Saving...' : <><Save className="w-4 h-4" /> Save changes</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>

                {/* Badge Management Section */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-4 border-b border-gray-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                            <IdCard className="w-5 h-5 text-green-500" />
                            Assigned Badge
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {badgeError && (
                            <div className="mb-4 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-2 font-medium">
                                {badgeError}
                            </div>
                        )}

                        {badge ? (
                            <div className="flex flex-col gap-3">
                                {editingBadge ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            type="text"
                                            value={editBadgeNumber}
                                            onChange={(e) => setEditBadgeNumber(e.target.value)}
                                            className="flex-1 bg-gray-950/50 border-gray-800 text-white font-mono focus-visible:ring-green-600"
                                            placeholder="Enter new badge number"
                                        />
                                        <Button 
                                            type="button" // DAROURI bach may-submitich l-form l-kbir
                                            onClick={handleSaveBadge} 
                                            disabled={badgeLoading}
                                            className="bg-green-700 hover:bg-green-800 text-white px-4"
                                        >
                                            {badgeLoading ? '...' : <Save className="w-4 h-4" />}
                                        </Button>
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancelEditBadge} 
                                            disabled={badgeLoading}
                                            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 px-4"
                                        >
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
                                        <div>
                                            <p className="text-white text-sm font-mono font-bold text-green-400">{badge.number}</p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                Assigned on {new Date(badge.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleStartEditBadge}
                                                className="bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white h-8"
                                            >
                                                <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                                            </Button>
                                            <Button 
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={handleDeleteBadge}
                                                disabled={badgeLoading}
                                                className="bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800 h-8"
                                            >
                                                {badgeLoading ? '...' : <><Trash2 className="w-3.5 h-3.5 mr-1.5" /> Remove</>}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                <p className="text-gray-500 text-sm">This user currently has no badge assigned.</p>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={badgeNumber}
                                        onChange={(e) => setBadgeNumber(e.target.value)}
                                        placeholder="Enter badge number..."
                                        className="flex-1 bg-gray-950/50 border-gray-800 text-white font-mono focus-visible:ring-green-600"
                                    />
                                    <Button 
                                        type="button"
                                        onClick={handleAddBadge}
                                        disabled={badgeLoading}
                                        className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 whitespace-nowrap"
                                    >
                                        {badgeLoading ? '...' : <><Plus className="w-4 h-4 mr-1.5" /> Add Badge</>}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}