import { useUIPreferencesStore } from '../uiPreferencesStore';
import { useSidebarStore } from '../sidebarStore';

describe('useUIPreferencesStore', () => {
  beforeEach(() => {
    useUIPreferencesStore.setState({
      productsViewMode: 'list',
      categoriesViewMode: 'list',
    });
  });

  it('initializes with list view mode for products', () => {
    expect(useUIPreferencesStore.getState().productsViewMode).toBe('list');
  });

  it('initializes with list view mode for categories', () => {
    expect(useUIPreferencesStore.getState().categoriesViewMode).toBe('list');
  });

  it('setProductsViewMode updates products view mode', () => {
    useUIPreferencesStore.getState().setProductsViewMode('grid');
    expect(useUIPreferencesStore.getState().productsViewMode).toBe('grid');
  });

  it('setCategoriesViewMode updates categories view mode', () => {
    useUIPreferencesStore.getState().setCategoriesViewMode('grid');
    expect(useUIPreferencesStore.getState().categoriesViewMode).toBe('grid');
  });

  it('setProductsViewMode does not affect categories', () => {
    useUIPreferencesStore.getState().setProductsViewMode('grid');
    expect(useUIPreferencesStore.getState().categoriesViewMode).toBe('list');
  });

  it('setCategoriesViewMode does not affect products', () => {
    useUIPreferencesStore.getState().setCategoriesViewMode('grid');
    expect(useUIPreferencesStore.getState().productsViewMode).toBe('list');
  });
});

describe('useSidebarStore', () => {
  beforeEach(() => {
    useSidebarStore.setState({ isCollapsed: false });
  });

  it('initializes with sidebar expanded', () => {
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });

  it('toggleSidebar collapses when expanded', () => {
    useSidebarStore.getState().toggleSidebar();
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
  });

  it('toggleSidebar expands when collapsed', () => {
    useSidebarStore.setState({ isCollapsed: true });
    useSidebarStore.getState().toggleSidebar();
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });

  it('collapseSidebar sets isCollapsed to true', () => {
    useSidebarStore.getState().collapseSidebar();
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
  });

  it('expandSidebar sets isCollapsed to false', () => {
    useSidebarStore.setState({ isCollapsed: true });
    useSidebarStore.getState().expandSidebar();
    expect(useSidebarStore.getState().isCollapsed).toBe(false);
  });

  it('collapseSidebar is idempotent', () => {
    useSidebarStore.getState().collapseSidebar();
    useSidebarStore.getState().collapseSidebar();
    expect(useSidebarStore.getState().isCollapsed).toBe(true);
  });
});
