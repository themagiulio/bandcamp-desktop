const { dialog } = require('electron');

function showDialog(title, message) {
    dialog.showMessageBoxSync({ title, message });
}

module.exports = showDialog;