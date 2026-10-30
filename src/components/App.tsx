import { useState } from 'react';
import type { Presentation } from '../types/presentation';
import { PreviewOverlay } from './PreviewOverlay';
import { SlideList } from './SlideList';
import { Toolbar } from './Toolbar';
import { Workspace } from './Workspace';
import styles from './App.module.css';

type AppProps = {
  presentation: Presentation;
};

function App({ presentation }: AppProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (isPreviewOpen) {
    return <PreviewOverlay presentation={presentation} onClose={() => setIsPreviewOpen(false)} />;
  }

  return (
    <main className={styles.appShell}>
      <Toolbar presentation={presentation} onPreview={() => setIsPreviewOpen(true)} />
      <div className={styles.editorLayout}>
        <SlideList presentation={presentation} />
        <Workspace presentation={presentation} />
      </div>
    </main>
  );
}

export { App };