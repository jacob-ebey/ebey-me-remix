// @ts-ignore
import { createRoot } from "react-dom";
import { RemixBrowser } from "remix";

const root = createRoot(document, { hydrate: true });
root.render(<RemixBrowser />);
