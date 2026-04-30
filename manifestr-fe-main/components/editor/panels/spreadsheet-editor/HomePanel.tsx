import React, { useState } from "react";

interface HomePanelProps {
  store: any; // Univer FacadeAPI
}

export default function HomePanel({ store }: HomePanelProps) {
  const [showTemplates, setShowTemplates] = useState(false);

  if (!store) return null;

  // Helper to get active sheet and range
  const getSheetAndRange = () => {
    try {
      const workbook = store.getActiveWorkbook();
      if (!workbook) return null;
      
      const sheet = workbook.getActiveSheet();
      if (!sheet) return null;
      
      return { workbook, sheet };
    } catch (error) {
      console.error("Failed to get sheet:", error);
      return null;
    }
  };

  // Format handlers - BULLETPROOF implementations
  const handleBold = () => {
    try {
      const info = getSheetAndRange();
      if (!info) {
        console.warn('⚠️ Please select cells first');
        return;
      }

      const { sheet } = info;
      const range = sheet.getActiveRange();
      
      if (!range) {
        console.warn('⚠️ No cells selected');
        return;
      }

      // Try multiple methods
      try {
        range.setFontWeight('bold');
        console.log('✅ Applied bold formatting via setFontWeight');
      } catch (e1) {
        try {
          store.executeCommand('sheet.command.set-range-bold');
          console.log('✅ Applied bold formatting via command');
        } catch (e2) {
          // Fallback: set via style
          const startRow = range.getStartRow();
          const startCol = range.getStartColumn();
          const numRows = range.getNumRows();
          const numCols = range.getNumColumns();
          
          for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
              const cell = sheet.getRange(startRow + r, startCol + c, 1, 1);
              cell.setFontWeight('bold');
            }
          }
          console.log('✅ Applied bold formatting via fallback');
        }
      }
    } catch (error) {
      console.error('❌ Bold failed:', error);
    }
  };

  const handleItalic = () => {
    try {
      const info = getSheetAndRange();
      if (!info) {
        console.warn('⚠️ Please select cells first');
        return;
      }

      const { sheet } = info;
      const range = sheet.getActiveRange();
      
      if (!range) {
        console.warn('⚠️ No cells selected');
        return;
      }

      // Try multiple methods
      try {
        range.setFontStyle('italic');
        console.log('✅ Applied italic formatting via setFontStyle');
      } catch (e1) {
        try {
          store.executeCommand('sheet.command.set-range-italic');
          console.log('✅ Applied italic formatting via command');
        } catch (e2) {
          // Fallback
          const startRow = range.getStartRow();
          const startCol = range.getStartColumn();
          const numRows = range.getNumRows();
          const numCols = range.getNumColumns();
          
          for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
              const cell = sheet.getRange(startRow + r, startCol + c, 1, 1);
              cell.setFontStyle('italic');
            }
          }
          console.log('✅ Applied italic formatting via fallback');
        }
      }
    } catch (error) {
      console.error('❌ Italic failed:', error);
    }
  };

  const handleUnderline = () => {
    try {
      const info = getSheetAndRange();
      if (!info) {
        console.warn('⚠️ Please select cells first');
        return;
      }

      const { sheet } = info;
      const range = sheet.getActiveRange();
      
      if (!range) {
        console.warn('⚠️ No cells selected');
        return;
      }

      // Try multiple methods
      try {
        range.setFontLine('underline');
        console.log('✅ Applied underline via setFontLine');
      } catch (e1) {
        try {
          store.executeCommand('sheet.command.set-range-underline');
          console.log('✅ Applied underline via command');
        } catch (e2) {
          // Fallback
          const startRow = range.getStartRow();
          const startCol = range.getStartColumn();
          const numRows = range.getNumRows();
          const numCols = range.getNumColumns();
          
          for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
              const cell = sheet.getRange(startRow + r, startCol + c, 1, 1);
              cell.setFontLine('underline');
            }
          }
          console.log('✅ Applied underline via fallback');
        }
      }
    } catch (error) {
      console.error('❌ Underline failed:', error);
    }
  };

  const handleAlignLeft = () => {
    try {
      // Use the correct command ID
      store.executeCommand('sheet.command.set-horizontal-text-align', {
        value: 1 // 1 = left, 2 = center, 3 = right
      });
      console.log('✅ Aligned left');
    } catch (error) {
      console.error('❌ Align left failed:', error);
    }
  };

  const handleAlignCenter = () => {
    try {
      store.executeCommand('sheet.command.set-horizontal-text-align', {
        value: 2 // 2 = center
      });
      console.log('✅ Aligned center');
    } catch (error) {
      console.error('❌ Align center failed:', error);
    }
  };

  const handleAlignRight = () => {
    try {
      store.executeCommand('sheet.command.set-horizontal-text-align', {
        value: 3 // 3 = right
      });
      console.log('✅ Aligned right');
    } catch (error) {
      console.error('❌ Align right failed:', error);
    }
  };

  const handleTemplates = () => {
    setShowTemplates(true);
  };

  const applyTemplate = (templateType: string) => {
    try {
      const info = getSheetAndRange();
      if (!info) return;

      const { sheet } = info;
      
      switch (templateType) {
        case 'budget':
          createBudgetTemplate(sheet);
          break;
        case 'invoice':
          createInvoiceTemplate(sheet);
          break;
        case 'expenses':
          createExpensesTemplate(sheet);
          break;
        case 'schedule':
          createScheduleTemplate(sheet);
          break;
        case 'inventory':
          createInventoryTemplate(sheet);
          break;
        case 'sales':
          createSalesTemplate(sheet);
          break;
        default:
          break;
      }
      
      setShowTemplates(false);
      console.log('✅ Applied template:', templateType);
    } catch (error) {
      console.error('❌ Template failed:', error);
    }
  };

  // Template creators
  const createBudgetTemplate = (sheet: any) => {
    const headers = ['Category', 'Budgeted', 'Actual', 'Difference', '% Used'];
    const categories = ['Housing', 'Transportation', 'Food', 'Utilities', 'Entertainment', 'Healthcare', 'Savings'];
    
    // Headers
    for (let c = 0; c < headers.length; c++) {
      const cell = sheet.getRange(0, c, 1, 1);
      cell.setValue(headers[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#4F46E5');
      cell.setFontColor('#FFFFFF');
    }
    
    // Categories
    for (let r = 0; r < categories.length; r++) {
      sheet.getRange(r + 1, 0, 1, 1).setValue(categories[r]);
      sheet.getRange(r + 1, 1, 1, 1).setValue(0);
      sheet.getRange(r + 1, 2, 1, 1).setValue(0);
      if (r % 2 === 0) {
        for (let c = 0; c < 5; c++) {
          sheet.getRange(r + 1, c, 1, 1).setBackground('#F3F4F6');
        }
      }
    }
  };

  const createInvoiceTemplate = (sheet: any) => {
    sheet.getRange(0, 0, 1, 1).setValue('INVOICE');
    sheet.getRange(0, 0, 1, 1).setFontWeight('bold');
    sheet.getRange(0, 0, 1, 1).setFontSize(20);
    
    sheet.getRange(2, 0, 1, 1).setValue('Bill To:');
    sheet.getRange(3, 0, 1, 1).setValue('Company Name');
    
    const headers = ['Item', 'Quantity', 'Price', 'Total'];
    for (let c = 0; c < headers.length; c++) {
      const cell = sheet.getRange(5, c, 1, 1);
      cell.setValue(headers[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#3B82F6');
      cell.setFontColor('#FFFFFF');
    }
    
    sheet.getRange(11, 2, 1, 1).setValue('Subtotal:');
    sheet.getRange(12, 2, 1, 1).setValue('Tax:');
    sheet.getRange(13, 2, 1, 1).setValue('TOTAL:');
    sheet.getRange(13, 2, 1, 1).setFontWeight('bold');
  };

  const createExpensesTemplate = (sheet: any) => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Payment Method'];
    for (let c = 0; c < headers.length; c++) {
      const cell = sheet.getRange(0, c, 1, 1);
      cell.setValue(headers[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#10B981');
      cell.setFontColor('#FFFFFF');
    }
  };

  const createScheduleTemplate = (sheet: any) => {
    const days = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    for (let c = 0; c < days.length; c++) {
      const cell = sheet.getRange(0, c, 1, 1);
      cell.setValue(days[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#8B5CF6');
      cell.setFontColor('#FFFFFF');
    }
    
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];
    for (let r = 0; r < times.length; r++) {
      sheet.getRange(r + 1, 0, 1, 1).setValue(times[r]);
    }
  };

  const createInventoryTemplate = (sheet: any) => {
    const headers = ['Item ID', 'Item Name', 'Category', 'Quantity', 'Unit Price', 'Total Value', 'Reorder Level'];
    for (let c = 0; c < headers.length; c++) {
      const cell = sheet.getRange(0, c, 1, 1);
      cell.setValue(headers[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#F59E0B');
      cell.setFontColor('#FFFFFF');
    }
  };

  const createSalesTemplate = (sheet: any) => {
    const headers = ['Date', 'Product', 'Customer', 'Quantity', 'Unit Price', 'Total', 'Status'];
    for (let c = 0; c < headers.length; c++) {
      const cell = sheet.getRange(0, c, 1, 1);
      cell.setValue(headers[c]);
      cell.setFontWeight('bold');
      cell.setBackground('#EF4444');
      cell.setFontColor('#FFFFFF');
    }
  };

  return (
    <>
    <div className="h-[102px] bg-white border-b flex items-center px-6 gap-4 overflow-x-auto">
      <div className="flex flex-col items-center  min-w-[100px]">
        <span className="text-xs text-gray-500 mb-3">File</span>
        <div className="flex flex-row items-center gap-[34px]">
          <button
            onClick={handleTemplates}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M10.0013 1.33594H4.0013C3.64768 1.33594 3.30854 1.47641 3.05849 1.72646C2.80844 1.97651 2.66797 2.31565 2.66797 2.66927V13.3359C2.66797 13.6896 2.80844 14.0287 3.05849 14.2787C3.30854 14.5288 3.64768 14.6693 4.0013 14.6693H12.0013C12.3549 14.6693 12.6941 14.5288 12.9441 14.2787C13.1942 14.0287 13.3346 13.6896 13.3346 13.3359V4.66927L10.0013 1.33594Z"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9.33203 1.33594V4.0026C9.33203 4.35623 9.47251 4.69536 9.72256 4.94541C9.9726 5.19546 10.3117 5.33594 10.6654 5.33594H13.332"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M6.66536 6H5.33203"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.6654 8.66406H5.33203"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M10.6654 11.3359H5.33203"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Templates
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Font */}
      <div className="flex flex-col items-center min-w-[210px]">
        <span className="text-xs text-gray-500 mb-3">Font</span>
        <div className="flex flex-row items-center gap-[34px]">
          {/* Bold */}
          <button
            onClick={handleBold}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
          >
            <span className="text-[18px] font-bold text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 7.9974H10C10.7072 7.9974 11.3855 8.27835 11.8856 8.77844C12.3857 9.27854 12.6667 9.95682 12.6667 10.6641C12.6667 11.3713 12.3857 12.0496 11.8856 12.5497C11.3855 13.0498 10.7072 13.3307 10 13.3307H4.66667C4.48986 13.3307 4.32029 13.2605 4.19526 13.1355C4.07024 13.0104 4 12.8409 4 12.6641V3.33073C4 3.15392 4.07024 2.98435 4.19526 2.85932C4.32029 2.7343 4.48986 2.66406 4.66667 2.66406H9.33333C10.0406 2.66406 10.7189 2.94501 11.219 3.44511C11.719 3.94521 12 4.62349 12 5.33073C12 6.03797 11.719 6.71625 11.219 7.21635C10.7189 7.71644 10.0406 7.9974 9.33333 7.9974"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
              Bold
            </span>
          </button>

          {/* Italic */}
          <button
            onClick={handleItalic}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
          >
            <span className="text-[18px] italic text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12.668 2.66406H6.66797"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9.33203 13.3359H3.33203"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 2.66406L6 13.3307"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Italic
            </span>
          </button>

          {/* Underline */}
          <button
            onClick={handleUnderline}
            className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0]"
          >
            <span className="text-[18px] underline text-[#2B2F38] leading-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 2.66406V6.66406C4 7.72493 4.42143 8.74234 5.17157 9.49249C5.92172 10.2426 6.93913 10.6641 8 10.6641C9.06087 10.6641 10.0783 10.2426 10.8284 9.49249C11.5786 8.74234 12 7.72493 12 6.66406V2.66406"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66797 13.3359H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1 ">
              Underline
            </span>
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-[50px] bg-[#E3E4EA]" />

      {/* Alignment */}
      <div className="flex gap-4 items-center min-w-[210px]">
        <div className="flex flex-col items-center">
          <span className="text-xs text-gray-500 mb-3">Alignment</span>
          <div className="flex flex-row items-center gap-[34px]">
            {/* Left Align */}
            <button
              onClick={handleAlignLeft}
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2.66797 3.33594H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66797 8H10.668"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66797 12.6641H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
                Left
              </span>
            </button>

            {/* Center Align */}
            <button
              onClick={handleAlignCenter}
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2.66797 3.33594H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.66797 8H11.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66797 12.6641H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
                Center
              </span>
            </button>

            {/* Right Align */}
            <button
              onClick={handleAlignRight}
              className="flex flex-col items-center justify-center w-[44px]  rounded-md transition bg-transparent hover:bg-[#E9EBF0] py-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M2.66797 3.33594H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33203 8H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.66797 12.6641H13.3346"
                  stroke="#364153"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[#4A5565] font-inter text-[9px] not-italic font-normal leading-[11.25px] tracking-[0.167px] mt-1">
                Right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    {/* Templates Modal */}
    {showTemplates && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowTemplates(false)}>
        <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto shadow-xl" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Choose a Template</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Budget Template */}
            <button
              onClick={() => applyTemplate('budget')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Budget Planner</h4>
              <p className="text-sm text-gray-500 text-center">Track income and expenses</p>
            </button>

            {/* Invoice Template */}
            <button
              onClick={() => applyTemplate('invoice')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">🧾</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Invoice</h4>
              <p className="text-sm text-gray-500 text-center">Professional billing document</p>
            </button>

            {/* Expenses Template */}
            <button
              onClick={() => applyTemplate('expenses')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📊</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Expense Tracker</h4>
              <p className="text-sm text-gray-500 text-center">Log daily expenses</p>
            </button>

            {/* Schedule Template */}
            <button
              onClick={() => applyTemplate('schedule')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📅</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Weekly Schedule</h4>
              <p className="text-sm text-gray-500 text-center">Plan your week</p>
            </button>

            {/* Inventory Template */}
            <button
              onClick={() => applyTemplate('inventory')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📦</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Inventory</h4>
              <p className="text-sm text-gray-500 text-center">Track stock levels</p>
            </button>

            {/* Sales Template */}
            <button
              onClick={() => applyTemplate('sales')}
              className="flex flex-col items-center p-6 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="font-semibold text-lg mb-1">Sales Tracker</h4>
              <p className="text-sm text-gray-500 text-center">Monitor sales data</p>
            </button>
          </div>

          <button
            onClick={() => setShowTemplates(false)}
            className="mt-6 w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    )}
    </>
  );
}
