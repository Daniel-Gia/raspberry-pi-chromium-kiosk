import { networkInterfaces } from 'os';

// Ensure the page is always rendered dynamically (so we get the IPs when we run not when we build)
export const dynamic = "force-dynamic";

const getIpAddresses = (): { name: string; ip: string }[] => {
    const nets = networkInterfaces();
    const results: { name: string; ip: string }[] = [];

    for (const name of Object.keys(nets)) {
        const interfaces = nets[name];
        if (interfaces) {
            for (const net of interfaces) {
                if (net.family === "IPv4" && !net.internal) {
                    results.push({ name, ip: net.address });
                }
            }
        }
    }

    return results;
};

export default function ShowIpPage() {
    const ips = getIpAddresses();

    return (
        <div className="min-h-screen w-full bg-black text-white relative overflow-hidden flex items-end justify-end p-8">
            <div className="flex flex-col items-end gap-2 opacity-60">
                {ips.length > 0 ? (
                    ips.map((item) => (
                        <div key={item.ip} className="text-4xl font-mono font-bold">
                            <span className="text-xl mr-4 text-gray-400">{item.name}</span>
                            {item.ip}
                        </div>
                    ))
                ) : (
                    <div className="text-4xl font-mono font-bold">No Network Connection</div>
                )}
            </div>
        </div>
    );
}
