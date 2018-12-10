import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import { setData as setModelData, getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import TemplateEditing from '../src/drupalmediaediting';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

describe( 'DrupalMediaEditing', () => {
	let editorElement, model, view, editor;

	beforeEach( () => {
		editorElement = global.document.createElement( 'div' );
		global.document.body.appendChild( editorElement );

		return ClassicEditor
			.create( editorElement, {
				plugins: [ TemplateEditing ],
				templates: {
					media: {
						label: 'Media',
						template: '<div class="media" ck-type="drupal-media" data-media-uuid="" data-media-display="original"></div>',
					},
				},
				drupalMediaRenderer( uuid, display, callback ) {
					callback( `<p>Preview for ${ uuid } in ${ display } display.</p>` );
				}
			} )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
				view = editor.editing.view;
			} );
	} );

	afterEach( () => {
		editorElement.remove();
		return editor.destroy();
	} );

	it( 'upcasts empty elements', () => {
		editor.setData( '<div class="media"></div>' );
		expect( getModelData( model ) ).to.equal( '[<ck__media></ck__media>]' );
	} );

	it( 'upcasts existing uuids elements', () => {
		editor.setData( '<div class="media" data-media-uuid="123"></div>' );
		expect( getModelData( model ) ).to.equal( '[<ck__media data-media-uuid="123"></ck__media>]' );
	} );

	it( 'renders a preview for defined uuids', done => {
		editor.setData( '<div class="media" data-media-uuid="123" data-media-display="original"></div>' );
		expect( getViewData( view ) ).to.equal(
			'[<div class="ck-widget ck-widget_selected media" contenteditable="false" ' +
			'data-media-display="original" data-media-uuid="123">' +
			'<div class="ck-drupal-media-preview"></div>' +
			'</div>]'
		);

		global.window.setTimeout( () => {
			const docRoot = editor.editing.view.getDomRoot();
			const preview = docRoot.querySelector( '.ck-drupal-media-wrapper' ).innerHTML;
			expect( preview ).to.equal( '<p>Preview for 123 in original display.</p>' );
			done();
		} );
	} );
} );
