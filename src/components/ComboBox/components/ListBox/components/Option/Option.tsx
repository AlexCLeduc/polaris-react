import React, {useRef} from 'react';
import {classNames} from '../../../../../../utilities/css';
import {useListBox} from '../../hooks/useListBox';
import styles from './Option.scss';

export type OptionProps = {
  value: string;
  children?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
};

export function Option({value, children, selected}: OptionProps) {
  const {keyboardFocusedOption, onItemClick} = useListBox();
  const listItemRef = useRef<HTMLLIElement>(null);
  const optionClassName = classNames(
    styles.Option,
    selected && styles.selected,
    keyboardFocusedOption === value && styles.focused,
  );

  const handleItemClick = () => {
    onItemClick && onItemClick(value);
  };

  const content = children ? children : value;
  const id = value.toLocaleLowerCase().replace(' ', '_');

  return (
    <li
      className={optionClassName}
      id={id}
      ref={listItemRef}
      onClick={handleItemClick}
    >
      {content}
    </li>
  );
}
