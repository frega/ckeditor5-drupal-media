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

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';

// The editor creator to use.
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Placeholder from '@amazee/editor-components/components/placeholder/placeholder';
import Media from '@amazee/editor-components/components/media/media';

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
			Essentials,
			ParagraphPlugin,
			EnterPlugin,
			TypingPlugin,
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
		drupalEntitySelector: {
			// @todo: clarify what is intended here (atm, there's only "select" afaics.
			callback: ( type, operation, callback ) => {
				callback( operation === 'add' ? '100' : '200' );
			},
		},
		drupalMediaRenderer: {
			callback: ( uuid, display, callback ) => {
				window.setTimeout( () => {
					callback( `<img src="https://picsum.photos/800/${ uuid }"/>` );
				}, 2000 );
			}
		},
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
