import type { Presentation } from '../types/presentation';
import { useHistoryUI } from '../hooks/useHistoryUI';
import { usePreviewDialog } from '../hooks/usePreviewDialog';
import { PreviewOverlay } from './PreviewOverlay';
import { SlideList } from './SlideList';
import { Toolbar } from './Toolbar';
import { Workspace } from './Workspace';
import styles from './App.module.css';

type AppProps = {
  presentation: Presentation;
};

function App({ presentation }: AppProps) {
  const { isOpen, open, close } = usePreviewDialog();
  const history = useHistoryUI();

  if (isOpen) {
    return <PreviewOverlay presentation={presentation} onClose={close} />;
  }

  return (
    <main className={styles.appShell}>
      <Toolbar presentation={presentation} onPreview={open} {...history} />
      <div className={styles.editorLayout}>
        <SlideList presentation={presentation} />
        <Workspace presentation={presentation} />
      </div>
    </main>
  );
}

export { App };