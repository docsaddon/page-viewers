export function formatI18NText(text: string, obj: any) {
  const list = text.split(/[{,}]/);
  const children: { type?: any; children?: { text: any }[]; text?: string }[] = [];
  list.map(item => {
    if (typeof obj[item] !== 'undefined') {
      children.push({ type: item, children: [{ text: '' }] });
    } else {
      children.push({ text: item });
    }
  });
  return [
    {
      children
    }
  ];
}
