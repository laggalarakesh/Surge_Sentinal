
import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Database, Bot, FileText, Download, Send, Microscope, ExternalLink, Activity, AlertOctagon, Megaphone } from 'lucide-react';
import { getResearchAnalysis, getRiskAssessment } from '../../services/geminiService';
import { Spinner } from '../ui/Spinner';
import { ChatbotView } from './ChatbotView';
import { RiskAnalysisChart, riskData } from '../charts/RiskAnalysisChart';
import { EpidemicMetricsChart } from '../charts/EpidemicMetricsChart';
import { sendSystemAlert } from '../../services/dbService';
import type { User } from '../../types';

interface ResearcherDashboardProps {
    activePage: string;
    user: User;
}

const DataViewerCard = () => (
    <Card title="Anonymized Data Viewer" icon={<Database size={20}/>}>
        <p className="text-sm mb-4">Filter and explore regional surge data. All data is de-identified to protect privacy.</p>
        <div className="flex gap-2 mb-4">
            <select className="flex-1 rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all">
                <option>All Regions</option>
                <option>City Center</option>
                <option>North Suburbs</option>
            </select>
            <input type="date" className="flex-1 rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all"/>
        </div>
        <div className="border rounded-md p-2 h-48 bg-gray-50 mb-4 overflow-auto text-xs font-mono">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-1">Date</th>
                        <th className="p-1">Region</th>
                        <th className="p-1">Volume</th>
                    </tr>
                </thead>
                <tbody>
                    <tr><td className="p-1">2023-10-27</td><td className="p-1">North</td><td className="p-1">High</td></tr>
                    <tr><td className="p-1">2023-10-27</td><td className="p-1">Center</td><td className="p-1">Med</td></tr>
                    <tr><td className="p-1">2023-10-26</td><td className="p-1">North</td><td className="p-1">High</td></tr>
                    <tr><td className="p-1">2023-10-26</td><td className="p-1">West</td><td className="p-1">Low</td></tr>
                    <tr><td className="p-1">2023-10-25</td><td className="p-1">Center</td><td className="p-1">High</td></tr>
                </tbody>
            </table>
        </div>
        <button className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
            <Download size={16} /> Export CSV
        </button>
    </Card>
);

const AIAnalyticsCard = () => {
    const [query, setQuery] = useState('');
    const [analysis, setAnalysis] = useState<{ content: string; sources: { title: string; uri: string }[] } | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!query.trim()) return;
        setIsLoading(true);
        setAnalysis(null);
        try {
            const result = await getResearchAnalysis(query);
            setAnalysis(result);
        } catch (error) {
            setAnalysis({ content: "Error running analysis.", sources: [] });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePredefinedQueryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value) {
            setQuery(value);
        }
    };

    return (
        <Card title="AI Trend Analysis with Search Grounding" icon={<Microscope size={20}/>}>
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Template</label>
                    <select 
                        className="w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all mb-3 text-gray-600"
                        onChange={handlePredefinedQueryChange}
                        defaultValue=""
                    >
                        <option value="" disabled>Select a query type...</option>
                        <option value="Analyze the correlation between recent weather patterns and increased ER visits in the region.">Correlation with Weather</option>
                        <option value="Analyze the demographic impact of the recent surge, focusing on age groups and vulnerabilities.">Demographic Impact</option>
                        <option value="Identify emerging symptom clusters from the recent patient intake data.">Symptom Cluster Identification</option>
                        <option value="Compare current surge trends with historical data from the same period last year.">Historical Comparison</option>
                        <option value="Project resource utilization for the next 7 days based on current infection trends.">Resource Projection</option>
                    </select>

                    <label className="block text-sm font-medium text-gray-700">Research Query</label>
                    <div className="flex gap-2 mt-1">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. Correlation between rain and ER visits"
                            className="flex-1 rounded-md border border-gray-300 shadow-sm p-2 focus:border-secondary focus:ring-2 focus:ring-secondary focus:outline-none transition-all"
                        />
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading}
                            className="bg-secondary text-white p-2 rounded-md hover:bg-secondary-dark disabled:bg-gray-400"
                        >
                            {isLoading ? <Spinner size="sm"/> : <Send size={18} />}
                        </button>
                    </div>
                </div>
                {analysis && (
                    <div className="bg-blue-50 p-4 rounded-md border border-blue-100 text-sm text-gray-800">
                        <p className="font-semibold mb-2 flex items-center gap-2"><Bot size={16}/> AI Insight:</p>
                        <p className="whitespace-pre-line mb-4">{analysis.content}</p>
                        
                        {analysis.sources.length > 0 && (
                            <div className="pt-3 border-t border-blue-200">
                                <p className="text-xs font-semibold text-blue-700 mb-1">Sources:</p>
                                <ul className="space-y-1">
                                    {analysis.sources.map((source, idx) => (
                                        <li key={idx}>
                                            <a 
                                                href={source.uri} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                <ExternalLink size={10} /> {source.title}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

const RiskAnalysisPanel = () => {
    const [report, setReport] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateRiskReport = async () => {
        setLoading(true);
        try {
            const result = await getRiskAssessment(riskData);
            setReport(result);
        } catch (e) {
            setReport("Failed to generate report.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Epidemiological Risk Modeling" icon={<AlertOctagon size={20} className="text-red-500" />}>
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold text-gray-600 mb-4">Projected Outbreak Trajectory (7 Days)</h4>
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
                        <RiskAnalysisChart />
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button 
                        onClick={generateRiskReport}
                        disabled={loading}
                        className="self-start flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                        {loading ? <Spinner size="sm"/> : <Activity size={16} />}
                        {loading ? 'Analyzing Data...' : 'Run AI Risk Assessment'}
                    </button>

                    {report && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded animate-fade-in">
                            <h5 className="font-bold text-red-800 flex items-center gap-2 mb-2">
                                <Bot size={16}/> Risk Analysis Report
                            </h5>
                            <div className="prose prose-sm text-red-900 max-w-none">
                                <ul className="list-disc pl-4 space-y-1">
                                    {report.split('•').filter(Boolean).map((point, i) => (
                                        <li key={i} className="pl-1">
                                            <span dangerouslySetInnerHTML={{ __html: point.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

const BroadcastAlertCard: React.FC<{ user: User }> = ({ user }) => {
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;
        setSending(true);
        try {
            await sendSystemAlert({
                title: 'Research Alert',
                message,
                severity,
                sender: user.displayName,
            });
            setMessage('');
            alert('Alert sent successfully to network.');
        } catch (error) {
            alert('Failed to send alert.');
        } finally {
            setSending(false);
        }
    };

    return (
        <Card title="Broadcast Network Alert" icon={<Megaphone size={20} className="text-orange-500"/>}>
            <div className="space-y-3">
                <p className="text-sm text-gray-500">Send an immediate alert to all hospitals and admins in the network based on your findings.</p>
                <div>
                    <label className="block text-xs font-medium text-gray-700">Severity Level</label>
                    <select 
                        value={severity} 
                        onChange={(e) => setSeverity(e.target.value as any)}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm focus:border-secondary focus:ring-2"
                    >
                        <option value="Low">Low - Informational</option>
                        <option value="Medium">Medium - Precautionary</option>
                        <option value="High">High - Urgent Action Required</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-700">Alert Message</label>
                    <textarea 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. Rapid increase in viral pneumonia cases detected in North Region."
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm p-2 text-sm h-24 focus:border-secondary focus:ring-2"
                    />
                </div>
                <button 
                    onClick={handleSend}
                    disabled={sending || !message.trim()}
                    className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 text-sm font-semibold flex justify-center items-center gap-2"
                >
                    {sending ? <Spinner size="sm"/> : <Send size={16} />}
                    Send Alert to Hospitals
                </button>
            </div>
        </Card>
    );
};

export const ResearcherDashboard: React.FC<ResearcherDashboardProps> = ({ activePage, user }) => {
    if (activePage === 'AI Assistant') {
        return <ChatbotView />;
    }

    if (activePage === 'AI Analytics') {
        return (
             <div className="grid grid-cols-1 gap-6">
                 <RiskAnalysisPanel />
                 <div className="max-w-3xl mx-auto w-full">
                     <AIAnalyticsCard />
                 </div>
             </div>
        );
    }

    if (activePage === 'Datasets') {
         return (
            <div className="space-y-6">
                <Card title="Available Datasets" icon={<Database size={20} />}>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {[1, 2, 3].map(i => (
                             <div key={i} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                                 <div className="flex justify-between items-start mb-2">
                                     <h4 className="font-semibold text-gray-800">Regional Surge Data Q{i}</h4>
                                     <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified</span>
                                 </div>
                                 <p className="text-sm text-gray-500 mb-3">Anonymized patient volume, admission rates, and symptom clusters.</p>
                                 <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                                     <Download size={14}/> Download .CSV
                                 </button>
                             </div>
                         ))}
                     </div>
                </Card>
            </div>
         )
    }

    // Default: Dashboard
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <RiskAnalysisPanel />
                    <Card title="Key Metrics Trends" icon={<Activity size={20} />}>
                         <p className="text-sm text-gray-500 mb-4">Tracking Reproduction Number (R0) vs Infection Rate</p>
                         <EpidemicMetricsChart />
                    </Card>
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <BroadcastAlertCard user={user} />
                    <DataViewerCard />
                </div>
            </div>
            
            <Card title="Recent Reports" icon={<FileText size={20} />}>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                        <span className="text-sm font-medium text-gray-700">Weekly Epidemiology Report - North Region</span>
                        <span className="text-xs text-gray-500">Oct 26, 2023</span>
                    </div>
                    <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-gray-700">Impact of Air Quality on Respiratory Admissions</span>
                        <span className="text-xs text-gray-500">Oct 24, 2023</span>
                    </div>
                        <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer transition-colors">
                            <span className="text-sm font-medium text-gray-700">Viral Vector Analysis Q3</span>
                        <span className="text-xs text-gray-500">Oct 20, 2023</span>
                    </div>
                </div>
                </Card>
        </div>
    );
};
