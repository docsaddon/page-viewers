import { DocMiniApp, DocumentRef } from '@lark-opdev/block-docs-addon-api';
import { useEffect, useState } from 'react';

export function useDocRef() {
  const [docRef, setDocRef] = useState<DocumentRef | null>(null);

  useEffect(() => {
    DocMiniApp.getActiveDocumentRef()
      .then(docRef => {
        setDocRef(docRef);
      })
      .catch(error => {
        console.error('[page-viewers]', error);
      });
  }, []);
  return docRef;
}
