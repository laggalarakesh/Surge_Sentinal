
import React, { useState, useEffect } from 'react';
import { FileText, Zap, BarChart2, AlertTriangle, Languages, Users, FileDown, Activity, Bell, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { SurgeTrendChart } from '../charts/SurgeTrendChart';
import { generateAdvisory, getStaffingRecommendations } from '../../services/geminiService';
import type { AdvisoryContent, User } from '../../types';
import { Spinner } from '../ui/Spinner';
import { HospitalReport } from '../reports/HospitalReport';
import { ChatbotView } from './ChatbotView';
import { updateHospitalData, subscribeToAlerts, type SystemAlert } from '../../services/dbService';

interface ReportData {
    op: number;
    ip: number;
    emergency: number;
    advisory: AdvisoryContent;
}

interface HospitalDashboardProps {
    activePage: string;
    user: User;
}

const PatientIntakeCard: React.FC<{
    onGenerate: (op: number, ip: number, er: number) => void;
    isLoading: boolean;
}> = ({ onGenerate, isLoading }) => {
  const [op, setOp] = useState(350);
  const [ip, setIp] = useState(480);
  const [emergency, setEmergency] = useState(210);

  const handleGenerateClick = () => {
    onGenerate(op, ip, emergency);
  };
  
  return (
    <Card title="Patient Intake" icon={<FileText size={20} />}>
      <div className="space-y-4">
        <div>
          <label htmlFor="op-count" className="block text-sm font-medium text-gray-700">Out-Patients (OP)</label>
          <input
            type="number"
            id="op-count"
            value={op}
            onChange={(e) => setOp(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none sm:text-sm p-2 transition-all"
          />
        </div>
        <div>
          <label htmlFor="ip-count" className="block text-sm font-medium text-gray-700">In-Patients (IP)</label>
          <input
            type="number"
            id="ip-count"
            value={ip}
            onChange={(e) => setIp(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none sm:text-sm p-2 transition-all"
          />
        </div>
        <div>
          <label htmlFor="er-count" className="block text-sm font-medium text-gray-700">Emergency (ER)</label>
          <input
            type="number"
            id="er-count"
            value={emergency}
            onChange={(e) => setEmergency(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none sm:text-sm p-2 transition-all"
          />
        </div>
        <button
          onClick={handleGenerateClick}
          disabled={isLoading}
          className="w-full flex justify-center items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-dark focus:ring-offset-2 disabled:bg-gray-400"
        >
          {isLoading ? <Spinner size="sm" /> : <Zap size={16} />}
          {isLoading ? 'Generating...' : 'Generate AI Advisory'}
        </button>
      </div>
    </Card>
  );
};


const AdvisoryPanel: React.FC<{ content: AdvisoryContent | null, error: string | null }> = ({ content, error }) => {
    const severityColors = {
        Low: 'bg-green-100 text-green-800 border-green-400',
        Medium: 'bg-yellow-100 text-yellow-800 border-yellow-400',
        High: 'bg-red-100 text-red-800 border-red-400',
    };
    
    if (error) {
        return (
            <div className="text-red-600 bg-red-100 p-4 rounded-lg">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
            </div>
        );
    }
    if (!content) return <p className="text-center text-gray-500 py-16">Enter patient data and click generate to see the AI-powered advisory.</p>;
    
    return (
        <div className="space-y-4">
            <div className={`p-3 rounded-lg border-l-4 ${severityColors[content.severity]}`}>
                <p className="font-bold">Severity: {content.severity}</p>
                <p className="text-sm">{content.recommendation}</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-md font-semibold text-on-surface flex items-center gap-2"><Languages size={18}/> Translations</h4>
              <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-sm">English</p>
                  <p className="text-sm">{content.english}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-sm">Hindi</p>
                  <p className="text-sm">{content.hindi}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-sm">Telugu</p>
                  <p className="text-sm">{content.telugu}</p>
              </div>
               <div className="p-3 bg-gray-50 rounded-md">
                  <p className="font-semibold text-sm">Tamil</p>
                  <p className="text-sm">{content.tamil}</p>
              </div>
            </div>
            <button className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-dark">
                Broadcast Advisory
            </button>
        </div>
    );
};

const AlertsList: React.FC = () => {
    const [alerts, setAlerts] = useState<SystemAlert[]>([]);

    useEffect(() => {
        const unsubscribe = subscribeToAlerts((newAlerts) => {
            setAlerts(newAlerts);
        });
        return () => unsubscribe();
    }, []);

    const severityColors: Record<string, string> = {
        Low: 'bg-green-50 border-green-200 text-green-800',
        Medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        High: 'bg-orange-50 border-orange-200 text-orange-800',
        Critical: 'bg-red-50 border-red-200 text-red-800',
    };

    return (
        <Card title="Network Alerts" icon={<Bell size={20} className="text-red-500"/>}>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {alerts.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No active network alerts.</p>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className={`p-3 rounded-lg border text-sm ${severityColors[alert.severity] || severityColors.Low}`}>
                            <div className="flex justify-between items-start">
                                <span className="font-bold flex items-center gap-1">
                                    <Info size={14}/> {alert.title}
                                </span>
                                <span className="text-xs opacity-75">{new Date(alert.timestamp?.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <p className="mt-1">{alert.message}</p>
                            <p className="text-xs mt-2 opacity-75 font-semibold">- {alert.sender}</p>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
};

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({ activePage, user }) => {
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [staffSuggestion, setStaffSuggestion] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateAdvisory = async (op: number, ip: number, er: number) => {
        setIsLoading(true);
        setError(null);
        setReportData(null);
        setStaffSuggestion(null);
        
        try {
            const capacity = 1000; // Simulated capacity
            const advisoryResult = await generateAdvisory(op, ip, er, capacity);
            
            // Sync data to Cloud Firestore for Admin to see
            await updateHospitalData(user.displayName, {
                name: user.displayName,
                op, ip, er, capacity,
                status: advisoryResult.severity === 'High' ? 'High Surge' : advisoryResult.severity === 'Medium' ? 'Moderate' : 'Normal',
            });

            setReportData({ op, ip, emergency: er, advisory: advisoryResult });
            
            const suggestion = await getStaffingRecommendations(op, ip, er);
            setStaffSuggestion(suggestion);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    if (activePage === 'AI Assistant') {
        return <ChatbotView />;
    }

    // Default / Dashboard View
    if (activePage === 'Dashboard' || activePage === '') {
        return (
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <PatientIntakeCard onGenerate={handleGenerateAdvisory} isLoading={isLoading} />
                     <Card title="Quick Stats" icon={<Activity size={20} />}>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500">Occupancy</p>
                                <p className="text-lg font-bold text-gray-800">82%</p>
                            </div>
                            <div className="p-2 bg-gray-50 rounded">
                                <p className="text-xs text-gray-500">Staffing</p>
                                <p className="text-lg font-bold text-green-600">Optimal</p>
                            </div>
                        </div>
                    </Card>
                    <AlertsList />
                </div>
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Real-Time Surge Trends" icon={<BarChart2 size={20} />}>
                        <SurgeTrendChart />
                    </Card>
                     {staffSuggestion && (
                         <Card title="Recent AI Staffing Suggestion" icon={<Users size={20} />}>
                            <ul className="space-y-2 text-sm">
                                {staffSuggestion.split('•').filter(s => s.trim()).map((s, i) => (
                                    <li key={i}>{s.replace(/\*\*/g, '')}</li>
                                ))}
                            </ul>
                        </Card>
                    )}
                </div>
            </div>
        );
    }

    if (activePage === 'Advisories') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                     <PatientIntakeCard onGenerate={handleGenerateAdvisory} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-2">
                     <Card title="Advisory Generator" icon={<AlertTriangle size={20} />}>
                       {isLoading && <div className="flex justify-center items-center h-64"><Spinner /></div>}
                       {!isLoading && <AdvisoryPanel content={reportData?.advisory || null} error={error} />}
                    </Card>
                </div>
            </div>
        );
    }
    
     if (activePage === 'Reports') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Download Daily Report" icon={<FileDown size={20} />}>
                     <p className="text-sm mb-4">Generate and download a comprehensive PDF report of daily patient intake, AI advisories, and surge trends.</p>
                     
                     <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
                        <h4 className="font-semibold text-sm mb-2">Report Preview</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                             <p>Date: {new Date().toLocaleDateString()}</p>
                             <p>Status: {reportData ? 'Ready to Print' : 'No Data Generated'}</p>
                        </div>
                     </div>

                     <button
                        onClick={() => window.print()}
                        disabled={!reportData}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-secondary-dark disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {reportData ? 'Print / Save as PDF' : 'Generate Advisory Data First'}
                    </button>
                    {!reportData && <p className="text-xs text-red-500 mt-2 text-center">Please go to 'Advisories' and generate data first.</p>}
                 </Card>
                 
                 {reportData && (
                    <div className="hidden print-only">
                        <HospitalReport {...reportData} />
                    </div>
                )}
            </div>
        )
    }

    return <div>Page not found</div>;
};
