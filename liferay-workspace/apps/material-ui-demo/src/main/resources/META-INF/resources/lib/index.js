import React from 'react';
import ReactDOM from 'react-dom';

import configurator from './configurator';

import { Game } from './Game';
import { Switches } from './Switches';
import { Notifications } from './Notifications';

function Demo() {
	return (
		<div>
			<Game />
			<Switches />
			<Notifications />
		</div>
	);
}

export default function (elementId, liferayConfig) {
	configurator.setConfig(liferayConfig);
	ReactDOM.render(<Demo />, document.getElementById(elementId));
}
