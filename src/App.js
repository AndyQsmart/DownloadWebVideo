import React from 'react';
import './common_css/normalize.css'
import './common_css/main.css'
import { Provider } from 'react-redux';
import ReduxHelper from './redux/ReduxHelper';
import { Router } from './Routes';
import DevelopTools from './common_js/DevelopTools';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Color from './common_js/Color';

DevelopTools.init()

let store = ReduxHelper.createStore()

// mutirial主题
const theme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    spacing: 10,
    palette: {
        primary: { main: Color.primary },
        secondary: { main: Color.secondary },
        text: {
            primary: Color.text_primary,
            secondary: Color.text_secondary,
        },
    },
})

const App = () => (
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            {/* <MuiPickersUtilsProvider utils={DateFnsUtils} locale={zhCNLocale} > */}
                <Router />
            {/* </MuiPickersUtilsProvider> */}
        </ThemeProvider>
    </Provider>
)

export default App;
