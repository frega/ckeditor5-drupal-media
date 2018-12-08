import View from "@ckeditor/ckeditor5-ui/src/view";

export default class DrupalMediaView extends View {
	constructor(modelElement, editor) {
		super();

		this.set('loading', false);
		this.set('rendered', false);

		const searchButton = new ButtonView();
		searchButton.set('class', 'media-select');
		searchButton.set({
			label: 'Select media',
			icon: SearchIcon,
		});
		searchButton.on('execute', () => editor.execute('mediaSelect', {
			model: modelElement,
			operation: 'select',
		}));

		const uploadButton = new ButtonView({
			class: 'media-add',
		});
		uploadButton.set('class', 'media-add');
		uploadButton.set({
			label: 'Add media',
			icon: UploadIcon,
		});
		uploadButton.on('execute', () => editor.execute('mediaSelect', {
			model: modelElement,
			operation: 'add',
		}));

		const template = {
			tag: 'div',
			attributes: {
				class: ['ck-media-widget'],
			},
			children: [
				{
					tag: 'div',
					attributes: {
						class: ['ck-media-buttons'],
					},
					children: [searchButton, uploadButton],
				},
				{
					tag: 'div',
					attributes: {
						class: 'ck-media-content',
					},
				}
			]
		};

		this.setTemplate(template);
	}
}
