import { useEffect } from 'react';

const useOutboundClick = (ref, setIsOpen) => {
  function handleClickOutside(event) {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
};

export default useOutboundClick;
