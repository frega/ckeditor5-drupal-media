import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import DrupalMediaEditing from './drupalmediaediting';
import DrupalMediaUI from './drupalmediaui';

export default class DrupalMedia extends Plugin {
	static get requires() {
		return [ DrupalMediaEditing, DrupalMediaUI ];
	}
}
