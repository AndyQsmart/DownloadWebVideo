var old = window.XMLHttpRequest;
window.XMLHttpRequest = function() {
    console.log(arguments);
    alert('test')
    return old.apply(this, arguments);
}
alert('test')