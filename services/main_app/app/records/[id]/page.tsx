"use client"
import Link from "next/link";
import { useParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faShield, faArrowRightToBracket, faArrowRightFromBracket, faCircleCheck, faHashtag, faTag, faBuilding, faBolt, faClock, faArrowRight, faLocationDot, faWifi, faAward, } from "@fortawesome/free-solid-svg-icons";

const mock_records_data: Record<string, any> =
{
	"1":
	{
		id: 1,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Entry",
		timestamp: new Date("2024-01-20 10:30:00"),
		location: "Main Entrance",
		reader: "RFID-Reader-001",
		status: "Success"
	},
	"2":
	{
		id: 2,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Exit",
		timestamp: new Date("2024-01-20 17:00:00"),
		location: "Main Entrance",
		reader: "RFID-Reader-001",
		status: "Success"
	},
	"3":
	{
		id: 3,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Entry",
		timestamp: new Date("2024-01-21 09:15:00"),
		location: "Side Entrance",
		reader: "RFID-Reader-002",
		status: "Success"
	},
	"4":
	{
		id: 4,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Exit",
		timestamp: new Date("2024-01-21 18:45:00"),
		location: "Main Entrance",
		reader: "RFID-Reader-001",
		status: "Success"
	},
	"5":
	{
		id: 5,
		badgeNumber: "BADGE-002",
		orgName: "Tech Startup Inc",
		orgId: 2,
		action: "Entry",
		timestamp: new Date("2024-01-22 08:00:00"),
		location: "Front Desk",
		reader: "RFID-Reader-003",
		status: "Success"
	},
	"6":
	{
		id: 6,
		badgeNumber: "BADGE-002",
		orgName: "Tech Startup Inc",
		orgId: 2,
		action: "Exit",
		timestamp: new Date("2024-01-22 17:30:00"),
		location: "Front Desk",
		reader: "RFID-Reader-003",
		status: "Success"
	},
	"7":
	{
		id: 7,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Entry",
		timestamp: new Date("2024-01-22 09:00:00"),
		location: "Main Entrance",
		reader: "RFID-Reader-001",
		status: "Success"
	},
	"8":
	{
		id: 8,
		badgeNumber: "BADGE-001",
		orgName: "Acme Corporation",
		orgId: 1,
		action: "Exit",
		timestamp: new Date("2024-01-22 18:00:00"),
		location: "Main Entrance",
		reader: "RFID-Reader-001",
		status: "Success"
	}
};

export default function RecordDetails()
{
	const params = useParams();
	const recordId = params.id as string;
	const record = mock_records_data[recordId];
	const record_details_items =
	[
		{ label: "Record ID", value: `#${record.id}`, icon: faHashtag, mono: true },
		{ label: "Badge number", value: record.badgeNumber, icon: faTag, mono: true },
		{ label: "Organization", value: record.orgName, icon: faBuilding, link: `/organizations/${record.orgId}` },
		{ label: "Action type", value: record.action, icon: faBolt },
		{ label: "Timestamp", value: record.timestamp.toLocaleString(), icon: faClock },
	];

	if (!record)
	{
		return (
			<div className="min-h-screen bg-[#111111] text-white">
				<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
					<Link href="/records" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
						Records
					</Link>
				</header>
		
				<main className="max-w-md mx-auto px-5 py-24 flex flex-col items-center text-center gap-5">
					<div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
						<FontAwesomeIcon icon={faShield} className="text-red-400 text-xl" />
					</div>
					<div>
						<h1 className="text-lg font-bold mb-2">Record not found</h1>
						<p className="text-[#555555] text-[16px]">This access record doesn"t exist or has been removed.</p>
					</div>
					<Link href="/records" className="flex items-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white text-[16px] font-bold px-6 py-2.5 rounded-xl transition-colors">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
						Back to Records
					</Link>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#111111] text-white">
			<header className="px-5 md:px-8 py-4 border-b border-[#222222] flex items-center gap-3 sticky top-0 z-50 bg-[#111111]/90 backdrop-blur-md">
				<Link href="/records" className="flex items-center gap-1.5 text-[#555555] hover:text-white text-[16px] transition-colors group">
					<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
					Records
				</Link>
				<div className="w-px h-4 bg-[#2A2A2A]" />
				<span className="text-[16px] font-semibold">Record #{record.id}</span>
			</header>

			<main className="max-w-2xl mx-auto px-5 md:px-8 py-10 flex flex-col gap-5">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h1 className="text-xl font-bold">Record #{record.id}</h1>
						<p className="text-[#555555] text-[16px] mt-1 font-mono">{record.badgeNumber} · {record.orgName}</p>
					</div>
					<span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border shrink-0 mt-1 ${record.action === "Entry" ? "bg-green-500/6 text-green-400 border-green-500/20" : "bg-orange-500/6 text-orange-400 border-orange-500/20"}`}>
						<FontAwesomeIcon icon={record.action === "Entry" ? faArrowRightToBracket : faArrowRightFromBracket} className="text-[9px]" />
						{record.action}
					</span>
				</div>

				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					<div className="px-5 py-3.5 border-b border-[#222222] flex items-center gap-2">
						<FontAwesomeIcon icon={faCircleCheck} className="text-green-400 text-[16px]" />
						<span className="text-[16px] font-semibold">{record.status}</span>
						<span className="text-[#555555] text-xs ml-1">— Authentication verified</span>
					</div>

					<div className="divide-y divide-[#1E1E1E]">
						{record_details_items.map((item, index) =>
						(
							<div key={index} className="flex items-center justify-between px-5 py-3.5 gap-4">
								<div className="flex items-center gap-2.5 min-w-0">
									<FontAwesomeIcon icon={item.icon} className="text-[#444444] text-xs w-3.5 shrink-0" />
									<span className="text-[11px] text-[#555555] font-bold uppercase tracking-widest shrink-0">{item.label}</span>
								</div>
								{item.link ?
								(
									<Link href={item.link} className="flex items-center gap-1.5 text-[16px] text-[#E8963A] hover:text-[#F4A94A] transition-colors font-medium group/link">
										{item.value}
										<FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover/link:translate-x-0.5 transition-transform" />
									</Link>
								) : ( <span className={`text-[16px] text-[#CCCCCC] font-medium truncate ${item.mono ? "font-mono" : ""}`}>{item.value}</span> )}
							</div>
						))}
					</div>
				</div>

				<div className="bg-[#1A1A1A] border border-[#222222] rounded-2xl overflow-hidden">
					<div className="px-5 py-3.5 border-b border-[#222222]">
						<span className="text-xs text-[#444444] font-bold uppercase tracking-widest">Access point</span>
					</div>
					<div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#1E1E1E]">
						<div className="px-5 py-4 flex flex-col gap-1">
							<div className="flex items-center gap-2 text-[#555555] text-xs mb-1">
								<FontAwesomeIcon icon={faLocationDot} className="text-xs" />
								Location
							</div>
							<span className="text-[16px] font-semibold text-white">{record.location}</span>
						</div>
						<div className="px-5 py-4 flex flex-col gap-1">
							<div className="flex items-center gap-2 text-[#555555] text-xs mb-1">
								<FontAwesomeIcon icon={faWifi} className="text-xs" />
								RFID reader
							</div>
							<span className="text-[16px] font-semibold font-mono text-white">{record.reader}</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col sm:flex-row gap-3">
					<Link href="/records" className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#222222] border border-[#2A2A2A] text-[16px] font-semibold text-[#AAAAAA] hover:text-white rounded-xl px-5 py-3 transition-colors group">
						<FontAwesomeIcon icon={faChevronLeft} className="text-xs group-hover:-translate-x-0.5 transition-transform" />
						Back to Records
					</Link>
					<Link href="/badge" className="flex-1 flex items-center justify-center gap-2 bg-[#E8963A] hover:bg-[#D4842A] text-white text-[16px] font-bold rounded-xl px-5 py-3 transition-colors">
						<FontAwesomeIcon icon={faAward} className="text-[16px]" />
						View associated badge
					</Link>
				</div>
			</main>
		</div>
	);
}
