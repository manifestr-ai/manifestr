import React, { useState, useEffect, useRef } from 'react';
import { FileText, Sparkles, Check, X } from 'lucide-react';

export default function FormulaBar({ univerAPI }) {
    const [cellAddress, setCellAddress] = useState('A1');
    const [formulaValue, setFormulaValue] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);

    // List of available formulas
    const availableFormulas = [
        'SUM', 'AVERAGE', 'COUNT', 'MAX', 'MIN', 'IF', 'VLOOKUP', 'HLOOKUP',
        'CONCAT', 'LEFT', 'RIGHT', 'MID', 'LEN', 'UPPER', 'LOWER', 'TRIM',
        'CUSTOMSUM', 'CUSTOM_ASYNC_OBJECT', 'CUSTOM_ASYNC_ARRAY',
        'AND', 'OR', 'NOT', 'TODAY', 'NOW', 'DATE', 'TIME',
    ];

    // Update cell address and formula when selection changes
    useEffect(() => {
        if (!univerAPI) return;

        const updateFormulaBar = () => {
            // Don't update if user is actively editing
            if (isEditing) return;

            try {
                const activeWorkbook = univerAPI.getActiveWorkbook();
                if (!activeWorkbook) return;

                const activeSheet = activeWorkbook.getActiveSheet();
                if (!activeSheet) return;

                const selection = activeSheet.getSelection();
                const range = selection?.getActiveRange();
                if (!range) return;

                // Get cell address
                const startRow = range.getRange().startRow;
                const startColumn = range.getRange().startColumn;
                const address = columnToLetter(startColumn) + (startRow + 1);
                setCellAddress(address);

                // Get cell value/formula
                const cellData = activeSheet.getRange(startRow, startColumn, 1, 1).getValue();
                const cellFormula = activeSheet.getRange(startRow, startColumn, 1, 1).getFormula();

                if (cellFormula) {
                    setFormulaValue('=' + cellFormula);
                } else {
                    setFormulaValue(cellData?.toString() || '');
                }
            } catch (error) {
            }
        };

        // Listen for selection changes (only when not editing)
        const interval = setInterval(updateFormulaBar, 200);

        return () => clearInterval(interval);
    }, [univerAPI, isEditing]);

    // Handle formula input changes
    const handleInputChange = (e) => {
        const value = e.target.value;
        setFormulaValue(value);

        // Show suggestions if typing a formula
        if (value.startsWith('=')) {
            const lastWord = value.split(/[(),\s+\-*/]/).pop().toUpperCase();
            if (lastWord.length > 0) {
                const filtered = availableFormulas.filter(f =>
                    f.startsWith(lastWord) && f !== lastWord
                );
                setSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
            } else {
                setShowSuggestions(false);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    // Apply formula to cell
    const applyFormula = () => {
        if (!univerAPI) return;

        try {
            const activeWorkbook = univerAPI.getActiveWorkbook();
            if (!activeWorkbook) return;

            const activeSheet = activeWorkbook.getActiveSheet();
            if (!activeSheet) return;

            const selection = activeSheet.getSelection();
            const range = selection?.getActiveRange();
            if (!range) return;

            const startRow = range.getRange().startRow;
            const startColumn = range.getRange().startColumn;

            if (formulaValue.startsWith('=')) {
                // Set formula
                activeSheet.getRange(startRow, startColumn, 1, 1).setFormula(formulaValue.substring(1));
            } else {
                // Set value
                activeSheet.getRange(startRow, startColumn, 1, 1).setValue(formulaValue);
            }

            setIsEditing(false);
            inputRef.current?.blur();
        } catch (error) {
        }
    };

    // Cancel editing
    const cancelEdit = () => {
        setIsEditing(false);
        // Reset to original value
        if (univerAPI) {
            const activeWorkbook = univerAPI.getActiveWorkbook();
            const activeSheet = activeWorkbook?.getActiveSheet();
            const selection = activeSheet?.getSelection();
            const range = selection?.getActiveRange();

            if (range) {
                const startRow = range.getRange().startRow;
                const startColumn = range.getRange().startColumn;
                const cellFormula = activeSheet.getRange(startRow, startColumn, 1, 1).getFormula();
                const cellData = activeSheet.getRange(startRow, startColumn, 1, 1).getValue();

                if (cellFormula) {
                    setFormulaValue('=' + cellFormula);
                } else {
                    setFormulaValue(cellData?.toString() || '');
                }
            }
        }
        setShowSuggestions(false);
    };

    // Handle Enter key
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyFormula();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    };

    // Insert suggestion
    const insertSuggestion = (formula) => {
        const parts = formulaValue.split(/([(),\s+\-*/])/);
        parts[parts.length - 1] = formula;
        const newValue = parts.join('') + '(';
        setFormulaValue(newValue);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex flex-col bg-white border-b border-gray-200">
            {/* Secondary Header / Toolbar Actions */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700">
                    <FileText size={14} />
                    Browse Vault
                </button>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700">
                    <Sparkles size={14} />
                    Insert Theme
                </button>
            </div>

            {/* Formula Input Area */}
            <div className="flex items-center px-4 py-2 gap-2 relative">
                <div className="flex items-center justify-center w-10 h-8 bg-gray-100 rounded border border-gray-200 text-sm font-medium text-gray-700">
                    {cellAddress}
                </div>
                <div className="flex items-center gap-1 px-2 border-r border-gray-200 pr-3">
                    <button
                        onClick={applyFormula}
                        className="p-1 hover:bg-gray-100 rounded text-green-600"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={cancelEdit}
                        className="p-1 hover:bg-gray-100 rounded text-red-500"
                    >
                        <X size={16} />
                    </button>
                </div>
                <div className="flex-grow relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={formulaValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={() => setIsEditing(true)}
                        placeholder="Enter value or formula (e.g., =SUM(A1:A10))"
                        className="w-full h-8 px-3 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                    />

                    {/* Formula Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                            {suggestions.map((formula, index) => (
                                <div
                                    key={index}
                                    onClick={() => insertSuggestion(formula)}
                                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm font-mono text-gray-700 hover:text-blue-600 border-b border-gray-100 last:border-b-0"
                                >
                                    {formula}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper function to convert column index to letter
function columnToLetter(column) {
    let temp;
    let letter = '';
    while (column >= 0) {
        temp = column % 26;
        letter = String.fromCharCode(temp + 65) + letter;
        column = Math.floor(column / 26) - 1;
    }
    return letter;
}
