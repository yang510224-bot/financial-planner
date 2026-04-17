"use client";

import { useState } from 'react';
import Step1BasicInfo from './Step1BasicInfo';
import Step2Assets from './Step2Assets';
import Step3Liabilities from './Step3Liabilities';
import Step4Income from './Step4Income';
import Step5Expenses from './Step5Expenses';
import Dashboard from './Dashboard';
import Step7FuturePlanning from './Step7FuturePlanning';

const initialData = {
  name: "",
  birthDate: "",
  gender: "",
  assets: {
    cash: "",
    savings: { amount: "", date: "" },
    properties: [],
    vehicles: [],
    insurance: { hasInsurance: false, amount: "", date: "" },
    investments: { hasInvestments: false, amount: "", date: "" },
    otherAssets: { hasOtherAssets: false, amount: "", description: "", date: "" }
  },
  liabilities: {
    personalLoans: [],
    creditCards: [],
    other: []
  },
  income: {
    active: "",
    passive: ""
  },
  expenses: {
    living: ""
  }
};

export default function CashFlowPlanner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState(initialData);

  const updateData = (section, field, value) => {
    if (section) {
      setData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const steps = [
    "基本資訊",
    "資產清單",
    "負債清單",
    "月收入",
    "月支出",
    "現況儀表板",
    "未來規劃"
  ];

  return (
    <div className="container fade-in">
      <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>現金流規劃機</h1>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', padding: '0 10px' }}>
        {steps.map((label, index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <div key={stepNum} style={{ textAlign: 'center', flex: 1 }}>
              <div 
                style={{ 
                  width: '30px', height: '30px', borderRadius: '50%', 
                  background: isActive ? 'var(--primary-color)' : isCompleted ? 'var(--success-color)' : 'var(--border-color)',
                  color: isActive || isCompleted ? '#fff' : 'var(--text-color)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  margin: '0 auto 8px auto', fontWeight: 'bold'
                }}
              >
                {isCompleted ? '✓' : stepNum}
              </div>
              <div style={{ fontSize: '12px', color: isActive ? 'var(--primary-dark)' : 'var(--aux-color)', fontWeight: isActive ? 'bold' : 'normal' }}>
                {label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="card">
        {currentStep === 1 && <Step1BasicInfo data={data} updateData={updateData} />}
        {currentStep === 2 && <Step2Assets data={data.assets} updateData={(field, val) => updateData('assets', field, val)} />}
        {currentStep === 3 && <Step3Liabilities data={data.liabilities} updateData={(field, val) => updateData('liabilities', field, val)} />}
        {currentStep === 4 && <Step4Income data={data.income} updateData={(field, val) => updateData('income', field, val)} />}
        {currentStep === 5 && <Step5Expenses data={data.expenses} liabilities={data.liabilities} assets={data.assets} updateData={(field, val) => updateData('expenses', field, val)} />}
        {currentStep === 6 && <Dashboard data={data} startSimulation={() => setCurrentStep(7)} />}
        {currentStep === 7 && <Step7FuturePlanning data={data} />}
      </div>

      <div className="flex justify-between" style={{ marginTop: '24px' }}>
        {currentStep > 1 && (
          <button className="btn btn-secondary" onClick={prevStep}>
            上一步
          </button>
        )}
        <div style={{ flex: 1 }}></div>
        {currentStep < 7 && currentStep !== 6 && (
          <button className="btn" onClick={nextStep}>
            下一步
          </button>
        )}
      </div>
    </div>
  );
}
