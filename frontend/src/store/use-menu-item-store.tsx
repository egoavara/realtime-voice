import { create } from 'zustand';

export type MenuInfo = {
  id: string; // 화면번호
  title: string; // 메뉴명
  icon?: React.ReactNode; // 메뉴 아이콘
  href?: string; // 링크
  submenu?: MenuInfo[]; // 하위 메뉴
};

type MenuItemStore = {
  items: MenuInfo[];
  setMenuItems: (items: MenuInfo[]) => void;
};

export const useMenuItemStore = create<MenuItemStore>((set, get) => {
  return {
    items: [],
    setMenuItems: (items) => set({ items }),
  };
});
