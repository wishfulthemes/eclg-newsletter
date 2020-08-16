import { render } from '@wordpress/element';
import domReady from '@wordpress/dom-ready';

import Settings from './Components/Settings';

const settingsPage = document.getElementById('eclg-settings');

if ( 'undefined' !== typeof settingsPage && null !== settingsPage ) {
    console.log(settingsPage);
    domReady(function () {
        render(<Settings />, settingsPage);
    });
}
