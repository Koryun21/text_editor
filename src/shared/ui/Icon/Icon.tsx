import React from "react";
import cn from "classnames";

import * as Icons from "./Icon.vectors";
import styles from "./Icon.module.scss";

interface IconProps {
  name: keyof typeof Icons;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  className?: string;
}

const Icon: React.FC<IconProps> = (props) => {
  const {
    name,
    onClick,
    className,
  } = props;

  return (
    <span
      onClick={onClick}
      className={cn(styles.default, {
        [styles.clickable]: !!onClick,
      },className)}
    >
      {Icons[name]}
    </span>
  );
};

export default Icon;