import { BlockSnapshot, BlockType, DocMiniApp, DocumentRef, PageMeta } from '@lark-opdev/block-docs-addon-api';

export enum ALLBlockType {
  FILE = 'file', // 文件
  IMAGE = 'image', // 图片
  MINDNOTE = 'mindnote', // 思维导图
  BITABLE = 'bitable', // 多维表格
  SHEET = 'sheet', // 电子表格
  DIAGRAM = 'diagram' // UML/流程图
}

export type fileOrImgBlockType = ALLBlockType.FILE | ALLBlockType.IMAGE;
export type formBlockType =
  | ALLBlockType.MINDNOTE
  | ALLBlockType.BITABLE
  | ALLBlockType.SHEET
  | ALLBlockType.DIAGRAM;

const fileOrImgBlockList = [ALLBlockType.FILE, ALLBlockType.IMAGE];
const formBlockList = [ALLBlockType.MINDNOTE, ALLBlockType.BITABLE, ALLBlockType.SHEET, ALLBlockType.DIAGRAM];

const isTargetBlock = (blockSnapshot: BlockSnapshot, blockTypeList: ALLBlockType[]) =>
  blockTypeList.some(value => value === blockSnapshot.type);

const ignoreContainerBlock = (type: string) => type === BlockType.CALLOUT || type === BlockType.TABLE;
const getTargetBlockData = (blockSnapshot: BlockSnapshot, blockTypeList: ALLBlockType[]) => {
  const BlockList: BlockSnapshot[] = [];
  const { childSnapshots, type } = blockSnapshot;
  if (ignoreContainerBlock(type)) {
    return BlockList;
  }

  for (const blockChildSnapshot of childSnapshots) {
    if (isTargetBlock(blockChildSnapshot, blockTypeList)) {
      BlockList.push(blockChildSnapshot);
    }
    const itemBlock = getTargetBlockData(blockChildSnapshot, blockTypeList);
    BlockList.push(...itemBlock);
  }
  return BlockList;
};

export const getReadDuration = async (docRef: DocumentRef, meta: PageMeta) => {
  if (!docRef || !meta) {
    return;
  }
  const blockSnapshot = await DocMiniApp.Document.getRootBlock(docRef);
  const fileOrImgList = getTargetBlockData(blockSnapshot, fileOrImgBlockList);
  const formList = getTargetBlockData(blockSnapshot, formBlockList);
  // 计算时间meta.word_count
  return (
    Math.ceil(meta.word_count / 400) + Math.floor((fileOrImgList.length * 5 + formList.length * 20) / 60)
  );
};
