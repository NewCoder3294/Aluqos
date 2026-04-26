// Re-export of the canonical Reveal helper. The actual implementation lives
// in motion-primitives.tsx alongside ScrollProgress and the EASE constant —
// keeping all motion atoms in one place. This shim exists so callers can
// import { Reveal } from "./reveal" if they prefer the focused name.
export { Reveal, EASE } from "./motion-primitives";
