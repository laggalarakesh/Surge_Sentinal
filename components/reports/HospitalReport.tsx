import React from 'react';
import type { AdvisoryContent } from '../../types';
import { SurgeTrendChart } from '../charts/SurgeTrendChart';
import { FileText, AlertTriangle, BarChart2 } from 'lucide-react';

interface HospitalReportProps {
  op: number;
  ip: number;
  emergency: number;
  advisory: AdvisoryContent;
}

export const HospitalReport: React.FC<HospitalReportProps> = ({ op, ip, emergency, advisory }) => {
  const generationDate = new Date().toLocaleDateString();
  const severityClasses: Record<string, string> = {
    Low: 'text-green-700 bg-green-100 border-green-500',
    Medium: 'text-yellow-700 bg-yellow-100 border-yellow-500',
    High: 'text-red-700 bg-red-100 border-red-500',
  };

  return (
    <div className="bg-white text-black p-4">
      <header className="mb-8 text-center border-b-2 border-gray-300 pb-4">
        <h1 className="text-3xl font-bold text-gray-800">SurgeSentinel</h1>
        <h2 className="text-xl font-semibold text-gray-600">Daily Patient Surge Report</h2>
        <p className="text-sm text-gray-500 mt-2">Report for: {generationDate}</p>
      </header>

      <main>
        <section className="mb-8">
          <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
            <FileText size={20} className="mr-2" /> Patient Intake Summary
          </h3>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Patient Category</th>
                <th className="border border-gray-300 p-2 text-left">Count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Out-Patients (OP)</td>
                <td className="border border-gray-300 p-2">{op}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">In-Patients (IP)</td>
                <td className="border border-gray-300 p-2">{ip}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2 font-semibold">Emergency (ER)</td>
                <td className="border border-gray-300 p-2">{emergency}</td>
              </tr>
               <tr className="bg-gray-50">
                <td className="border border-gray-300 p-2 font-bold">Total</td>
                <td className="border border-gray-300 p-2 font-bold">{op + ip + emergency}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
                <AlertTriangle size={20} className="mr-2" /> AI Generated Advisory
            </h3>
            <div className={`border-l-4 p-4 rounded-r-md ${severityClasses[advisory.severity]}`}>
                <p className="font-bold">Severity Level: {advisory.severity}</p>
                <p className="font-semibold mt-2">Recommendation:</p>
                <p>{advisory.recommendation}</p>
            </div>
             <div className="mt-4 p-4 border border-gray-200 rounded-md">
                 <p className="font-semibold text-gray-600">Full Advisory (English):</p>
                 <p className="text-gray-800 italic">"{advisory.english}"</p>
            </div>
        </section>

        <section className="break-before-page">
             <h3 className="text-lg font-bold text-gray-700 mb-2 flex items-center">
                <BarChart2 size={20} className="mr-2" /> Weekly Surge Trend
            </h3>
            <div style={{ width: '100%', height: 350 }}>
                <SurgeTrendChart />
            </div>
        </section>
      </main>
      
      <footer className="mt-8 pt-4 border-t text-center text-xs text-gray-500">
        <p>This is an auto-generated report from the SurgeSentinel platform.</p>
        <p>&copy; {new Date().getFullYear()} SurgeSentinel. All rights reserved.</p>
      </footer>
    </div>
  );
};
