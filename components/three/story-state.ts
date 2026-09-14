export const storyState = {
  progress: 0,
  targetY: -0.3,
  pointerX: 0,
  pointerY: 0,
  assembly: 0.3,
  chapter: "hero" as
    "hero" | "unfold" | "pricing" | "work" | "owner" | "contact",
  visible: true,
  reduced: false,
  mobile: false,
  revision: 0,
};
export function updateAssembly(value: number) {
  storyState.assembly = value;
  storyState.revision++;
  window.dispatchEvent(new Event("zyrix:frame"));
}
