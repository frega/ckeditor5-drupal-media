/* global document, console, window */

import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import EnterPlugin from '@ckeditor/ckeditor5-enter/src/enter';
import TypingPlugin from '@ckeditor/ckeditor5-typing/src/typing';
import ParagraphPlugin from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import HeadingPlugin from '@ckeditor/ckeditor5-heading/src/heading';
import UndoPlugin from '@ckeditor/ckeditor5-undo/src/undo';

import DrupalMediaEditing from '../../src/drupalmediaediting';
import TemplateUI from 'ckeditor5-template/src/ui/templateui';
import DrupalMediaUI from '../../src/drupalmediaui';

ClassicEditor
	.create( document.querySelector( '#editor' ), {
		plugins: [ EnterPlugin, TypingPlugin, ParagraphPlugin, HeadingPlugin, TemplateUI, DrupalMediaEditing, DrupalMediaUI, UndoPlugin ],
		toolbar: [ 'heading', '|', 'template', '|', 'undo', 'redo' ],
		templates: {
			media: {
				label: 'Media',
				template: '<div class="simple" ck-type="drupal-media" data-media-uuid=""></div>',
			},
		},
		drupalMediaSelector( operation, callback ) {
			callback( operation === 'add' ? '300' : '400' );
		},
		drupalMediaRenderer( uuid, display, callback ) {
			window.setTimeout( () => {
				callback( `<img src="https://picsum.photos/800/${ uuid }"/>` );
			}, 2000 );
		},
	} )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
