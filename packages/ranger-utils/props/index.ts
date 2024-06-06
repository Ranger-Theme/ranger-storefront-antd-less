import { memoize } from "./memoize";
import { reactProps } from "./props";

export const isPropValid = memoize((prop: any) => {
  const regex = new RegExp(reactProps.replace(/^\/|\/$/g, ""));
  return (
    regex.test(prop) ||
    (prop.charCodeAt(0) === 111 /* o */ &&
      prop.charCodeAt(1) === 110 /* n */ &&
      prop.charCodeAt(2) < 91)
  ); /* Z+1 */
});
