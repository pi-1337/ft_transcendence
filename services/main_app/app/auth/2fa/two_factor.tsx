"use client";
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function TwoFactorPage()
{
	const router = useRouter();
	const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
	const inputs = useRef<(HTMLInputElement | null)[]>([]);

	function handleChange(index: number, value: string)
	{
		if (!/^\d*$/.test(value))
			return ;
		const new_code = [...code];
		new_code[index] = value.slice(-1);
		setCode(new_code);
		setError("");
		if (value && index < 5)
			inputs.current[index + 1]?.focus();
	};

	function handleKeyDown(index: number, e: React.KeyboardEvent)
	{
		if (e.key === "Backspace" && !code[index] && index > 0)
			inputs.current[index - 1]?.focus();
	};

	function handlePaste(e: React.ClipboardEvent)
	{
		e.preventDefault();
		const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
		const new_code = [...code];
		pasted.split("").forEach((char, index) => { new_code[index] = char; });
		setCode(new_code);
		inputs.current[Math.min(pasted.length, 5)]?.focus();
	};

	async function handleSubmit(e: React.FormEvent)
	{
		e.preventDefault();
		if (code.some((d) => d === ""))
		{
			setError("Please enter the complete 6-digit code.");
			return ;
		}
		setLoading(true);
		try
		{
			const res = await fetch("/api/auth/2fa/verify",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code }),
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Invalid code.");
				return ;
			}
			if (data.user?.role === "ADMIN")
				router.push("/admin/dashboard");
			else
				router.push("/dashboard");
		}
		catch
		{
			toast.error("Network error. Please try again.");
		} finally
		{
			setLoading(false);
		}
	};

	async function handleResend()
	{
		setResending(true);
		try
		{
			const res = await fetch("/api/auth/2fa/resend", { method: "POST" });
			const data = await res.json();
			if (!res.ok)
			{
				if (data.retryAfter)
					toast.error(`Please wait ${data.retryAfter}s before requesting another code.`);
				else
					toast.error(data.error || "Could not resend code.");
				return ;
			}
			toast.info(`A new code was sent to ${data.maskedEmail ?? "your email"}.`);
		}
		catch
		{
			toast.error("Network error. Please try again.");
		}
		finally
		{
			setResending(false);
		}
	};

	return (
		<div className="min-h-screen bg-[#111111] flex flex-col items-center px-4 py-10">
			<div className="flex items-center gap-2 mb-10">
				<FontAwesomeIcon icon={faIdBadge} className="text-[#E8963A] text-2xl"/>
				<span className="text-white font-bold text-xl tracking-wide">BadgeHub</span>
			</div>

			<div className="w-full max-w-120 bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] p-8">
				<h1 className="text-white text-3xl font-bold text-center mb-2">Two-factor verification</h1>
				<p className="text-[#888888] text-[16px] text-center mb-8">Enter the verification code sent to your email.</p>

				<form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<div className="flex justify-center gap-3" onPaste={handlePaste}>
						{code.map((digit, index) =>
						(
							<input key={index} ref={(el) => { inputs.current[index] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className={`w-12 h-14 text-center text-white text-xl font-semibold bg-[#111111] border ${error ? "border-red-500" : digit ? "border-[#E8963A]" : "border-[#2A2A2A]"} rounded-xl focus:outline-none focus:border-[#E8963A] transition-all`}/>
						))}
					</div>
					{error && <p className="text-red-500 text-xs text-center -mt-2">{error}</p>}

					<button type="submit" disabled={loading} className="w-full bg-[#E8963A] hover:bg-[#D4842A] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold text-[16px] tracking-widest uppercase rounded-xl py-3.5 transition-colors flex items-center justify-center gap-2 mt-1">{loading ? "Verifying..." : "Verify and continue" }</button>
					<button onClick={handleResend} type="button" disabled={resending} className="w-full bg-transparent border border-[#2A2A2A] hover:border-[#444444] disabled:opacity-50 disabled:cursor-not-allowed text-[#888888] hover:text-white text-[16px] font-semibold tracking-wider rounded-xl py-3.5 transition-colors">{resending ? "Resending..." : "Resend code"}</button>
				</form>
			</div>
			<ToastContainer theme="dark"/>
		</div>
	);
}
