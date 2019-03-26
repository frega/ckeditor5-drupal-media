import TemplateCommandBase from '@amazee/ckeditor5-template/src/commands/templatecommandbase';

/**
 * Select a Drupal media element.
 */
export default class DrupalMediaResetCommand extends TemplateCommandBase {
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
		super.refresh();
		this.isEnabled = !!this._currentElement &&
			this._currentElement.getAttribute( 'data-media-uuid' ) &&
			this._currentElement.getAttribute( 'data-media-uuid' ) !== DrupalMediaResetCommand.EMPTY_MEDIA_UUID;
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		this.editor.model.change( writer => {
			// Quickfix: setting it to '' or removing the attribute does *not* trigger conversion.
			writer.setAttribute( 'data-media-uuid', DrupalMediaResetCommand.EMPTY_MEDIA_UUID, this.currentElement );
		} );
	}
}

DrupalMediaResetCommand.EMPTY_MEDIA_UUID = ' ';
