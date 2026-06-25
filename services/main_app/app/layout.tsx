import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata =
{
	title:
	{
		default: "BadgeHub",
		template: "%s | BadgeHub",
	},
	description: "An orchestrated system for organizational identities. Engineered for precision, designed for humans. Real-time NFC badge management, attendance tracking, and credential verification.",
	keywords: ["badge management", "NFC", "attendance tracking", "organizations", "credentials", "42 network", "real-time"],
	authors: [{ name: "BadgeHub" }],
	creator: "BadgeHub",
	openGraph:
	{
		title: "BadgeHub — Badge management made simple",
		description: "An orchestrated system for organizational identities. Real-time NFC badge tracking, advanced permissions, and analytics — engineered for precision.",
		siteName: "BadgeHub",
		type: "website",
		locale: "en_US",
	},
	twitter:
	{
		card: "summary_large_image",
		title: "BadgeHub — Badge management made simple",
		description: "Real-time NFC badge management and attendance tracking for organizations.",
		creator: "@badgehub",
	},
	robots:
	{
		index: true,
		follow: true,
	},
	icons:
	{
		icon: "/favicon.ico",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>)
{
	return (
		<html lang="en" className={`h-full antialiased`}>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
