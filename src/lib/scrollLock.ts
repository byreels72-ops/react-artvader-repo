let locks = 0;

/**
 * Stops the page from scrolling until the returned release function is called. Locks are
 * counted, so overlapping holders (the Work view, the mobile menu, the lightbox) can release in
 * any order - e.g. when a route change unmounts them together - without leaving the page stuck.
 */
export function lockScroll(): () => void {
  if (locks++ === 0) document.body.style.overflow = "hidden";
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if (--locks === 0) document.body.style.overflow = "";
  };
}
