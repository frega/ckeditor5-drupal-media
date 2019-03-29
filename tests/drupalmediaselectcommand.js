import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import { setData as setModelData, getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import TemplateEditing from '../src/drupalmediaediting';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import DrupalMediaSelectCommand from '../src/drupalmediaselectcommand';

describe( 'DrupalMediaSelectCommand', () => {
	let editorElement, model, editor, command;

	beforeEach( () => {
		editorElement = global.document.createElement( 'div' );
		global.document.body.appendChild( editorElement );

		return ClassicEditor
			.create( editorElement, {
				plugins: [ TemplateEditing, Paragraph ],
				templates: {
					media: {
						label: 'Media',
						template: '<div class="media" ck-type="drupal-media" data-media-type="image" data-media-uuid=""></div>',
					},
				},
				drupalMediaSelector: { callback: ( type, operation, callback ) => {
					callback( `${ type }:${ operation }` );
				},
				},
				drupalEntitySelector: {
					// @todo: clarify what is intended here (atm, there's only "select" afaics.
					callback: ( type, operation, callback ) => {
						callback( operation === 'add' ? '100' : '200' );
					},
				} } )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
				command = new DrupalMediaSelectCommand( editor );
			} );
	} );

	afterEach( () => {
		editorElement.remove();
		return editor.destroy();
	} );

	it( 'is disabled by default', () => {
		setModelData( model, '[<paragraph></paragraph>]' );
		expect( command.isEnabled ).to.be.false;
	} );

	it( 'is enabled for media elements', () => {
		setModelData( model, '[<ck__media></ck__media>]' );
		expect( command.isEnabled ).to.be.true;
	} );

	it( 'selects an entity using the correct operation', () => {
		setModelData( model, '[<ck__media></ck__media>]' );
		command.execute( { operation: 'a' } );
		expect( getModelData( model ) ).to.equal( '[<ck__media data-media-type="image" data-media-uuid="image:a"></ck__media>]' );
	} );
} );
