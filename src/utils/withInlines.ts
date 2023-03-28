import { DOC_DATA_TYPE } from "../constants/type";

export const withInlines = editor => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = element =>
    [
      DOC_DATA_TYPE.WordCount,
      DOC_DATA_TYPE.EstRead,
      DOC_DATA_TYPE.VisitorRank,
      DOC_DATA_TYPE.VisitorCount,
      DOC_DATA_TYPE.VisitorName,
      DOC_DATA_TYPE.Date
    ].includes(element.type)
      ? true
      : isInline(element);

  editor.isVoid = element =>
    [
      DOC_DATA_TYPE.WordCount,
      DOC_DATA_TYPE.EstRead,
      DOC_DATA_TYPE.VisitorRank,
      DOC_DATA_TYPE.VisitorCount,
      DOC_DATA_TYPE.VisitorName,
      DOC_DATA_TYPE.Date
    ].includes(element.type)
      ? true
      : isVoid(element);

  editor.markableVoid = element =>
    [
      DOC_DATA_TYPE.WordCount,
      DOC_DATA_TYPE.EstRead,
      DOC_DATA_TYPE.VisitorRank,
      DOC_DATA_TYPE.VisitorCount,
      DOC_DATA_TYPE.VisitorName,
      DOC_DATA_TYPE.Date
    ].includes(element.type)
      ? true
      : markableVoid(element);
  return editor;
};
