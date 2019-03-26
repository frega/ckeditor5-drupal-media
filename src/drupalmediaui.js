import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WidgetToolbarRepository from '@ckeditor/ckeditor5-widget/src/widgettoolbarrepository';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

import DrupalMediaEditing from './drupalmediaediting';
import DrupalMediaSelectCommand from './drupalmediaselectcommand';
import DrupalMediaResetCommand from './drupalmediaresetcommand';

import SelectIcon from '../theme/icons/search.svg';
import UploadIcon from '../theme/icons/upload.svg';
import ResetIcon from '../theme/icons/reset.svg';

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
				label: locale.t( 'Select from media gallery' ),
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

		this.resetCommand = new DrupalMediaResetCommand( this.editor );
		this.editor.commands.add( 'drupalMediaReset', this.resetCommand );

		this.editor.ui.componentFactory.add( 'drupalMediaReset', locale => {
			const view = new ButtonView();
			view.set( {
				label: locale.t( 'Reset media' ),
				icon: ResetIcon,
				tooltip: true,
			} );
			view.bind( 'isEnabled' ).to( this.resetCommand, 'isEnabled' );
			this.listenTo( view, 'execute', () => this.editor.execute( 'drupalMediaReset' ) );
			return view;
		} );
	}

	afterInit() {
		const widgetToolbarRepository = this.editor.plugins.get( WidgetToolbarRepository );
		widgetToolbarRepository.register( 'drupalMedia', {
			items: [ 'drupalMedia:select', 'drupalMedia:upload', 'drupalMediaReset' ],
			visibleWhen: () => this.command.isEnabled,
		} );
	}
}
