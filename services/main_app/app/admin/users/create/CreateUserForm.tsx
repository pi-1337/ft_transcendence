'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, ArrowLeft, Save } from 'lucide-react';
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

type FieldErrors = {
    firstname?: string;
    lastname?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
};

export default function CreateUserForm() {
    const router = useRouter();
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
    const [errors, setErrors] = useState<FieldErrors>({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FieldErrors = {};
        let isValid = true;

        if (!firstname.trim()) newErrors.firstname = 'First name is required.';
        if (!lastname.trim()) newErrors.lastname = 'Last name is required.';
        
        if (!email) newErrors.email = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format.';
        
        if (!password) newErrors.password = 'Password is required.';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
        
        if (!phoneNumber) newErrors.phoneNumber = 'Phone number is required.';
        else if (!/^\+[1-9]\d{7,14}$/.test(phoneNumber)) newErrors.phoneNumber = 'Must start with + and country code (e.g., +212...).';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            isValid = false;
        } else {
            setErrors({});
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError("");

        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch('/api/admin/users/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstname, lastname, email, password, phoneNumber, role }),
            });
            
            const data = await res.json();
            
            if (!res.ok) {
                setServerError(data.error || 'Failed to create user. Please check the details.');
                return;
            }
            router.push('/admin/users');
        } catch {
            setServerError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-950 text-white pb-12">
            <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center gap-4 sticky top-0 z-10">
                <Link href="/admin/users" className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Users
                </Link>
                <span className="text-gray-700">/</span>
                <span className="text-white text-sm font-medium">Add user</span>
            </header>

            <main className="max-w-2xl mx-auto px-6 mt-10">
                <div className="flex items-start gap-3 mb-8">
                    <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
                        <UserPlus className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Create new user</h1>
                        <p className="text-sm text-gray-400">Fill in the details below to add a new user to the system.</p>
                    </div>
                </div>

                {serverError && (
                    <div className="mb-6 rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium">
                        {serverError}
                    </div>
                )}

                <Card className="bg-gray-900 border-gray-800">
                    <form onSubmit={handleSubmit} noValidate>
                        <CardContent className="pt-6 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-gray-400">First name</label>
                                    <Input
                                        type="text"
                                        placeholder="Jay"
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
                                        placeholder="Daila"
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
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 ${errors.email ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                />
                                {errors.email && <span className="text-red-400 text-xs font-medium">{errors.email}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 ${errors.password ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                />
                                {errors.password && <span className="text-red-400 text-xs font-medium">{errors.password}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Phone number</label>
                                <Input
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className={`bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 font-mono ${errors.phoneNumber ? 'border-red-500 focus-visible:ring-red-600' : ''}`}
                                />
                                {errors.phoneNumber && <span className="text-red-400 text-xs font-medium">{errors.phoneNumber}</span>}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-400">Role</label>
                                <Select value={role} onValueChange={(val) => setRole(val as 'USER' | 'ADMIN')}>
                                    <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-gray-900 border-gray-800 text-gray-200">
                                        <SelectItem value="USER" className="focus:bg-gray-800 focus:text-white cursor-pointer">USER</SelectItem>
                                        <SelectItem value="ADMIN" className="focus:bg-gray-800 focus:text-white cursor-pointer text-green-400">ADMIN</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>

                        <CardFooter className="bg-gray-950/50 border-t border-gray-800 px-6 py-4 flex gap-3">
                            <Link href="/admin/users" className="flex-1">
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    className="w-full bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                                >
                                    Cancel
                                </Button>
                            </Link>
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="flex-1 bg-green-700 hover:bg-green-800 text-white gap-2"
                            >
                                {loading ? 'Creating...' : <><Save className="w-4 h-4" /> Create user</>}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </main>
        </div>
    );
}