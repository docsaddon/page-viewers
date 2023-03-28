import { DocumentRef, DocumentPermission, DocMiniApp } from '@lark-opdev/block-docs-addon-api';
import { useState, useEffect } from 'react';

export function usePermission(docRef: DocumentRef | null) {
  const [permission, setPermission] = useState<DocumentPermission | null>();

  useEffect(() => {
    if (!docRef) {
      return;
    }
    const updatePermission = async () => {
      const permission = await DocMiniApp.Service.Permission.getDocumentPermission(docRef);
      setPermission(permission);
    };

    updatePermission();
    DocMiniApp.Service.Permission.onDocumentPermissionChange(docRef, updatePermission);
    return () => {
      DocMiniApp.Service.Permission.offDocumentPermissionChange(docRef, updatePermission);
    };
  }, [docRef]);
  return permission;
}
