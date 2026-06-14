import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './components/FileUpload';
import ColumnMapping from './components/ColumnMapping';
import ReviewMerge from './components/ReviewMerge';
import ErrorReport from './components/ErrorReport';

const API_BASE = 'http://localhost:8000/api';

type Step = 'upload' | 'mapping' | 'review' | 'complete';

interface MappingData {
  sessionId: string;
  customerColumns: string[];
  systemColumns: string[];
  mappings: Record<string, string>;
  customerRows: number;
  systemRows: number;
}

interface ValidationReport {
  stats: {
    total_rows: number;
    new_rows: number;
    updated_rows: number;
    error_rows: number;
    warning_rows: number;
  };
  errors: Array<{
    row: number;
    type: string;
    message: string;
    waybill: string;
  }>;
  warnings: Array<{
    row: number;
    type: string;
    message: string;
    waybill: string;
  }>;
}

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [mappingData, setMappingData] = useState<MappingData | null>(null);
  const [validationReport, setValidationReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesUpload = async (customerFile: File, systemFile: File) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('customer_file', customerFile);
      formData.append('system_file', systemFile);

      const response = await axios.post(`${API_BASE}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMappingData(response.data);
      setCurrentStep('mapping');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'خطأ في رفع الملفات');
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async (mapping: Record<string, string>, fixedValues: Record<string, string>) => {
    try {
      setLoading(true);
      setError(null);

      if (!mappingData) return;

      const response = await axios.post(`${API_BASE}/merge`, {
        session_id: mappingData.sessionId,
        mapping,
        fixed_values: fixedValues,
      });

      setValidationReport(response.data.validation_report);
      setCurrentStep('review');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'خطأ في دمج البيانات');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!mappingData) return;

      const response = await axios.get(`${API_BASE}/download/${mappingData.sessionId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `merged_shipments_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link?.parentNode?.removeChild(link);

      setCurrentStep('complete');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'خطأ في تحميل الملف');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">📦 دمج ملفات الشحن</h1>
          <p className="text-blue-100 mt-2">نظام متخصص لدمج بيانات الشحن من ملفات العملاء مع نظام الشحن</p>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            <strong>❌ خطأ:</strong> {error}
          </div>
        )}

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div className={`flex items-center ${currentStep === 'upload' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">1</div>
              <span className="ml-3 font-semibold">رفع الملفات</span>
            </div>
            <div className={`flex items-center ${currentStep === 'mapping' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">2</div>
              <span className="ml-3 font-semibold">ربط الأعمدة</span>
            </div>
            <div className={`flex items-center ${currentStep === 'review' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">3</div>
              <span className="ml-3 font-semibold">المراجعة</span>
            </div>
            <div className={`flex items-center ${currentStep === 'complete' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">✓</div>
              <span className="ml-3 font-semibold">إكمال</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {currentStep === 'upload' && (
            <FileUpload onUpload={handleFilesUpload} isLoading={loading} />
          )}

          {currentStep === 'mapping' && mappingData && (
            <ColumnMapping
              mappingData={mappingData}
              onMerge={handleMerge}
              isLoading={loading}
            />
          )}

          {currentStep === 'review' && validationReport && (
            <ReviewMerge
              validationReport={validationReport}
              onDownload={handleDownload}
              isLoading={loading}
            />
          )}

          {currentStep === 'complete' && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-600 mb-4">تم بنجاح!</h2>
              <p className="text-gray-600 mb-6">تم تحميل الملف بنجاح. يمكنك الآن البدء بملفات جديدة.</p>
              <button
                onClick={() => {
                  setCurrentStep('upload');
                  setMappingData(null);
                  setValidationReport(null);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg transition"
              >
                دمج ملفات جديدة
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
