import React from 'react';

interface ValidationReport {
  stats: any;
  errors: Array<any>;
  warnings: Array<any>;
}

interface ErrorReportProps {
  report: ValidationReport;
}

function ErrorReport({ report }: ErrorReportProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">📋 تقرير الأخطاء</h2>

      {/* Error Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{report.errors.length}</div>
          <div className="text-sm text-gray-600">أخطاء</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{report.warnings.length}</div>
          <div className="text-sm text-gray-600">تحذيرات</div>
        </div>
      </div>

      {/* Errors List */}
      {report.errors.length > 0 && (
        <div className="bg-red-50 rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">الأخطاء المكتشفة</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {report.errors.map((error: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded text-sm">
                <span className="font-semibold text-red-600">السطر {error.row}:</span>
                <span className="text-gray-700 ml-2">{error.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings List */}
      {report.warnings.length > 0 && (
        <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">التحذيرات</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {report.warnings.map((warning: any, idx: number) => (
              <div key={idx} className="bg-white p-3 rounded text-sm">
                <span className="font-semibold text-yellow-600">السطر {warning.row}:</span>
                <span className="text-gray-700 ml-2">{warning.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ErrorReport;
