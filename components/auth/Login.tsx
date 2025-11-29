
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { Hospital, Microscope, Users, UserCheck, Info, X, Zap, Shield, Activity } from 'lucide-react';

interface RoleSelectorProps {
  onLogin: (role: UserRole) => void;
}

const roleConfig = {
    [UserRole.ADMIN]: { icon: UserCheck, description: 'Manage hospitals and researchers for a specific region.' },
    [UserRole.HOSPITAL]: { icon: Hospital, description: 'Input patient data, generate advisories and view surge predictions.' },
    [UserRole.RESEARCHER]: { icon: Microscope, description: 'Access anonymized data and use AI tools for trend analysis.' },
    [UserRole.USER]: { icon: Users, description: 'View public health advisories and use the AI symptom chatbot.' },
}

export const Login: React.FC<RoleSelectorProps> = ({ onLogin }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 pt-20 relative">
      
      {/* Development Status Banner */}
      <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white p-3 shadow-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-center">
            <Info className="w-5 h-5 shrink-0 hidden sm:block" />
            <p className="text-sm font-medium">
                <span className="font-bold border-r border-blue-400 pr-2 mr-2">Development Phase</span>
                Frontend, backend logic, and database integration are complete. Secure role-based login and advanced workflows are currently being built.
            </p>
        </div>
      </div>

      <div className="text-center mb-8 animate-fade-in-up">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          SurgeSentinel
        </h1>
        <p className="mt-3 text-lg text-on-surface-muted max-w-2xl mx-auto">
          An AI-powered command center transforming raw patient data into predictive intelligence to manage hospital surges and prevent burnout.
        </p>
        <button 
            onClick={() => setShowDetails(true)}
            className="mt-4 text-primary hover:text-primary-dark font-medium underline underline-offset-4 flex items-center gap-2 mx-auto"
        >
            <Info size={16} /> Read Project Details & Solution
        </button>
      </div>
      
      <div className="max-w-4xl w-full animate-fade-in-up delay-100">
        <h2 className="text-xl font-semibold text-center text-on-surface mb-6">Select Your Role to Access Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(UserRole).filter(role => role !== UserRole.ADMIN).map(role => {
                 const Icon = roleConfig[role].icon;
                 return (
                    <button key={role} onClick={() => onLogin(role)} className="text-left bg-surface p-6 rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-primary group">
                        <div className="flex items-center mb-3">
                            <div className="p-3 bg-primary/10 rounded-full mr-4 group-hover:bg-primary/20 transition-colors">
                               <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-on-surface">{role}</h3>
                        </div>
                        <p className="text-sm text-on-surface-muted">{roleConfig[role].description}</p>
                    </button>
                )
            })}
             <div className="md:col-span-2 lg:col-span-3 flex justify-center space-x-4 mt-4">
                 <button onClick={() => onLogin(UserRole.ADMIN)} className="text-sm font-medium text-on-surface-muted hover:text-primary flex items-center gap-2">
                     <Shield size={14} /> Login as Regional Admin
                </button>
            </div>
        </div>
      </div>

      {/* Project Details Modal */}
      {showDetails && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto relative animate-fade-in">
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  >
                      <X size={20} className="text-gray-600" />
                  </button>
                  
                  <div className="p-8 space-y-8">
                      <div className="text-center border-b pb-6">
                          <h2 className="text-2xl font-bold text-gray-900">Project Overview</h2>
                          <p className="text-gray-500 mt-1">The Problem, The Solution, and The Tech</p>
                      </div>

                      <section className="space-y-4">
                          <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                              <Activity size={20} /> The Problem: Reactive Healthcare
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                              Hospitals are perpetually vulnerable to sudden patient influxes caused by seasonal illnesses or emergencies. 
                              This unpredictability leads to <strong>overwhelmed ERs</strong>, <strong>resource misallocation</strong>, 
                              <strong>staff burnout</strong>, and <strong>communication gaps</strong> that cause panic. 
                              Existing solutions are too manual and lack predictive power.
                          </p>
                      </section>

                      <section className="space-y-4">
                          <h3 className="text-lg font-bold text-green-600 flex items-center gap-2">
                              <Zap size={20} /> The SurgeSentinel Solution
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                              SurgeSentinel transforms reactive chaos into proactive control:
                          </p>
                          <ul className="list-disc pl-5 space-y-2 text-gray-700">
                              <li><strong>Effortless Data Input:</strong> Front-line staff input daily counts in seconds.</li>
                              <li><strong>Instant AI Analysis:</strong> Google Gemini API analyzes load vs. capacity to assess severity.</li>
                              <li><strong>Multilingual Advisories:</strong> Automatically generates clear public guidance in English, Hindi, Telugu, and Tamil.</li>
                              <li><strong>AI Staffing Recommendations:</strong> Suggests specific resource reallocations (e.g., "Add 2 nurses to ER").</li>
                              <li><strong>Role-Based Dashboards:</strong> Delivers tailored intelligence to Admins, Hospitals, Researchers, and the Public.</li>
                          </ul>
                      </section>

                       <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                          <h3 className="text-md font-bold text-blue-800 mb-2">Why It Matters</h3>
                          <p className="text-sm text-blue-900">
                              By leveraging predictive AI, we empower healthcare providers to prevent burnout, optimize resources, and ensure the public receives accurate, calm information during health crises.
                          </p>
                      </section>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
