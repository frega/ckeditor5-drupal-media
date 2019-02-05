/**
 * @module drupal-media/utils
 */

import { isWidget, toWidget } from '@ckeditor/ckeditor5-widget/src/utils';

const drupalMediaSymbol = Symbol( 'isDrupalMedia' );

/**
 * Converts a given {@link module:engine/view/element~Element} to a drupal-media embed widget:
 * * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to
 *   recognize the drupal media widget element.
 * * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @param {module:engine/view/downcastwriter~DowncastWriter} writer An instance of the view writer.
 * @param {String} label The element's label.
 * @returns {module:engine/view/element~Element}
 */
export function toDrupalMediaWidget( viewElement, writer, label ) {
	writer.setCustomProperty( drupalMediaSymbol, true, viewElement );

	return toWidget( viewElement, writer, { label } );
}

/**
 * Returns a drupal-media widget editing view element if one is selected.
 *
 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
 * @returns {module:engine/view/element~Element|null}
 */
export function getSelectedDrupalMediaViewWidget( selection ) {
	const viewElement = selection.getSelectedElement();
	if ( viewElement && isDrupalMediaWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}

/**
 * Checks if a given view element is a drupal-media widget.
 *
 * @param {module:engine/view/element~Element} viewElement
 * @returns {Boolean}
 */
export function isDrupalMediaWidget( viewElement ) {
	return !!viewElement.getCustomProperty( drupalMediaSymbol ) && isWidget( viewElement );
}
