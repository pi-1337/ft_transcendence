"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faCircleCheck } from "@fortawesome/free-solid-svg-icons";

interface Org
{
	id: number;
	name: string;
	type: string;
	service: string;
	badgeTimes: number;
	active: "TRUE" | "FALSE";
	callBackURL: string | null;
	users: Member[];
	admins: Member[];
	meals: Meal[];
};

interface Member
{
	id: number;
	firstname: string;
	lastname: string;
	email: string;
};

interface Meal
{
	id: number;
	name: string;
	startTime: string | Date;
	endTime: string | Date;
};

interface FormConfig
{
	backHref: string;
	backLabel: string;
	title: string;
	saveFieldsUrl: string;
	addMemberUrl: string;
	removeMemberUrl: string;
	mealsUrl: string;
	addAdminUrl?: string;
	removeAdminUrl?: string;
	showAdminSection?: boolean;
	blockAdminMemberRemoval?: boolean;
};

interface Props
{
	org: Org;
	config?: FormConfig;
};

export default function EditOrgForm({ org, config }: Props)
{
	const resolvedConfig: Required<FormConfig> =
	{
		backHref: config?.backHref ?? "/admin/orgs",
		backLabel: config?.backLabel ?? "Organizations",
		title: config?.title ?? "Edit org",
		saveFieldsUrl: config?.saveFieldsUrl ?? `/api/admin/orgs/${org.id}`,
		addMemberUrl: config?.addMemberUrl ?? `/api/admin/orgs/${org.id}/members`,
		removeMemberUrl: config?.removeMemberUrl ?? `/api/admin/orgs/${org.id}/members`,
		mealsUrl: config?.mealsUrl ?? `/api/admin/orgs/${org.id}/meals`,
		addAdminUrl: config?.addAdminUrl ?? `/api/admin/orgs/${org.id}/admins`,
		removeAdminUrl: config?.removeAdminUrl ?? `/api/admin/orgs/${org.id}/admins`,
		showAdminSection: config?.showAdminSection ?? true,
		blockAdminMemberRemoval: config?.blockAdminMemberRemoval ?? false,
	};

	function toTimeInput(value: string | Date)
	{
		const date = value instanceof Date ? value : new Date(value);
		if (isNaN(date.getTime()))
			return "";
		const hh = String(date.getUTCHours()).padStart(2, "0");
		const mm = String(date.getUTCMinutes()).padStart(2, "0");
		return `${hh}:${mm}`;
	};

	function toMinutes(value: string)
	{
		const [hh, mm] = value.split(":");
		const hours = parseInt(hh, 10);
		const minutes = parseInt(mm, 10);
		if (isNaN(hours) || isNaN(minutes))
			return null;
		return (hours * 60) + minutes;
	};

	function validateMeal(mealName: string, start: string, end: string)
	{
		if (!mealName.trim())
			return "Meal name is required.";
		if (!start || !end)
			return "Start and end times are required.";
		const startMinutes = toMinutes(start);
		const endMinutes = toMinutes(end);
		if (startMinutes === null || endMinutes === null)
			return "Invalid meal time format.";
		if (endMinutes <= startMinutes)
			return "End time must be after start time.";
		return "";
	};

	const [name, setName] = useState(org.name);
	const [type, setType] = useState(org.type);
	const [service, setService] = useState(org.service);

	const [badge_times, setBadgeTimes] = useState(String(org.badgeTimes));
	const [active, setActive] = useState<"TRUE" | "FALSE">(org.active);
	const [call_back_url, setCallBackURL] = useState(org.callBackURL ?? "");

	const [field_error, setFieldError] = useState("");
	const [field_saved, setFieldSaved] = useState(false);
	const [field_loading, setFieldLoading] = useState(false);

	const [members, setMembers] = useState<Member[]>(org.users);
	const [add_member_email, setAddMemberEmail] = useState("");
	const [add_member_error, setAddMemberError] = useState("");
	const [add_member_loading, setAddMemberLoading] = useState(false);
	const [removing_member_id, setRemovingMemberId] = useState<number | null>(null);
	const [member_errors, setMemberErrors] = useState<Record<number, string>>({});

	const [admins, setAdmins] = useState<Member[]>(org.admins);
	const [add_admin_email, setAddAdminEmail] = useState("");
	const [add_admin_error, setAddAdminError] = useState("");
	const [add_admin_loading, setAddAdminLoading] = useState(false);
	const [removing_admin_id, setRemovingAdminId] = useState<number | null>(null);
	const [admin_errors, setAdminErrors] = useState<Record<number, string>>({});

	const [meals, setMeals] = useState<Meal[]>([...org.meals].sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime))));

	const [meal_form_name, setMealFormName] = useState("");
	const [meal_form_start_time, setMealFormStartTime] = useState("");
	const [meal_form_end_time, setMealFormEndTime] = useState("");

	const [meal_error, setMealError] = useState("");
	const [meal_loading, setMealLoading] = useState(false);

	const [removing_meal_id, setRemovingMealId] = useState<number | null>(null);
	const [saving_meal_id, setSavingMealId] = useState<number | null>(null);

	const [meal_row_errors, setMealRowErrors] = useState<Record<number, string>>({});

	const [editing_meal_id, setEditingMealId] = useState<number | null>(null);
	const [edit_meal_name, setEditMealName] = useState("");
	const [edit_meal_start_time, setEditMealStartTime] = useState("");
	const [edit_meal_end_time, setEditMealEndTime] = useState("");

	async function handleFieldsSave(e: React.FormEvent)
	{
		e.preventDefault();
		setFieldError("");
		setFieldSaved(false);

		const bt = parseInt(badge_times);
		if (!name.trim() || !type.trim() || !service.trim())
		{
			setFieldError("Name, type, and service are required.");
			return ;
		}
		if (isNaN(bt) || bt < 1)
		{
			setFieldError("Badge times must be a positive integer.");
			return ;
		}

		setFieldLoading(true);
		try
		{
			const res = await fetch(resolvedConfig.saveFieldsUrl,
			{
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, name, type, service, badgeTimes: bt, active, callBackURL: call_back_url || null }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setFieldError(data.error || "Failed to save changes.");
				return ;
			}
			setFieldSaved(true);
			setTimeout(() => setFieldSaved(false), 3000);
		}
		catch
		{
			setFieldError("Network error. Please try again.");
		}
		finally
		{
			setFieldLoading(false);
		}
	};

	async function handleAddMember()
	{
		if (!add_member_email.trim())
		{
			setAddMemberError("Enter an email address.");
			return ;
		}
		setAddMemberError("");
		setAddMemberLoading(true);
		try
		{
			const res = await fetch(resolvedConfig.addMemberUrl,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, email: add_member_email.trim() }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setAddMemberError(data.error || "Failed to add member.");
				return ;
			}
			setMembers(prev => [...prev, data.user]);
			setAddMemberEmail("");
		}
		catch
		{
			setAddMemberError("Network error. Please try again.");
		}
		finally
		{
			setAddMemberLoading(false);
		}
	};

	async function handleRemoveMember(member: Member)
	{
		if (resolvedConfig.blockAdminMemberRemoval && is_org_admin(member))
		{
			setMemberErrors(prev => ({ ...prev, [member.id]: "Org admins cannot be removed from this page." }));
			return ;
		}

		setRemovingMemberId(member.id);
		setMemberErrors(prev => ({ ...prev, [member.id]: "" }));
		try
		{
			const res = await fetch(resolvedConfig.removeMemberUrl,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, email: member.email }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setMemberErrors(prev => ({ ...prev, [member.id]: data.error || "Failed to remove member." }));
				return ;
			}
			setMembers(prev => prev.filter(m => m.id !== member.id));
			setAdmins(prev => prev.filter(a => a.id !== member.id));
		} 
		catch
		{
			setMemberErrors(prev => ({ ...prev, [member.id]: "Network error." }));
		}
		finally
		{
			setRemovingMemberId(null);
		}
	};

	async function handleAddAdmin()
	{
		if (!add_member_email.trim())
		{
			setAddAdminError("Enter an email address.");
			return ;
		}
		setAddAdminError("");
		setAddAdminLoading(true);
		try 
		{
			const res = await fetch(resolvedConfig.addAdminUrl,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, email: add_member_email.trim() }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setAddAdminError(data.error || "Failed to add admin.");
				return ;
			}
			setAdmins(prev => [...prev, data.user]);
			setMembers(prev =>
				prev.some(m => m.id === data.user.id) ? prev : [...prev, data.user]
			);
			setAddAdminEmail("");
		}
		catch
		{
			setAddAdminError("Network error. Please try again.");
		}
		finally
		{
			setAddAdminLoading(false);
		}
	};

	async function handleRemoveAdmin(admin: Member)
	{
		setRemovingAdminId(admin.id);
		setAdminErrors(prev => ({ ...prev, [admin.id]: "" }));
		try
		{
			const res = await fetch(resolvedConfig.removeAdminUrl,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, email: admin.email }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setAdminErrors(prev => ({ ...prev, [admin.id]: data.error || "Failed to remove admin." }));
				return ;
			}
			setAdmins(prev => prev.filter(a => a.id !== admin.id));
		}
		catch
		{
			setAdminErrors(prev => ({ ...prev, [admin.id]: "Network error." }));
		}
		finally
		{
			setRemovingAdminId(null);
		}
	};

	async function handleAddMeal()
	{
		const validationError = validateMeal(meal_form_name, meal_form_start_time, meal_form_end_time);
		if (validationError)
		{
			setMealError(validationError);
			return ;
		}

		setMealError("");
		setMealLoading(true);
		try
		{
			const res = await fetch(resolvedConfig.mealsUrl,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify
				({
					orgId: org.id,
					name: meal_form_name.trim(),
					startTime: meal_form_start_time,
					endTime: meal_form_end_time,
				}),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setMealError(data.error || "Failed to add meal.");
				return ;
			}

			setMeals(prev => [...prev, data.meal].sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime))));
			setMealFormName("");
			setMealFormStartTime("");
			setMealFormEndTime("");
		}
		catch
		{
			setMealError("Network error. Please try again.");
		}
		finally
		{
			setMealLoading(false);
		}
	};

	function handleStartEditMeal(meal: Meal)
	{
		setEditingMealId(meal.id);
		setEditMealName(meal.name);
		setEditMealStartTime(toTimeInput(meal.startTime));
		setEditMealEndTime(toTimeInput(meal.endTime));
		setMealRowErrors(prev => ({ ...prev, [meal.id]: "" }));
	};

	function handleCancelEditMeal()
	{
		setEditingMealId(null);
		setEditMealName("");
		setEditMealStartTime("");
		setEditMealEndTime("");
	};

	async function handleSaveMeal(mealId: number)
	{
		const validationError = validateMeal(edit_meal_name, edit_meal_start_time, edit_meal_end_time);
		if (validationError)
		{
			setMealRowErrors(prev => ({ ...prev, [mealId]: validationError }));
			return ;
		}

		setSavingMealId(mealId);
		setMealRowErrors(prev => ({ ...prev, [mealId]: "" }));
		try
		{
			const res = await fetch(resolvedConfig.mealsUrl,
			{
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify
				({
					orgId: org.id,
					mealId,
					name: edit_meal_name.trim(),
					startTime: edit_meal_start_time,
					endTime: edit_meal_end_time,
				}),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setMealRowErrors(prev => ({ ...prev, [mealId]: data.error || "Failed to save meal." }));
				return ;
			}

			setMeals(prev => prev.map(m => (m.id === mealId ? data.meal : m)).sort((a, b) => toTimeInput(a.startTime).localeCompare(toTimeInput(b.startTime))));
			handleCancelEditMeal();
		}
		catch
		{
			setMealRowErrors(prev => ({ ...prev, [mealId]: "Network error." }));
		}
		finally
		{
			setSavingMealId(null);
		}
	};

	async function handleRemoveMeal(mealId: number)
	{
		setRemovingMealId(mealId);
		setMealRowErrors(prev => ({ ...prev, [mealId]: "" }));
		try
		{
			const res = await fetch(resolvedConfig.mealsUrl,
			{
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ orgId: org.id, mealId }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setMealRowErrors(prev => ({ ...prev, [mealId]: data.error || "Failed to remove meal." }));
				return ;
			}

			setMeals(prev => prev.filter(m => m.id !== mealId));
			if (editing_meal_id === mealId)
				handleCancelEditMeal();
		}
		catch
		{
			setMealRowErrors(prev => ({ ...prev, [mealId]: "Network error." }));
		}
		finally
		{
			setRemovingMealId(null);
		}
	};

	const is_org_admin = (member: Member) => admins.some(a => a.id === member.id);

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-4 sm:px-5 md:px-8 py-4 flex items-center gap-3 sm:gap-4">
				<Link href={resolvedConfig.backHref} className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group shrink-0">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					<span className="hidden xs:inline">{resolvedConfig.backLabel}</span>
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A] shrink-0"/>
				<span className="text-white font-semibold text-[16px] truncate">{resolvedConfig.title}</span>
			</header>

			<main className="max-w-2xl mx-auto px-4 sm:px-5 md:px-8 py-8 md:py-12 flex flex-col gap-5">
				<div>
					<h1 className="text-xl font-bold">{org.name}</h1>
					<p className="text-[#666666] text-xs mt-1">ID: {org.id}</p>
				</div>

				<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6">
					<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-5">Organization details</h2>

					{field_error &&
					(
						<div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">
							{field_error}
						</div>
					)}

					<form onSubmit={handleFieldsSave} className="flex flex-col gap-4" noValidate>
						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Name</label>
								<input type="text" value={name} onChange={e => setName(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							</div>
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Type</label>
								<input type="text" value={type} onChange={e => setType(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Service</label>
								<input type="text" value={service} onChange={e => setService(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							</div>
							<div className="flex flex-col gap-1.5 sm:w-36">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Badge times</label>
								<input type="number" min={1} value={badge_times} onChange={e => setBadgeTimes(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3">
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Status</label>
								<select value={active} onChange={e => setActive(e.target.value as "TRUE" | "FALSE")} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors">
									<option value="TRUE">Active</option>
									<option value="FALSE">Inactive</option>
								</select>
							</div>
							<div className="flex flex-col gap-1.5 flex-1">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Callback URL <span className="text-[#444444] normal-case">(optional)</span></label>
								<input type="url" value={call_back_url} onChange={e => setCallBackURL(e.target.value)} placeholder="https://..." className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							</div>
						</div>

						<div className="flex items-center justify-between mt-1">
							{field_saved
							?
								<span className="text-green-400 text-[16px] flex items-center gap-1.5">
									<FontAwesomeIcon icon={faCircleCheck} className="text-xs"/>
									Saved
								</span>
							:
								<></>
							}
							<button type="submit" disabled={field_loading} className="ml-auto bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 text-[16px] font-bold transition-colors flex items-center gap-2">{ field_loading ? "Saving…" : "Save changes" }</button>
						</div>
					</form>
				</section>

				<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6">
					<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-5">Members ({members.length})</h2>

					{members.length > 0 &&
					(
						<div className="flex flex-col divide-y divide-[#2A2A2A] mb-5">
							{members.map(member =>
							(
								<div key={member.id}>
									<div className="flex items-center justify-between py-3 gap-3">
										<div className="min-w-0">
											<div className="flex items-center gap-2 flex-wrap">
												<span className="text-white text-[16px] font-medium truncate">{member.firstname} {member.lastname}</span>
												{is_org_admin(member) && (<span className="text-xs bg-[#E8963A]/10 text-[#E8963A] border border-[#E8963A]/20 rounded-full px-2 py-0.5 font-bold uppercase tracking-wider shrink-0">org admin</span>)}
											</div>
											<p className="text-[#666666] text-xs mt-0.5 truncate">{member.email}</p>
										</div>
										<button onClick={() => handleRemoveMember(member)} disabled={removing_member_id === member.id || (resolvedConfig.blockAdminMemberRemoval && is_org_admin(member))} className="shrink-0 text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">
											{removing_member_id === member.id ? "…" : "Remove"}
										</button>
									</div>
									{member_errors[member.id] && <p className="text-red-400 text-xs pb-1">{member_errors[member.id]}</p>}
								</div>
							))}
						</div>
					)}

					{add_member_error && ( <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-2.5">{add_member_error}</div> )}
					<div className="flex gap-2">
						<input type="email" value={add_member_email} onChange={e => setAddMemberEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddMember())} placeholder="user@example.com" className="flex-1 min-w-0 bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
						<button onClick={handleAddMember} disabled={add_member_loading} className="shrink-0 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-[16px] font-bold transition-colors whitespace-nowrap">{add_member_loading ? "…" : "Add member"}</button>
					</div>
				</section>

				{resolvedConfig.showAdminSection &&
				(
					<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6">
						<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-5">Org admins ({admins.length})</h2>

						{admins.length > 0 &&
						(
							<div className="flex flex-col divide-y divide-[#2A2A2A] mb-5">
								{admins.map(admin =>
								(
									<div key={admin.id}>
										<div className="flex items-center justify-between py-3 gap-3">
											<div className="min-w-0">
												<span className="text-white text-[16px] font-medium truncate block">{admin.firstname} {admin.lastname}</span>
												<p className="text-[#666666] text-xs mt-0.5 truncate">{admin.email}</p>
											</div>
											<button onClick={() => handleRemoveAdmin(admin)} disabled={removing_admin_id === admin.id} className="shrink-0 text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">{removing_admin_id === admin.id ? "…" : "Demote"}</button>
										</div>
										{admin_errors[admin.id] && <p className="text-red-400 text-xs pb-1">{admin_errors[admin.id]}</p>}
									</div>
								))}
							</div>
						)}

						{add_admin_error && ( <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-2.5">{add_admin_error}</div> )}
						<div className="flex gap-2">
							<input type="email" value={add_admin_email} onChange={e => setAddAdminEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleAddAdmin())} placeholder="user@example.com" className="flex-1 min-w-0 bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
							<button onClick={handleAddAdmin} disabled={add_admin_loading} className="shrink-0 bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2.5 text-[16px] font-bold transition-colors whitespace-nowrap">{add_admin_loading ? "…" : "Add admin"}</button>
						</div>
					</section>
				)}

				<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6">
					<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-5">Meals ({meals.length})</h2>

					{meals.length > 0 &&
					(
						<div className="flex flex-col divide-y divide-[#2A2A2A] mb-5">
							{meals.map(meal =>
							{
								const isEditing = editing_meal_id === meal.id;
								const currentStart = toTimeInput(meal.startTime);
								const currentEnd = toTimeInput(meal.endTime);
								return (
									<div key={meal.id}>
										<div className="flex items-center justify-between py-3 gap-3">
											{isEditing
											?
												<div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 min-w-0">
													<input type="text" value={edit_meal_name} onChange={e => setEditMealName(e.target.value)} placeholder="Meal name" className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
													<input type="time" value={edit_meal_start_time} onChange={e => setEditMealStartTime(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
													<input type="time" value={edit_meal_end_time} onChange={e => setEditMealEndTime(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-3 py-2 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
												</div>
											:
												<div className="flex-1 min-w-0">
													<span className="text-white text-[16px] font-medium truncate block">{meal.name}</span>
													<p className="text-[#666666] text-xs mt-0.5 font-mono">{currentStart} – {currentEnd}</p>
												</div>
											}
											<div className="flex gap-2 shrink-0">
												{isEditing
												?
													<>
														<button onClick={() => handleSaveMeal(meal.id)} disabled={saving_meal_id === meal.id} className="text-xs text-green-400 hover:text-white hover:bg-green-500 border border-green-500/20 hover:border-green-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">{saving_meal_id === meal.id ? "…" : "Save"}</button>
														<button onClick={handleCancelEditMeal} disabled={saving_meal_id === meal.id} className="text-xs text-[#888888] hover:text-white border border-[#2A2A2A] hover:border-[#444444] rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">Cancel</button>
													</>
												:
													<button onClick={() => handleStartEditMeal(meal)} className="text-xs text-[#E8963A] hover:text-white hover:bg-[#E8963A] border border-[#E8963A]/20 hover:border-[#E8963A] rounded-lg px-3 py-1.5 transition-all">Edit</button>
												}
												<button onClick={() => handleRemoveMeal(meal.id)} disabled={removing_meal_id === meal.id || saving_meal_id === meal.id} className="text-xs text-red-400 hover:text-white hover:bg-red-500 border border-red-500/20 hover:border-red-500 rounded-lg px-3 py-1.5 transition-all disabled:opacity-40">{removing_meal_id === meal.id ? "…" : "Remove"}</button>
											</div>
										</div>
										{meal_row_errors[meal.id] && <p className="text-red-400 text-xs pb-1">{meal_row_errors[meal.id]}</p>}
									</div>
								);
							})}
						</div>
					)}

					{meal_error && ( <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-2.5">{meal_error}</div> )}

					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
						<input type="text" value={meal_form_name} onChange={e => setMealFormName(e.target.value)} placeholder="Meal name" className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
						<input type="time" value={meal_form_start_time} onChange={e => setMealFormStartTime(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
						<input type="time" value={meal_form_end_time} onChange={e => setMealFormEndTime(e.target.value)} className="bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-2.5 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors"/>
					</div>

					<div className="flex justify-end mt-3">
						<button onClick={handleAddMeal} disabled={meal_loading} className="bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl px-5 py-2.5 text-[16px] font-bold transition-colors whitespace-nowrap flex items-center gap-2">{ meal_loading ? "…" : "Add meal" }</button>
					</div>
				</section>
			</main>
		</div>
	);
}
