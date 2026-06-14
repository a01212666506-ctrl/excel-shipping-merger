import React from 'react';

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

interface ReviewMergeProps {
  validationReport: ValidationReport;
  onDownload: () => void;
  isLoading: boolean;
}

function ReviewMerge({ validationReport, onDownload, isLoading }: ReviewMergeProps) {
  const [expandedSection, setExpandedSection] = React.useState<string | null>('stats');

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">✅ مراجعة النتائج</h2>
        <p className="text-gray-600">قم بمراجعة ملخص الدمج والأخطاء قبل التحميل</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{validationReport.stats.total_rows}</div>
          <div className="text-sm text-gray-600 mt-2">إجمالي الصفوف</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">{validationReport.stats.new_rows}</div>
          <div className="text-sm text-gray-600 mt-2">صفوف جديدة</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600">{validationReport.stats.warning_rows}</div>
          <div className="text-sm text-gray-600 mt-2">تحذيرات</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-600">{validationReport.stats.error_rows}</div>
          <div className="text-sm text-gray-600 mt-2">أخطاء</div>
        </div>
      </div>

      {/* Errors Section */}
      {validationReport.errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'errors' ? null : 'errors')}
            className="w-full px-6 py-4 bg-red-100 text-red-800 font-semibold flex justify-between items-center hover:bg-red-200 transition"
          >
            <span>❌ الأخطاء ({validationReport.errors.length})</span>
            <span>{expandedSection === 'errors' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'errors' && (
            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {validationReport.errors.map((error, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border border-red-200">
                    <div className="font-semibold text-red-700">السطر {error.row} - {error.waybill}</div>
                    <div className="text-sm text-red-600 mt-1">{error.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warnings Section */}
      {validationReport.warnings.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setExpandedSection(expandedSection === 'warnings' ? null : 'warnings')}
            className="w-full px-6 py-4 bg-yellow-100 text-yellow-800 font-semibold flex justify-between items-center hover:bg-yellow-200 transition"
          >
            <span>⚠️ التحذيرات ({validationReport.warnings.length})</span>
            <span>{expandedSection === 'warnings' ? '▼' : '▶'}</span>
          </button>
          {expandedSection === 'warnings' && (
            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {validationReport.warnings.map((warning, idx) => (
                  <div key={idx} className="bg-white p-3 rounded border border-yellow-200">
                    <div className="font-semibold text-yellow-700">السطر {warning.row} - {warning.waybill}</div>
                    <div className="text-sm text-yellow-600 mt-1">{warning.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">📊 ملخص الدمج</h3>
        <div className="text-sm text-green-700 space-y-2">
          <p>✓ تم معالجة {validationReport.stats.total_rows} صفوف بنجاح</p>
          <p>✓ {validationReport.stats.error_rows === 0 ? 'لا توجد أخطاء' : `${validationReport.stats.error_rows} صفوف تحتوي على أخطاء`}</p>
          <p>✓ {validationReport.stats.warning_rows === 0 ? 'لا توجد تحذيرات' : `${validationReport.stats.warning_rows} تحذيرات`}</p>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <button
          onClick={onDownload}
          disabled={isLoading}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 px-12 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحميل...' : '⬇️ تحميل ملف Excel النهائي'}
        </button>
      </div>
    </div>
  );
}

export default ReviewMerge;
