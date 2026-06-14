import React, { useState } from 'react';

interface MappingData {
  sessionId: string;
  customerColumns: string[];
  systemColumns: string[];
  mappings: Record<string, string>;
  customerRows: number;
}

interface ColumnMappingProps {
  mappingData: MappingData;
  onMerge: (mapping: Record<string, string>, fixedValues: Record<string, string>) => void;
  isLoading: boolean;
}

function ColumnMapping({ mappingData, onMerge, isLoading }: ColumnMappingProps) {
  const [mappings, setMappings] = useState<Record<string, string>>(mappingData.mappings);
  const [fixedValues, setFixedValues] = useState<Record<string, string>>({
    'كود العميل': '',
  });
  const [showMapping, setShowMapping] = useState(true);

  const handleMappingChange = (systemCol: string, customerCol: string) => {
    setMappings(prev => ({
      ...prev,
      [systemCol]: customerCol
    }));
  };

  const handleFixedValueChange = (key: string, value: string) => {
    setFixedValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMerge(mappings, fixedValues);
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🔗 ربط الأعمدة</h2>
        <p className="text-gray-600">حدد من أي عمود في ملف العميل سيتم نسخ البيانات</p>
        <p className="text-sm text-gray-500 mt-2">عدد الصفوف المراد معالجتها: {mappingData.customerRows}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Fixed Values Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">⚙️ القيم الثابتة</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">كود العميل</label>
              <input
                type="text"
                value={fixedValues['كود العميل']}
                onChange={(e) => handleFixedValueChange('كود العميل', e.target.value)}
                placeholder="أدخل كود العميل (سيطبق على جميع الصفوف)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Column Mapping Section */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🔄 ربط أعمدة النظام</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mappingData.systemColumns.map((systemCol) => (
              <div key={systemCol} className="flex items-center gap-4">
                <label className="w-40 text-sm font-medium text-gray-700 flex-shrink-0">
                  {systemCol}
                </label>
                <select
                  value={mappings[systemCol] || ''}
                  onChange={(e) => handleMappingChange(systemCol, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- لم يتم تحديد --</option>
                  {mappingData.customerColumns.map((custCol) => (
                    <option key={custCol} value={custCol}>
                      {custCol}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4 justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-12 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري المعالجة...' : 'دمج البيانات'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ColumnMapping;
