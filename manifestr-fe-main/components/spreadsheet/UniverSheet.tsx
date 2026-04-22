import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { UniverSheetsCorePreset } from '@univerjs/preset-sheets-core';
import sheetsCoreEnUS from '@univerjs/preset-sheets-core/locales/en-US';
import { createUniver, LocaleType, mergeLocales } from '@univerjs/presets';
import { FUNCTION_LIST_USER, functionEnUS, functionUser } from './custom-function';
import { WORKBOOK_DATA } from './data';

import '@univerjs/preset-sheets-core/lib/index.css';

interface UniverSheetProps {
    onAPIReady?: (univerAPI: any) => void;
    data?: any;
}

const UniverSheet = forwardRef<any, UniverSheetProps>(({ onAPIReady, data }, ref) => {
    const containerRef = useRef(null);
    const univerAPIRef = useRef(null);

    useImperativeHandle(ref, () => ({
        getAPI: () => univerAPIRef.current,
    }));

    useEffect(() => {
        if (!containerRef.current) return;

        const { univerAPI } = createUniver({
            locale: LocaleType.EN_US,
            locales: {
                [LocaleType.EN_US]: mergeLocales(
                    sheetsCoreEnUS,
                    functionEnUS,
                ),
            },
            presets: [
                UniverSheetsCorePreset({
                    container: containerRef.current,
                    header: true,
                    footer: {
                        menus: true,
                        sheetBar: true,
                        statisticBar: true,
                        zoomSlider: false
                    },
                    formula: {
                        function: functionUser,
                        description: FUNCTION_LIST_USER,
                    },
                }),
            ],
        });

        univerAPIRef.current = univerAPI;

      let workbookData = data || WORKBOOK_DATA;

      // LOG WHAT WE RECEIVED
      console.log('📊 Received workbook data:', {
        hasData: !!data,
        dataType: typeof data,
        dataKeys: data ? Object.keys(data) : [],
        hasSheets: data?.sheets ? Object.keys(data.sheets).length : 0,
        sheetOrder: data?.sheetOrder
      });

      // Validation logic
      const isValid = workbookData &&
          (typeof workbookData === 'object') &&
          (Object.keys(workbookData).length > 0) &&
          (workbookData.sheets || workbookData.sheetOrder);

      if (!isValid) {
          console.warn('⚠️ Invalid workbook data, using fallback');
          workbookData = WORKBOOK_DATA;
      }


        // Sanitization: Ensure strict consistency between sheetOrder and sheets
        if (workbookData && workbookData.sheets) {
            const sheetKeys = Object.keys(workbookData.sheets);

            // If sheetOrder is missing or invalid, generate it from keys
            if (!workbookData.sheetOrder || !Array.isArray(workbookData.sheetOrder)) {
                workbookData.sheetOrder = sheetKeys;
            } else {
                // Filter order to only include valid existing sheets
                const validOrder = workbookData.sheetOrder.filter(id => sheetKeys.includes(id));

                // If mismatch found (e.g. validOrder is empty but we have sheets), fix it
                if (validOrder.length === 0 && sheetKeys.length > 0) {
                    workbookData.sheetOrder = sheetKeys;
                } else {
                    workbookData.sheetOrder = validOrder;
                }
            }

            // Ensure at least one sheet exists
            if (workbookData.sheetOrder.length === 0) {
                workbookData = WORKBOOK_DATA;
            }
        }


      try {
        console.log('🚀 Creating Univer workbook...');
        univerAPI.createWorkbook(workbookData);
        console.log('✅ Workbook created successfully');
        
        // WAIT for Univer to fully initialize (API issue - save() not immediately available)
        setTimeout(() => {
          const workbook = univerAPI.getActiveWorkbook();
          if (!workbook) {
            console.error('❌ Workbook creation failed - getActiveWorkbook() returned null');
          } else {
            console.log('✅ Active workbook verified after delay:', {
              id: workbook.getId?.(),
              hasSheets: !!workbook.getSheets,
              hasSaveMethod: typeof workbook.save === 'function'
            });
          }
        }, 500);
      } catch (e) {
        console.error('❌ Failed to create workbook:', e);
        // Try with fallback data
        try {
          console.log('⚠️ Attempting with fallback data...');
          univerAPI.createWorkbook(WORKBOOK_DATA);
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }

        // Notify parent that API is ready
        if (onAPIReady) {
            onAPIReady(univerAPI);
        }

        return () => {
            // Delay disposal slightly to avoid StrictMode double-mount race conditions destroying the wrong instance
            // Or simply dispose immediately if we trust the flow. 
            // The PermissionPoint errors suggest unclean disposal.
            try {
                univerAPI?.dispose();
                univerAPIRef.current = null;
            } catch (cleanupError) {
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full overflow-hidden" />
    );
});

UniverSheet.displayName = 'UniverSheet';

export default UniverSheet;
