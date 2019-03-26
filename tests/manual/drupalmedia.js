/* global document, console, window */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EnterPlugin from '@ckeditor/ckeditor5-enter/src/enter';
import TypingPlugin from '@ckeditor/ckeditor5-typing/src/typing';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import UndoPlugin from '@ckeditor/ckeditor5-undo/src/undo';

import DrupalMediaEditing from '../../src/drupalmediaediting';
import TemplateUI from '@amazee/ckeditor5-template/src/ui/templateui';
import DrupalMediaUI from '../../src/drupalmediaui';

// The editor creator to use.
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Placeholder from '@amazee/editor-components/components/placeholder/placeholder';
import Media from '@amazee/editor-components/components/media/media';
import DrupalMediaResetCommand from '../../src/drupalmediaresetcommand';

class PlaceholderConfig extends Plugin {
	init() {
		const templates = this.editor.config.get( 'templates' );
		Placeholder.availableSections = Object.keys( templates )
			.map( id => ( { id, label: templates[ id ].label, icon: templates[ id ].icon } ) );
		Media.previewCallback = this.editor.config.get( 'drupalMediaRenderer' ).callback;
	}
}

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [
			EnterPlugin,
			TypingPlugin,
			ParagraphPlugin,
			HeadingPlugin,
			TemplateUI,
			DrupalMediaEditing,
			DrupalMediaUI,
			UndoPlugin,
			PlaceholderConfig
		],
		toolbar: [ 'heading', '|', 'template', '|', 'undo', 'redo' ],
		templates: {
			media: {
				label: 'Media',
				template: '<div class="simple" ck-type="drupal-media" data-media-uuid="" data-media-type="image"></div>',
			},
		},
		masterTemplate: 'root',
		drupalMediaSelector: {
			callback: ( type, operation, callback ) => {
				callback( operation === 'add' ? '300' : '400' );
			},
		},
		drupalMediaRenderer: {
			callback: ( uuid, display, callback ) => {
				if ( uuid === DrupalMediaResetCommand.EMPTY_MEDIA_UUID ) {
					callback( '' );
				} else {
					window.setTimeout( () => {
						callback( `<img src="https://picsum.photos/800/${ uuid }"/>` );
					}, 2000 );
				}
			}
		},
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
