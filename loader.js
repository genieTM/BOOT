function IPL() {
    URLs = ['https://genieTM.github.io/BOOT/crypt-js-3.1.2-aes.js',
        'https://genieTM.github.io/BOOT/crypt-js-3.1.2-pbkdf2.js',
        'https://genieTM.github.io/BOOT/mousetrap.js'
    ].concat(URLs);
    while (URLs.length > 0) {
        var url = URLs.shift();
        var name = url.slice(url.lastIndexOf('/') + 1);
        if (typeof(nameExists) == 'undefined')
            nameExists = {};
        if (!nameExists[name]) {
            nameExists[name] = true;
            var source = localStorage.getItem(name);
            if (!!source) {
                eval(source);
            } else {
                fetch(url).then(response => response.text()).then(source => {
                    try {
                        var txt = decript(pwd, source);
                        if (txt.length > 0)
                            source = txt;
                    } catch {};
                    eval(source);
                });
            }
        }
    }
}
function decript(pwd, text) {
    var array_rawData = text.split(',');
    var salt = CryptoJS.enc.Hex.parse(array_rawData[0]);
    var iv = CryptoJS.enc.Hex.parse(array_rawData[1]);
    var encrypted_data = CryptoJS.enc.Base64.parse(array_rawData[2]);
    var secret_passphrase = CryptoJS.enc.Utf8.parse(pwd);
    var key128Bits500Iterations = CryptoJS.PBKDF2(secret_passphrase, salt, {
        keySize: 128 / 8,
        iterations: 500
    });
    var options = {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    };
    var decrypted = CryptoJS.AES.decrypt({
        'ciphertext': encrypted_data
    }, key128Bits500Iterations, options);
    return decrypted.toString(CryptoJS.enc.Utf8);
}
IPL();
