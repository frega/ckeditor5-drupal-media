import global from '@ckeditor/ckeditor5-utils/src/dom/global';
import { setData as setModelData, getData as getModelData } from '@ckeditor/ckeditor5-engine/src/dev-utils/model';

import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import TemplateEditing from '../src/drupalmediaediting';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import DrupalMediaResetCommand from '../src/drupalmediaresetcommand';

describe( 'DrupalMediaResetCommand', () => {
	let editorElement, model, editor, resetCommand, command;

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
				}
				} } )
			.then( newEditor => {
				editor = newEditor;
				model = editor.model;
				resetCommand = new DrupalMediaResetCommand( editor );
			} );
	} );

	afterEach( () => {
		editorElement.remove();
		return editor.destroy();
	} );

	it( 'is disabled by default', () => {
		setModelData( model, '[<paragraph></paragraph>]' );
		expect( resetCommand.isEnabled ).to.be.false;
	} );

	it( 'is disabled for media elements', () => {
		setModelData( model, '[<ck__media></ck__media>]' );
		expect( resetCommand.isEnabled ).to.be.false;
	} );

	it( 'is enabled for media elements with a data-media-uuid', () => {
		setModelData( model, '[<ck__media data-media-uuid="123"></ck__media>]' );
		expect( resetCommand.isEnabled ).to.be.false;
	} );

	it( 'resets media element media uuid', () => {
		setModelData( model, '[<ck__media data-media-uuid="123"></ck__media>]' );
		command.execute();
		expect( getModelData( model ) ).to.equal(
			'[<ck__media data-media-type="image" data-media-uuid="' + DrupalMediaResetCommand.EMPTY_MEDIA_UUID + '"></ck__media>]'
		);
	} );
} );
