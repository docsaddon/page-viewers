import { DocumentRef, DocMiniApp, DOCS_MODE } from '@lark-opdev/block-docs-addon-api';
import { useState, useEffect } from 'react';
import { usePermission } from './usePermission';

export function useEditable(docRef: DocumentRef | null) {
  const permission = usePermission(docRef);
  const [editable, setEditable] = useState<boolean | null>();

  useEffect(() => {
    if (!docRef) {
      return;
    }
    const updateEditable = async () => {
      const docsMode = await DocMiniApp.Env.DocsMode.getDocsMode().catch(error => {
        console.error('[page-viewers]', error);
      });
      setEditable(docsMode === DOCS_MODE.EDITING);
    };

    updateEditable();
    DocMiniApp.Env.DocsMode.onDocsModeChange(updateEditable).catch(error => {
      console.error('[page-viewers]', error);
    });
    return () => {
      DocMiniApp.Env.DocsMode.offDocsModeChange(updateEditable);
    };
  }, [docRef]);

  return permission?.editable && editable;
}
