import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import { getSelectedDrupalMediaViewWidget } from './utils';

import DrupalMediaEditing from './drupalmediaediting';
import DrupalMediaSelectCommand from './drupalmediaselectcommand';

import SelectIcon from '../theme/icons/search.svg';
import UploadIcon from '../theme/icons/upload.svg';

/**
 * Show a select/upload toolbar for embedded Drupal media entities.
 */
export default class DrupalMediaUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ DrupalMediaEditing, WidgetToolbarRepository ];
	}

	init() {
		this.command = new DrupalMediaSelectCommand( this.editor );
		this.editor.commands.add( 'drupalMediaSelect', this.command );

		this.editor.ui.componentFactory.add( 'drupalMedia:select', locale => {
			const view = new ButtonView();
			view.set( {
				label: locale.t( 'Select media' ),
				icon: SelectIcon,
				tooltip: true,
			} );
			view.bind( 'isEnabled' ).to( this.command, 'isEnabled' );
			this.listenTo( view, 'execute', () => this.editor.execute( 'drupalMediaSelect', { operation: 'select' } ) );
			return view;
		} );

		this.editor.ui.componentFactory.add( 'drupalMedia:upload', locale => {
			const view = new ButtonView();
			view.set( {
				label: locale.t( 'Upload media' ),
				icon: UploadIcon,
				tooltip: true,
			} );
			view.bind( 'isEnabled' ).to( this.command, 'isEnabled' );
			this.listenTo( view, 'execute', () => this.editor.execute( 'drupalMediaSelect', { operation: 'add' } ) );
			return view;
		} );
	}

	afterInit() {
		const widgetToolbarRepository = this.editor.plugins.get( WidgetToolbarRepository );
		widgetToolbarRepository.register( 'drupalMedia', {
			items: [ 'drupalMedia:select', 'drupalMedia:upload' ],
			getRelatedElement: getSelectedDrupalMediaViewWidget
		} );
	}
}
