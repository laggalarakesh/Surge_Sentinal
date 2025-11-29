import React from 'react';
import { Shield, Users, Server } from 'lucide-react';

const mockLogs = [
  { level: 'INFO', message: "User 'admin@medflux.ai' logged in from IP 192.168.1.1.", timestamp: '2023-10-27 09:00:15' },
  { level: 'WARN', message: "API latency high for region 'North'. Average response time: 1200ms.", timestamp: '2023-10-27 09:05:22' },
  { level: 'INFO', message: "Generated advisory for 'City General'. Severity: Medium.", timestamp: '2023-10-27 09:10:03' },
  { level: 'ERROR', message: "Failed to export dataset for 'research@medflux.ai'. Reason: Timeout.", timestamp: '2023-10-27 09:12:45' },
  { level: 'INFO', message: "Hospital 'St. Jude's' updated patient intake.", timestamp: '2023-10-27 09:15:30' },
];

const mockActivity = [
    { user: 'Super Admin', action: 'Accessed System Health panel.', timestamp: '2023-10-27 08:55:00' },
    { user: 'Regional Admin', action: 'Broadcasted alert to 15 hospitals.', timestamp: '2023-10-27 08:40:10' },
    { user: 'Dr. Anya Sharma', action: 'Ran AI analytics query on seasonal trends.', timestamp: '2023-10-27 08:30:55' },
    { user: 'City General', action: 'Generated new AI advisory.', timestamp: '2023-10-27 08:25:00' },
];

export const SuperAdminReport: React.FC = () => {
    const generationDate = new Date().toLocaleString();

    const levelColor: Record<string, string> = {
        INFO: 'text-blue-600',
        WARN: 'text-yellow-600',
        ERROR: 'text-red-600',
    };

    return (
        <div className="bg-white text-black p-4">
            <header className="mb-8 text-center border-b-2 border-gray-300 pb-4">
                <h1 className="text-3xl font-bold text-gray-800">SurgeSentinel</h1>
                <h2 className="text-xl font-semibold text-gray-600">System Activity & Log Report</h2>
                <p className="text-sm text-gray-500 mt-2">Generated on: {generationDate}</p>
            </header>

            <main>
                <section className="mb-8">
                    <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center"><Server size={20} className="mr-2" /> System Logs</h3>
                    <table className="w-full text-sm border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Level</th>
                                <th className="border border-gray-300 p-2 text-left">Timestamp</th>
                                <th className="border border-gray-300 p-2 text-left">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockLogs.map((log, index) => (
                                <tr key={index}>
                                    <td className={`border border-gray-300 p-2 font-mono font-semibold ${levelColor[log.level]}`}>{log.level}</td>
                                    <td className="border border-gray-300 p-2 font-mono">{log.timestamp}</td>
                                    <td className="border border-gray-300 p-2">{log.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section>
                    <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center"><Users size={20} className="mr-2" /> Recent User Activity</h3>
                    <table className="w-full text-sm border-collapse border border-gray-300">
                         <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2 text-left">Timestamp</th>
                                <th className="border border-gray-300 p-2 text-left">User</th>
                                <th className="border border-gray-300 p-2 text-left">Action</th>
                            </tr>
                        </thead>
                         <tbody>
                            {mockActivity.map((activity, index) => (
                                <tr key={index}>
                                    <td className="border border-gray-300 p-2 font-mono">{activity.timestamp}</td>
                                    <td className="border border-gray-300 p-2 font-semibold">{activity.user}</td>
                                    <td className="border border-gray-300 p-2">{activity.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
            
            <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
                <p>This is an auto-generated report. Please store it securely.</p>
                <p>&copy; {new Date().getFullYear()} SurgeSentinel. All rights reserved.</p>
            </footer>
        </div>
    );
};
