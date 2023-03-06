type FuncType = (element: HTMLElement, id?: string) => void;

export const cursorElement: FuncType = (cursor, id = '') => {
  cursor.id = id;
  cursor.style.position = 'fixed';
  cursor.style.width = '15px';
  cursor.style.height = '15px';
  cursor.style.backgroundColor = '#fff';
  cursor.style.borderRadius = '50%';
  cursor.style.zIndex = '100';
};
