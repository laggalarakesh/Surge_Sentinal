
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Building, Bell, BarChart3, Plus, Trash2, Map } from 'lucide-react';
import { ChatbotView } from './ChatbotView';
import { subscribeToHospitalData, type HospitalStats } from '../../services/dbService';
import type { User } from '../../types';
import { SurgeHeatmap } from '../charts/SurgeHeatmap';

interface AdminDashboardProps {
    activePage: string;
    user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ activePage }) => {
    const [managedHospitalsCount, setManagedHospitalsCount] = useState(15);
    const [hospitalData, setHospitalData] = useState<HospitalStats[]>([]);

    useEffect(() => {
        // Subscribe to real-time hospital data updates
        const unsubscribe = subscribeToHospitalData((data) => {
            setHospitalData(data);
        });
        return () => unsubscribe();
    }, []);

    if (activePage === 'AI Assistant') {
        return <ChatbotView />;
    }

    if (activePage === 'Manage Hospitals') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Hospital Management</h2>
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark text-sm">
                        <Plus size={16} /> Add Hospital
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hospitalData.length > 0 ? hospitalData.map(h => (
                        <Card key={h.id} title={h.name} icon={<Building size={18} />}>
                            <div className="flex justify-between items-center mt-2">
                                <div>
                                    <p className="text-sm text-gray-600">Capacity: {h.capacity}</p>
                                    <p className={`text-xs font-semibold ${h.status === 'High Surge' ? 'text-red-600' : 'text-green-600'}`}>Status: {h.status}</p>
                                </div>
                                <button className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </Card>
                    )) : (
                         [1, 2, 3, 4].map(i => (
                            <Card key={i} title={`City Hospital ${i} (Demo)`} icon={<Building size={18} />}>
                                <div className="flex justify-between items-center mt-2">
                                    <div>
                                        <p className="text-sm text-gray-600">Region: North</p>
                                        <p className="text-xs text-green-600 font-semibold">Status: Active</p>
                                    </div>
                                    <button className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        );
    }

    if (activePage === 'Alerts') {
        return (
            <div className="max-w-2xl mx-auto">
                <Card title="Broadcast Regional Alert" icon={<Bell size={20} />}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Alert Title</label>
                            <input type="text" className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-primary focus:border-primary" placeholder="e.g. Severe Weather Warning" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Message</label>
                            <textarea className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 focus:ring-primary focus:border-primary" rows={4} placeholder="Enter alert details..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Severity</label>
                            <select className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                        </div>
                        <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 font-semibold">
                            Send Broadcast
                        </button>
                    </div>
                </Card>
            </div>
        );
    }

    // Default: Regional Dashboard
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card title="Managed Hospitals" icon={<Building size={24} />}>
                    <p className="text-3xl font-bold text-on-surface transition-all duration-300">
                        {hospitalData.length > 0 ? hospitalData.length : managedHospitalsCount}
                    </p>
                    <p className="text-sm text-gray-500">Connected in Network</p>
                </Card>
                <Card title="Active Alerts" icon={<Bell size={24} />}>
                    <p className="text-3xl font-bold text-yellow-600">3</p>
                    <p className="text-sm text-gray-500">High volume warnings</p>
                </Card>
                <Card title="Regional Trend" icon={<BarChart3 size={24} />}>
                    <p className="text-3xl font-bold text-green-600">Stable</p>
                    <p className="text-sm text-gray-500">Patient load is manageable</p>
                </Card>
            </div>

            {/* Global/Regional Heatmap Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                     <Card title="Regional Hospital Status (Real-Time)">
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium text-gray-700">Hospital Name</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Capacity Load</th>
                                        <th className="px-4 py-3 font-medium text-gray-700">Last Update</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {hospitalData.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                                                No live hospital data received yet. Hospitals must submit intake forms.
                                            </td>
                                        </tr>
                                    ) : (
                                        hospitalData.map(h => (
                                            <tr key={h.id}>
                                                <td className="px-4 py-3 font-medium">{h.name}</td>
                                                <td className={`px-4 py-3 font-semibold ${
                                                    h.status === 'High Surge' || h.status === 'Critical' ? 'text-red-600' :
                                                    h.status === 'Moderate' ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {h.status}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {Math.round(((h.op + h.ip + h.er) / h.capacity) * 100)}% ({h.op + h.ip + h.er}/{h.capacity})
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">
                                                    {h.lastUpdated ? new Date(h.lastUpdated.seconds * 1000).toLocaleTimeString() : 'Just now'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-1">
                    <Card title="Surge Intensity Map" icon={<Map size={20}/>}>
                         <SurgeHeatmap />
                         <p className="text-xs text-gray-500 mt-2 text-center">Real-time simulation of regional load intensity.</p>
                    </Card>
                </div>
            </div>
        </div>
    );
};
