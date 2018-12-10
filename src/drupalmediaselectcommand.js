import TemplateCommandBase from 'ckeditor5-template/src/commands/templatecommandbase';

/**
 * Select a Drupal media element.
 */
export default class DrupalMediaSelectCommand extends TemplateCommandBase {
	/**
	 * @inheritDoc
	 */
	constructor( editor ) {
		super( editor );
		this._mediaSelector = editor.config.get( 'drupalMediaSelector' );
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
	execute( values ) {
		console.log( values );
		this._mediaSelector( values.operation, uuid => {
			if ( uuid === this.currentElement.getAttribute( 'data-media-uuid' ) ) {
				return;
			}

			this.editor.model.change( writer => {
				writer.setAttribute( 'data-media-uuid', uuid, this.currentElement );
			} );
		} );
	}
}
