import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
export function App() {
    const [requests, setRequests] = useState(0);
    const [blocked, setBlocked] = useState(0);
    const [performed, setPerformed] = useState(0);
    
    useEffect(() => {
        browser.storage.local.get().then((data) => {
            setRequests(data.requestCount || 0);
            setBlocked(data.blockedCount || 0);
            setPerformed(data.requestCount - data.blockedCount || 0);
        });
    }, []);

    const reset = () => {
        browser.storage.local.clear().then(() => {
            setRequests(0);
            setBlocked(0);
            setPerformed(0);
        });
    }

    const downloadMetricsAsJson = () => {
        browser.storage.local.get().then((data) => {
            const a = document.createElement("a");
            const file = new Blob([JSON.stringify(data)], { type: "application/json" });
            a.href = URL.createObjectURL(file);
            a.download = "metrics.json";
            a.click();
        });
    }


    return (
        <div className="w-[400px] p-6 bg-background text-foreground">
            <header className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Evaluate On Surf</h1>

            </header>
            <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-1"> 
                        {requests}
                    </h3>
                    <p className="text-muted-foreground text-sm">Total Requests</p>
                </div>
                <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-1">
                        {blocked}
                    </h3>
                    <p className="text-muted-foreground text-sm">Requests Blocked</p>
                </div>
                <div className="bg-card p-4 rounded-lg text-center">
                    <h3 className="text-xl font-bold mb-1">
                        {performed}
                    </h3>
                    <p className="text-muted-foreground text-sm">Requests Performed</p>
                </div>
            </div>
            <div className="flex justify-between">
                <div className="inline-block px-4 py-2 border border-gray-300 hover:cursor-pointer rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => reset()}>Reset</div>
                <div className="inline-block px-4 py-2 border border-transparent hover:cursor-pointer rounded text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => downloadMetricsAsJson()}>Download Dataset</div>
            </div>
        </div>
    )
}