export default function AppRenderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}
