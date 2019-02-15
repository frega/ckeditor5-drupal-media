import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import TemplateEditing from '@amazee/ckeditor5-template/src/templateediting';
import ViewPosition from '@ckeditor/ckeditor5-engine/src/view/position';

import { downcastAttributeToAttribute } from '@ckeditor/ckeditor5-engine/src/conversion/downcast-converters';
import { downcastTemplateElement, getModelAttributes } from '@amazee/ckeditor5-template/src/utils/conversion';
import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

import '../theme/css/media.css';
import { postfixTemplateElement } from '@amazee/ckeditor5-template/src/utils/integrity';

/**
 * Drupal media integration for CKEditor templates.
 */
export default class DrupalMediaEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		editor.config.define( 'drupalMediaSelector', () => '' );
		editor.config.define( 'drupalMediaRenderer', () => '' );
	}

	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ TemplateEditing ];
	}

	init() {
		this._mediaRenderer = this.editor.config.get( 'drupalMediaRenderer' ).callback;

		this.editor.templates.registerPostFixer( [ 'drupal-media' ], postfixTemplateElement );

		this.editor.conversion.for( 'editingDowncast' ).add( downcastAttributeToAttribute( {
			model: 'data-media-uuid',
			view: ( value, data ) => {
				if ( value === null ) {
					return;
				}
				const mapper = this.editor.editing.mapper;
				const domConverter = this.editor.editing.view.domConverter;
				const modelElement = data.item;
				const viewElement = mapper.toViewElement( modelElement );
				const previewElement = viewElement.getChild( 0 );
				const previewDomElement = domConverter.mapViewToDom( previewElement );

				if ( previewDomElement ) {
					previewDomElement.classList.add( 'ck-drupal-media-loading' );
				}

				const display = modelElement.getAttribute( 'data-media-display' );

				this._preview( value, display ).then( preview => {
					const previewDomElement = domConverter.mapViewToDom( previewElement );
					previewDomElement.classList.remove( 'ck-drupal-media-loading' );
					previewDomElement.querySelector( '.ck-drupal-media-wrapper' ).innerHTML = preview;
				} );
			},
		} ) );

		// Default editing downcast conversions for template container elements without functionality.
		this.editor.conversion.for( 'editingDowncast' ).add( downcastTemplateElement( this.editor, {
			types: [ 'drupal-media' ],
			view: ( templateElement, modelElement, viewWriter ) => {
				const container = viewWriter.createContainerElement(
					templateElement.tagName,
					getModelAttributes( templateElement, modelElement )
				);

				const media = viewWriter.createUIElement( 'div', { class: 'ck-drupal-media-preview' }, function( domDocument ) {
					const domElement = this.toDomElement( domDocument );
					domElement.innerHTML =
						'<div class="ck-drupal-media-wrapper">' +
						'<div class="ck-drupal-media-placeholder"></div>' +
						'</div>' +
						'<div class="ck-drupal-media-loader"></div>';
					return domElement;
				} );

				viewWriter.insert( new ViewPosition( container, 0 ), media );

				return toWidget( container, viewWriter );
			}
		} ), { priority: 'low ' } );
	}

	_preview( id, display ) {
		return new Promise( resolve => {
			this._mediaRenderer( id, display, content => {
				resolve( content );
			} );
		} );
	}
}
