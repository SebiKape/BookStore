FilePond = require('filepond')
FilePondPluginFileEncode = require('filepond-plugin-file-encode')
FilePondPluginImagePreview = require('filepond-plugin-image-preview')
FilePondPluginImageResize = require('filepond-plugin-image-resize')

FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode, FilePondPluginImageResize);

FilePond.setOptions({
    stylePanelAspectRatio: 150 / 100,
    imageResizeTargetWidth: 100,
    imageResizeTargetHeight: 150
})

const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create( inputElement );
