import ReactDOM from 'react-dom';
import { DocMiniApp } from './utils/api';
import App from './settingApp';
import { initTheme } from './utils';
import { ThemeProvider } from './Component/Theme';
import { I18NProvider } from './Component/I18nProvider';

initTheme(DocMiniApp);

ReactDOM.render(
  <I18NProvider docMiniApp={DocMiniApp}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </I18NProvider>,
  document.getElementById('root') as HTMLElement
);
