import TemplateCommandBase from '@amazee/ckeditor5-template/src/commands/templatecommandbase';

/**
 * Select a Drupal media element.
 */
export default class DrupalMediaSelectCommand extends TemplateCommandBase {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		this._mediaSelector = editor.config.get( 'drupalMediaSelector' ).callback;
		this._entitySelector = editor.config.get( 'drupalEntitySelector' ).callback;
	}

	/**
	 * @inheritDoc
	 */
	matchElement( templateElement ) {
		return templateElement.type === 'drupal-media';
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		this.updateCurrentlySelectedElement();
		this.isEnabled = !!this._currentElement;

		if ( this.isEnabled && this._currentElement.getAttribute( 'data-entity-type' ) ) {
			this.isMediaEnabled = false;
			this.isEntityEnabled = true;
		} else if ( this.isEnabled ) {
			this.isMediaEnabled = true;
			this.isEntityEnabled = false;
		}
		this.isApplicable = this.isEnabled;
		if ( this._currentElement ) {
			this.currentTemplateLabel = this.editor.templates.getElementInfo( this._currentElement.name ).label;
		}
	}

	/**
	 * @inheritDoc
	 */
	execute( values ) {
		if ( this._currentElementInfo.attributes[ 'data-entity-type' ] ) {
			this._entitySelector( this._currentElementInfo.attributes[ 'data-entity-type' ], values.operation, uuid => {
				if ( uuid === this.currentElement.getAttribute( 'data-entity-uuid' ) ) {
					return;
				}

				this.editor.model.change( writer => {
					writer.setAttribute( 'data-entity-uuid', uuid, this.currentElement );
				} );
			} );
		} else {
			this._mediaSelector( this._currentElementInfo.attributes[ 'data-media-type' ], values.operation, uuid => {
				if ( uuid === this.currentElement.getAttribute( 'data-media-uuid' ) ) {
					return;
				}

				this.editor.model.change( writer => {
					writer.setAttribute( 'data-media-uuid', uuid, this.currentElement );
				} );
			} );
		}
	}
}
