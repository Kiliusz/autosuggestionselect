import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AutosuggestionSelect.module.css';

//For the purpose of the task i put all the code in here,
//to make it just one simple component to use

type OptionsArray = (string | number)[];

interface AutoSuggestionSelectProps {
  title: string;
  endpoint: string;
  propertyKey: string;
  onItemSelect: (item: string, arr: OptionsArray) => any;
}

const AutosuggestionSelect: React.FC<AutoSuggestionSelectProps> = ({
  title,
  endpoint,
  propertyKey,
  onItemSelect,
}) => {
  const [openBox, setOpenBox] = useState(false);
  const [rawOptions, setRawOptions] = useState<OptionsArray>([]);
  const [selectedItems, setSelectedItems] = useState<OptionsArray>([]);
  const [optionsToDisplay, setOptionsToDisplay] = useState<OptionsArray>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const prepareOptions = useCallback(() => {
    if (!selectedItems?.length) setOptionsToDisplay(rawOptions);
    if (!rawOptions?.length) setOptionsToDisplay(selectedItems);
    const preparedOptions = rawOptions?.filter(
      (option) => !selectedItems.includes(option)
    );
    setOptionsToDisplay([...selectedItems, ...preparedOptions]);
  }, [selectedItems, rawOptions]);

  const debounce = (fn: (...args: any) => void, timeout = 350) => {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: any) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, timeout);
    };
  };

  const onHide = () => {
    setRawOptions([]);
    setSearch('');
    setOpenBox(false);
  };

  const handleResetButtonClick = () => {
    setSelectedItems([]);
    onItemSelect('', []);
  };

  const onMainButtonClick = () => {
    setOpenBox((prev) => !prev);
    if (openBox) onHide();
  };

  const getData = (query: string, propertyKeyArg: string) => {
    if (!query.length) return setRawOptions([]);
    setLoading(true);
    fetch(endpoint + query)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        const mappedData = data.map((item: any) => item[propertyKeyArg]);
        setRawOptions(mappedData);
      })
      .catch((err) => {
        setLoading(false);
        setRawOptions(["Can't load data, try again later"]);
      });
  };

  const getDebouncedData = useCallback(
    debounce((search, propertyKey) => getData(search, propertyKey)),
    []
  );

  const handleOptionClick = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.target as Element;
    const item = target.innerHTML;
    setSelectedItems((prev) => {
      const selectedItemsArray = prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item];
      onItemSelect(item, selectedItemsArray);
      return selectedItemsArray;
    });
  };

  const handleOutsideClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.className.includes('AutosuggestionSelect_optionItem')) return;
    if (wrapperRef.current && !wrapperRef.current.contains(target)) {
      onHide();
    }
  }, []);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key && e.key === 'Escape') onHide();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, [openBox]);

  useEffect(() => {
    getDebouncedData(search, propertyKey);
  }, [search, getDebouncedData, propertyKey]);

  useEffect(() => {
    prepareOptions();
  }, [rawOptions, selectedItems, prepareOptions]);

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleOutsideClick, handleEscape]);

  return (
    <>
      <div ref={wrapperRef}>
        <div className={styles.titleWrapper} onClick={onMainButtonClick}>
          <h4 className={styles.titleHeader}>{title} </h4>
          <span className={styles.counter}>{selectedItems.length} </span>
        </div>
        {openBox && (
          <div className={styles.selectWrapper}>
            <div className={styles.inputContainer}>
              <input
                ref={searchInputRef}
                placeholder="Search..."
                className={styles.inputField}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
            </div>
            {loading && <div className={styles.loading}>Loading...</div>}
            {optionsToDisplay.length ? (
              <div className={styles.optionsContainer}>
                {optionsToDisplay.map((option, idx) => (
                  <div
                    onClick={handleOptionClick}
                    key={idx}
                    className={`${styles.optionItem} ${
                      selectedItems.includes(option)
                        ? styles.optionSelected
                        : null
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            ) : null}
            {selectedItems.length ? (
              <button
                onClick={handleResetButtonClick}
                className={styles.resetButton}
              >
                Reset
              </button>
            ) : null}
          </div>
        )}
      </div>
    </>
  );
};

export default AutosuggestionSelect;
