import { getSession } from "@/lib/sessionManage";
import LandingPageClient from "@/components/LandingPageClient";

export default async function Home() {
    const sessionData = await getSession();

    return <LandingPageClient isLoggedIn={!!sessionData} role={sessionData?.role} />;
}
