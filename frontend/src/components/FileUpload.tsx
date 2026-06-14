import React, { useRef } from 'react';

interface FileUploadProps {
  onUpload: (customerFile: File, systemFile: File) => void;
  isLoading: boolean;
}

function FileUpload({ onUpload, isLoading }: FileUploadProps) {
  const [customerFile, setCustomerFile] = React.useState<File | null>(null);
  const [systemFile, setSystemFile] = React.useState<File | null>(null);
  const customerRef = useRef<HTMLInputElement>(null);
  const systemRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerFile && systemFile) {
      onUpload(customerFile, systemFile);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">📤 رفع الملفات</h2>
        <p className="text-gray-600">اختر ملف بيانات العميل وملف نظام الشحن</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Customer File Upload */}
          <div
            className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50 hover:bg-blue-100 transition cursor-pointer"
            onClick={() => customerRef.current?.click()}
          >
            <input
              ref={customerRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setCustomerFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ملف العميل</h3>
            <p className="text-gray-600 mb-4">بيانات الشحن من العميل</p>
            {customerFile ? (
              <p className="text-green-600 font-semibold">✓ {customerFile.name}</p>
            ) : (
              <p className="text-gray-500">انقر لاختيار الملف أو اسحبه هنا</p>
            )}
          </div>

          {/* System File Upload */}
          <div
            className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
            onClick={() => systemRef.current?.click()}
          >
            <input
              ref={systemRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setSystemFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            <div className="text-4xl mb-4">⚙️</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">ملف النظام</h3>
            <p className="text-gray-600 mb-4">قالب نظام الشحن</p>
            {systemFile ? (
              <p className="text-green-600 font-semibold">✓ {systemFile.name}</p>
            ) : (
              <p className="text-gray-500">انقر لاختيار الملف أو اسحبه هنا</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={!customerFile || !systemFile || isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-12 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الرفع...' : 'المتابعة إلى الخطوة التالية'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
