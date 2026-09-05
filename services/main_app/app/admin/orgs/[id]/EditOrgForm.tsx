"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Users,
  Shield,
  Clock,
  Plus,
  Trash2,
  Save,
  Pencil,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type User = { id: number; firstname: string; lastname: string; email: string };
type Meal = {
  id: number;
  name: string;
  startTime: string | Date;
  endTime: string | Date;
};
type Org = {
  id: number;
  name: string;
  type: string;
  service: string;
  badgeTimes: number;
  active: "TRUE" | "FALSE";
  callBackURL: string | null;
  users: User[];
  admins: User[];
  meals: Meal[];
};

type EditOrgFormProps = {
  org: Org;
  backHref?: string;
  backLabel?: string;
};

const formatTime = (val: string | Date) => {
  const d = new Date(val);
  return isNaN(d.getTime()) ? "" : d.toISOString().substring(11, 16);
};

export default function EditOrgForm({
  org,
  backHref = "/admin/orgs",
  backLabel = "Organizations",
}: EditOrgFormProps) {
  const [name, setName] = useState(org.name);
  const [type, setType] = useState(org.type);
  const [service, setService] = useState(org.service);
  const [badgeTimes, setBadgeTimes] = useState(String(org.badgeTimes));
  const [active, setActive] = useState<"TRUE" | "FALSE">(org.active);
  const [callbackUrl, setCallbackUrl] = useState(org.callBackURL || "");
  const [members, setMembers] = useState<User[]>(org.users);
  const [memberEmail, setMemberEmail] = useState("");
  const [admins, setAdmins] = useState<User[]>(org.admins);
  const [adminEmail, setAdminEmail] = useState("");
  const [meals, setMeals] = useState<Meal[]>(org.meals);
  const [mealName, setMealName] = useState("");
  const [mealStart, setMealStart] = useState("");
  const [mealEnd, setMealEnd] = useState("");
  const [editMealId, setEditMealId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const isOrgAdmin = (userId: number) => admins.some((a) => a.id === userId);
  const saveOrgDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          service,
          badgeTimes,
          active,
          callBackURL: callbackUrl || null,
        }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }
      setInfo("Organization updated successfully.");
    } catch (err: any) {
      setError(err.message || "Error updating organization.");
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!memberEmail.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: memberEmail.trim() }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      setMembers((prev) => [...prev, data.user]);
      setMemberEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (email: string, id: number) => {
    if (isOrgAdmin(id))
      return setError(
        "Cannot remove a member who is also an admin. Demote them first.",
      );
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      setMembers((prev) => prev.filter((m) => m.email !== email));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const addAdmin = async () => {
    if (!adminEmail.trim()) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminEmail.trim() }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      setAdmins((prev) => [...prev, data.user]);
      if (!members.find((m) => m.id === data.user.id)) {
        setMembers((prev) => [...prev, data.user]);
      }
      setAdminEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeAdmin = async (email: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/admins`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      setAdmins((prev) => prev.filter((a) => a.email !== email));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveMeal = async (mealId?: number) => {
    setLoading(true);
    setError("");
    const isEdit = !!mealId;

    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/meals`, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? { mealId, name: mealName, startTime: mealStart, endTime: mealEnd }
            : { name: mealName, startTime: mealStart, endTime: mealEnd },
        ),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      if (isEdit) {
        setMeals((prev) => prev.map((m) => (m.id === mealId ? data.meal : m)));
        setEditMealId(null);
      } else {
        setMeals((prev) => [...prev, data.meal]);
      }
      setMealName("");
      setMealStart("");
      setMealEnd("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeMeal = async (mealId: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orgs/${org.id}/meals`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mealId }),
      });
      const data = await res.json();
      const success = data.success || null;
      if (!success) {
        setError(data.error);
        return;
      }

      setMeals((prev) => prev.filter((m) => m.id !== mealId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const prepareEditMeal = (m: Meal) => {
    setEditMealId(m.id);
    setMealName(m.name);
    setMealStart(formatTime(m.startTime));
    setMealEnd(formatTime(m.endTime));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-12">
      <header className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Link
            href={backHref}
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> {backLabel}
          </Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Edit Org</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 mt-10 space-y-8">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-950/30 rounded-lg border border-green-900/50">
            <Building2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{org.name}</h1>
            <p className="text-sm text-gray-400 font-mono">ID: {org.id}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800 text-red-400 text-sm px-4 py-3 font-medium">
            {error}
          </div>
        )}
        {info && (
          <div className="rounded-lg bg-green-950/40 border border-green-800 text-green-400 text-sm px-4 py-3 font-medium">
            {info}
          </div>
        )}
        <Card className="bg-gray-900 border-gray-800">
          <form onSubmit={saveOrgDetails}>
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                <Building2 className="w-4 h-4 text-green-500" /> Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Type</label>
                <Input
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Service</label>
                <Input
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Badge Times</label>
                <Input
                  type="number"
                  min={1}
                  value={badgeTimes}
                  onChange={(e) => setBadgeTimes(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Status</label>
                <Select
                  value={active}
                  onValueChange={(val) => setActive(val as "TRUE" | "FALSE")}
                >
                  <SelectTrigger className="bg-gray-950/50 border-gray-800 text-white focus:ring-green-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-800 text-white">
                    <SelectItem value="TRUE">Active</SelectItem>
                    <SelectItem value="FALSE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm text-gray-400">Callback URL</label>
                <Input
                  type="url"
                  value={callbackUrl}
                  onChange={(e) => setCallbackUrl(e.target.value)}
                  placeholder="https://..."
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white"
                >
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Org Admins (
                {admins.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Add admin by email..."
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
                <Button
                  type="button"
                  onClick={addAdmin}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {admins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex justify-between items-center p-3 bg-gray-950/30 rounded-lg border border-gray-800/50"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">
                        {admin.firstname} {admin.lastname}
                      </p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeAdmin(admin.email)}
                      disabled={loading}
                      className="h-8 bg-red-900/80 hover:bg-red-900"
                    >
                      Demote
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-4 border-b border-gray-800">
              <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
                <Users className="w-4 h-4 text-green-500" /> Members (
                {members.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Add member by email..."
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600"
                />
                <Button
                  type="button"
                  onClick={addMember}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex justify-between items-center p-3 bg-gray-950/30 rounded-lg border border-gray-800/50"
                  >
                    <div>
                      <p className="text-sm text-white font-medium">
                        {member.firstname} {member.lastname}
                        {isOrgAdmin(member.id) && (
                          <span className="ml-2 text-[10px] bg-green-950 text-green-400 px-1.5 py-0.5 rounded border border-green-800">
                            ADMIN
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeMember(member.email, member.id)}
                      disabled={loading}
                      className="h-7 w-7 border-red-900/50 text-red-500 hover:bg-red-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-4 border-b border-gray-800">
            <CardTitle className="text-gray-200 text-lg font-semibold flex items-center gap-2">
              <Clock className="w-4 h-4 text-green-500" /> Meals ({meals.length}
              )
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Meal Name"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 flex-1"
              />
              <Input
                type="time"
                value={mealStart}
                onChange={(e) => setMealStart(e.target.value)}
                className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 w-full sm:w-32"
              />
              <Input
                type="time"
                value={mealEnd}
                onChange={(e) => setMealEnd(e.target.value)}
                className="bg-gray-950/50 border-gray-800 text-white focus-visible:ring-green-600 w-full sm:w-32"
              />
              {editMealId ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => saveMeal(editMealId)}
                    disabled={loading}
                    className="bg-green-700 hover:bg-green-800 text-white"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditMealId(null);
                      setMealName("");
                      setMealStart("");
                      setMealEnd("");
                    }}
                    className="bg-transparent border-gray-700 hover:bg-gray-800"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => saveMeal()}
                  disabled={loading}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Meal
                </Button>
              )}
            </div>

            <div className="space-y-2">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className={`flex justify-between items-center p-3 rounded-lg border ${editMealId === meal.id ? "bg-green-950/20 border-green-900/50" : "bg-gray-950/30 border-gray-800/50"}`}
                >
                  <div>
                    <p className="text-sm text-white font-medium">
                      {meal.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(meal.startTime)} - {formatTime(meal.endTime)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => prepareEditMeal(meal)}
                      disabled={loading}
                      className="h-8 w-8 bg-transparent border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeMeal(meal.id)}
                      disabled={loading}
                      className="h-8 w-8 bg-red-900/80 hover:bg-red-900 text-red-200 border border-red-800"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
