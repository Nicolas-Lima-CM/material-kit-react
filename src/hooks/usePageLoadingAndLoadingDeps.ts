import { useMemo } from "react";

// Get Is Page Loading, showLoadingTab And Loading dependencies
const usePageLoading = (dependencies: boolean[]) => {
  const loadingDeps = dependencies;
  const isPageLoading = () => dependencies.some((dependencie: boolean) => !!dependencie);

  // Show Loading Tab
  const showLoadingTab = useMemo(() => isPageLoading(), loadingDeps);

  return { loadingDeps, isPageLoading, showLoadingTab };
};

export default usePageLoading;
