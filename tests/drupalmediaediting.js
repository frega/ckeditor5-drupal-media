import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import { getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';
import { getData as getViewData } from '@ckeditor/ckeditor5-engine/src/dev-utils/view';

import TemplateEditing from '../src/drupalmediaediting';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Media from '@amazee/editor-components/components/media/media';

class PlaceholderConfig extends Plugin {
	init() {
		Media.previewCallback = this.editor.config.get( 'drupalMediaRenderer' ).callback;
	}
}

describe( 'DrupalMediaEditing', () => {
	let editorElement, model, view, editor;

	beforeEach( () => {
		editorElement = global.document.createElement( 'div' );
		global.document.body.appendChild( editorElement );

		return ClassicEditor
			.create( editorElement, {
				plugins: [ TemplateEditing, PlaceholderConfig ],
				templates: {
					media: {
						label: 'Media',
						template: '<div class="media" ck-type="drupal-media" ' +
							'data-media-uuid="" data-media-type="image" ' +
							'data-media-display="original"></div>',
					},
					attribute: {
						label: 'Attributes',
						template: '<div itemprop="media" class="attribute" ck-type="drupal-media" ' +
							'data-media-uuid="" data-media-type="image" ' +
							'data-media-display="original"></div>',
					},
				},
				drupalMediaRenderer: { callback: ( uuid, display, callback ) => {
					callback( `<p>Preview for ${ uuid } in ${ display } display.</p>` );
				} }
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
		expect( getModelData( model ) ).to.equal( '[<ck__media data-media-display="original" data-media-type="image"></ck__media>]' );
	} );

	it( 'upcasts existing uuids elements', () => {
		editor.setData( '<div class="media" data-media-uuid="123"></div>' );
		expect( getModelData( model ) ).to.equal( '[<ck__media data-media-display="original" ' +
			'data-media-type="image" data-media-uuid="123"></ck__media>]' );
	} );

	it( 'upcasts attributes', () => {
		editor.setData( '<div class="attribute" itemprop="media"></div>' );
		expect( getModelData( model ) ).to.equal( '[<ck__attribute data-media-display="original" data-media-type="image" ' +
			'itemprop="media"></ck__attribute>]' );
	} );

	it( 'auto-adds attributes with default values', () => {
		editor.setData( '<div class="attribute"></div>' );
		expect( getModelData( model ) ).to.equal( '[<ck__attribute data-media-display="original" data-media-type="image" ' +
			'itemprop="media"></ck__attribute>]' );
	} );

	it( 'autofills default attributes', () => {
		editor.setData( '<div class="attribute" data-media-uuid="123"></div>' );
		expect( editor.getData() ).to.equal( '<div class="attribute" itemprop="media" data-media-uuid="123" data-media-type="image" ' +
			'data-media-display="original">&nbsp;</div>' );
	} );

	it( 'renders a preview for defined uuids', done => {
		editor.setData( '<div class="media" data-media-uuid="123" data-media-display="original"></div>' );

		// Expect the webcomponent.
		expect( getViewData( view ) ).to.equal(
			'[<ck-media class="ck-widget ck-widget_selected media" contenteditable="false" data-media-display="original" ' +
			'data-media-type="image" data-media-uuid="123">' +
			'</ck-media>]'
		);

		// Access the preview from within the web componet.
		global.window.setTimeout( () => {
			const shadowRoot = editor.editing.view.getDomRoot().querySelector( 'ck-media' ).shadowRoot;
			const preview = shadowRoot.querySelector( '.ck-media .ck-media__preview' ).innerHTML;
			expect( preview ).to.equal( '<p>Preview for 123 in original display.</p>' );
			done();
		} );
	} );
} );
