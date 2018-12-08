import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TemplateEditing from "ckeditor5-template/src/templateediting";

import { downcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import {downcastTemplateElement, getModelAttributes} from "ckeditor5-template/src/utils/conversion";
import DrupalMediaView from "./view/drupalmediaview";

/**
 * Drupal media integration for CKEditor templates.
 */
export default class DrupalMedia extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		editor.config.define('drupalMediaSelector', () => '');
		editor.config.define('drupalMediaRenderer', () => '');
	}
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ TemplateEditing ];
	}

	init() {

		this.mediaSelector = this.editor.config.get( 'drupalMediaSelector' );
		this.mediaRenderer = this.editor.config.get( 'drupalMediaRenderer' );

		this.editor.conversion.for( 'editingDowncast' ).add( downcastAttributeToAttribute( {
			model: 'data-media-uuid',
			view: ( value, data ) => {
				const mapper = this.editor.editing.mapper;
				const modelElement = data.item;
				const viewElement = mapper.toViewElement( modelElement );
				const mediaView = viewElement.getCustomProperty( 'drupalMediaView' );

				const display = modelElement.getAttribute( 'data-media-display' );

				mediaView.set( 'loading', true );


				this._preview( value, display ).then( preview => {
					mediaView.set( {
						preview,
						loading: false,
					} );

				} );
			},
		} ) );

		// Default editing downcast conversions for template container elements without functionality.
		this.editor.conversion.for( 'editingDowncast' ).add( downcastTemplateElement( this.editor, {
			types: [ 'drupal-media' ],
			view: ( templateElement, modelElement, viewWriter ) => {
				const container = toWidget( viewWriter.createContainerElement(
					templateElement.tagName,
					getModelAttributes( templateElement, modelElement )
				), viewWriter );

				const media = viewWriter.createUIElement( 'div', { class: 'media-preview' }, function( domDocument ) {
					const domElement = this.toDomElement( domDocument );
					const mediaView = new DrupalMediaView();
					viewWriter.setCustomProperty( 'drupalMediaView', mediaView, container );
					mediaView.render();
					domElement.append( mediaView.element );
					return domElement;
				} );

				viewWriter.insert( ViewPosition.createAt( container, 0 ), media );

				return container;
			}
		} ), { priority: 'low ' } );
	}

	_preview( id, display ) {
		return new Promise( resolve => {
			this.mediaRenderer( id, display, content => {
				resolve( content );
			} )
		} );
	}
}
