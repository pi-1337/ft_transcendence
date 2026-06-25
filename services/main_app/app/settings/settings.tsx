"use client"
import { changeAvatar } from "@/lib/changeAvatar";
import { UserFrontend } from "@/lib/types";
import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faChevronLeft, faCircleCheck, faCircleXmark, faEnvelope, faFloppyDisk, faIdBadge, faKey, faPhone, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Settings({ user }: { user: UserFrontend })
{
	const [firstname, setFirstname] = useState(user.firstname);
	const [lastname, setLastname] = useState(user.lastname);
	const [email, setEmail] = useState(user.email);
	const [phone_number, setPhoneNumber] = useState(user.phoneNumber || "");
	const avatar = user.avatar || "/avatars/default-avatar.png";

	const [saved, setSaved] = useState(false);
	const [error, setError] = useState("");
	const [two_factor_enabled, setTwoFactorEnabled] = useState(Boolean(user.twoFactorEnabled));
	const [two_factor_password, setTwoFactorPassword] = useState("");
	const [two_factor_code, setTwoFactorCode] = useState("");
	const [two_factor_status, setTwoFactorStatus] = useState("");
	const [two_factor_error, setTwoFactorError] = useState("");
	const [two_factor_pending_action, setTwoFactorPendingAction] = useState<"enable" | "disable" | null>(null);
	const [two_factor_loading, setTwoFactorLoading] = useState(false);

	function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		setSaved(true);
		setTimeout(() => setSaved(false), 3000);
	};

	async function changeAvatarWrapper(formdata: FormData)
	{
		const { success, error }: { success: boolean, error: string, avatarLink: string | null } = await changeAvatar(formdata);
		setSaved(success);
		setError(error);
	}

	async function requestTwoFactorChange(target: "enable" | "disable")
	{
		setTwoFactorLoading(true);
		setTwoFactorError("");
		setTwoFactorStatus("");

		try
		{
			const action = target === "enable" ? "request_enable" : "request_disable";
			const res = await fetch("/api/auth/2fa/toggle",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action, password: two_factor_password }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setTwoFactorError(data.error || "Failed to send verification code.");
				return ;
			}

			setTwoFactorPendingAction(target);
			setTwoFactorStatus(`Code sent to ${data.maskedEmail}. Enter it below to confirm.`);
		}
		catch
		{
			setTwoFactorError("Network error. Please try again.");
		}
		finally
		{
			setTwoFactorLoading(false);
		}
	};

	const confirmTwoFactorChange = async () =>
	{
		if (!two_factor_pending_action)
			return ;

		setTwoFactorLoading(true);
		setTwoFactorError("");
		setTwoFactorStatus("");

		try
		{
			const action = two_factor_pending_action === "enable" ? "confirm_enable" : "confirm_disable";
			const res = await fetch("/api/auth/2fa/toggle",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ action, code: two_factor_code }),
			});
			const data = await res.json();
			if (!res.ok)
			{
				setTwoFactorError(data.error || "Verification failed.");
				return ;
			}

			setTwoFactorEnabled(Boolean(data.twoFactorEnabled));
			setTwoFactorPendingAction(null);
			setTwoFactorCode("");
			setTwoFactorPassword("");
			setTwoFactorStatus(data.twoFactorEnabled ? "Two-factor authentication is enabled." : "Two-factor authentication is disabled.");
		}
		catch
		{
			setTwoFactorError("Network error. Please try again.");
		}
		finally
		{
			setTwoFactorLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md border-b border-[#2A2A2A] px-5 md:px-8 py-4 flex items-center gap-4">
				<Link href="/dashboard" className="flex items-center gap-2 text-[#888888] hover:text-white text-[16px] font-medium transition-all group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-1 transition-transform"/>
					Dashboard
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]"/>
				<div className="flex items-center gap-2">
					<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-base"/>
					<span className="text-white font-bold tracking-tight">Settings</span>
				</div>
			</header>

			<main className="max-w-3xl mx-auto px-5 md:px-8 py-10 md:py-12">
				<div className="flex items-center gap-4 mb-10">
					<div className="w-14 h-14 bg-[#E8963A]/10 border border-[#E8963A]/20 rounded-2xl flex items-center justify-center">
						<FontAwesomeIcon icon={faUser} className="text-[#E8963A] text-xl"/>
					</div>
					<div>
						<h1 className="text-2xl md:text-3xl font-bold tracking-tight">Account Settings</h1>
						<p className="text-[#666666] text-[16px] mt-1">Manage your personal information and profile</p>
					</div>
				</div>

				{saved &&
				(
					<div className="mb-6 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-[16px] px-4 py-4 flex items-center gap-3">
						<FontAwesomeIcon icon={faCircleCheck} className="text-base shrink-0"/>
						Settings saved successfully!
					</div>
				)}
				{error !== "" &&
				(
					<div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-4 flex items-center gap-3">
						<FontAwesomeIcon icon={faCircleXmark} className="text-base shrink-0"/>
						{error}
					</div>
				)}

				<div className="flex flex-col gap-6">
					<form onSubmit={handleSubmit}>
						<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
							<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
								<span className="w-1 h-4 bg-[#E8963A] rounded-full"/>
								Personal information
							</h2>

							<div className="grid sm:grid-cols-2 gap-4 mb-4">
								<div className="flex flex-col gap-1.5">
									<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">First Name</label>
									<div className="relative group">
										<FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#E8963A] transition-colors text-xs"/>
										<input type="text" name="firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
									</div>
								</div>
								<div className="flex flex-col gap-1.5">
									<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Last Name</label>
									<div className="relative group">
										<FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#E8963A] transition-colors text-xs"/>
										<input type="text" name="lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
									</div>
								</div>
							</div>

							<div className="flex flex-col gap-1.5 mb-4">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Email Address</label>
								<div className="relative group">
									<FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#E8963A] transition-colors text-xs"/>
									<input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5 mb-6">
								<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Phone Number</label>
								<div className="relative group">
									<FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#555555] group-focus-within:text-[#E8963A] transition-colors text-xs"/>
									<input type="tel" name="phoneNumber" value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl pl-10 pr-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
								</div>
							</div>

							<div className="flex gap-3">
								<button type="submit" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white font-bold rounded-xl px-6 py-3 text-[16px] transition-colors">
									<FontAwesomeIcon icon={faFloppyDisk} className="text-xs"/>
									Save Changes
								</button>
								<Link href="/dashboard" className="flex items-center gap-2 bg-[#222222] hover:bg-[#2A2A2A] text-[#888888] hover:text-white font-bold rounded-xl px-6 py-3 text-[16px] border border-[#2A2A2A] hover:border-[#444444] transition-all">Cancel</Link>
							</div>
						</section>
					</form>

					<form action={changeAvatarWrapper}>
						<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
							<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
								<span className="w-1 h-4 bg-[#E8963A] rounded-full"/>
								Profile picture
							</h2>

							<div className="flex flex-col sm:flex-row items-center gap-8">
								<div className="relative group shrink-0">
									<div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#2A2A2A]">
										<img src={avatar} alt="avatar" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"/>
									</div>
									<div className="absolute inset-0 bg-[#E8963A]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
										<FontAwesomeIcon icon={faCamera} className="text-white text-xl"/>
									</div>
								</div>

								<div className="flex-1 flex flex-col gap-4 w-full">
									<div className="flex flex-col gap-1.5">
										<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Upload new avatar</label>
										<input type="file" name="file" className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-[16px] text-[#888888] file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#E8963A]/10 file:text-[#E8963A] hover:file:bg-[#E8963A]/20 transition-all cursor-pointer"/>
									</div>
									<div className="flex gap-3">
										<button type="submit" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white font-bold rounded-xl px-6 py-3 text-[16px] transition-colors">
											<FontAwesomeIcon icon={faCamera} className="text-xs"/>
											Update Photo
										</button>
										<Link href="/dashboard" className="flex items-center gap-2 bg-[#222222] hover:bg-[#2A2A2A] text-[#888888] hover:text-white font-bold rounded-xl px-6 py-3 text-[16px] border border-[#2A2A2A] hover:border-[#444444] transition-all">
											Cancel
										</Link>
									</div>
								</div>
							</div>
						</section>
					</form>

					<section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 md:p-8">
						<h2 className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
							<span className="w-1 h-4 bg-[#E8963A] rounded-full"/>
							Two-factor authentication
						</h2>

						<div className="rounded-xl border border-[#2A2A2A] bg-[#111111] p-4 mb-6">
							<p className="text-white font-semibold flex items-center gap-2 text-[16px]">
								<FontAwesomeIcon icon={faKey} className={`text-xs ${two_factor_enabled ? "text-green-400" : "text-[#666666]"}`}/>
								Status: {two_factor_enabled ? "Enabled" : "Disabled"}
							</p>
							<p className="text-[#666666] text-xs mt-2">{two_factor_enabled ? "You will be asked for an email verification code when signing in." : "Enable 2FA to add an email verification step to your login."}</p>
						</div>

						{two_factor_status && (<div className="mb-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-[16px] px-4 py-3">{two_factor_status}</div>)}
						{two_factor_error && (<div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[16px] px-4 py-3">{two_factor_error}</div>)}

						<div className="flex flex-col gap-1.5 mb-4">
							<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Current Password</label>
							<input type="password" value={two_factor_password} onChange={(e) => setTwoFactorPassword(e.target.value)} placeholder="Enter current password" className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors placeholder-[#555555]"/>
						</div>

						<div className="flex flex-wrap gap-3 mb-4">
							<button type="button" onClick={() => requestTwoFactorChange("enable")} disabled={two_factor_loading || two_factor_enabled} className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500 border border-green-500/20 hover:border-green-500 text-green-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-xl px-5 py-3 text-[16px] transition-all">Enable 2FA</button>
							<button type="button" onClick={() => requestTwoFactorChange("disable")} disabled={two_factor_loading || !two_factor_enabled} className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500 border border-red-500/20 hover:border-red-500 text-red-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed font-semibold rounded-xl px-5 py-3 text-[16px] transition-all">Disable 2FA</button>
						</div>

						{two_factor_pending_action &&
						(
							<div className="flex flex-col gap-3">
								<div className="flex flex-col gap-1.5">
									<label className="text-[#888888] text-xs font-semibold uppercase tracking-widest">Verification Code</label>
									<input type="text" inputMode="numeric" maxLength={8} value={two_factor_code} onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="w-full bg-[#111111] border border-[#2A2A2A] text-white rounded-xl px-4 py-3 text-[16px] focus:outline-none focus:border-[#E8963A] transition-colors tracking-[0.25em] placeholder-[#555555]"/>
								</div>
								<button type="button" onClick={confirmTwoFactorChange} disabled={two_factor_loading || two_factor_code.length < 4} className="w-full bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl px-5 py-3 text-[16px] transition-colors cursor-pointer">
									Confirm {two_factor_pending_action === "enable" ? "enable" : "disable"}
								</button>
							</div>
						)}
					</section>
				</div>
			</main>
		</div>
	);
}
