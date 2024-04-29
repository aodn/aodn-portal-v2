const debounce = (func: (...args: any[]) => void, milliSecond: number) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, milliSecond);
  };
};

export { debounce };
