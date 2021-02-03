const rootStyles = window.getComputedStyle(document.documentElement);

if ((rootStyles.getPropertyValue('--book-cover-width-large') != null) && (rootStyles.getPropertyValue('--book-cover-width-large') != '')) {
    ready()
} else {
    document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
    const coverWidth = parseFloat(rootStyles.getPropertyValue('--book-cover-width-large'))
    const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--book-cover-aspect-ratio'))
    const coverHeight = coverWidth / coverAspectRatio
    FilePond = require('filepond')
    FilePondPluginFileEncode = require('filepond-plugin-file-encode')
    FilePondPluginImagePreview = require('filepond-plugin-image-preview')
    FilePondPluginImageResize = require('filepond-plugin-image-resize')
    
    FilePond.registerPlugin(FilePondPluginImagePreview, FilePondPluginFileEncode, FilePondPluginImageResize);
    
    FilePond.setOptions({
        stylePanelAspectRatio: 1 / coverAspectRatio,
        imageResizeTargetWidth: coverWidth,
        imageResizeTargetHeight: coverHeight
    })
    
    const inputElement = document.querySelector('input[type="file"]');
    const pond = FilePond.create( inputElement );
    
}
