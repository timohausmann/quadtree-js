//tabs
document.querySelectorAll('.tab').forEach((tab, i) => {
    tab.addEventListener('click', () => {
        document.querySelector('.tab.active').classList.remove('active');
        tab.classList.add('active');
        document.querySelector('.tab-content.active').classList.remove('active');
        document.querySelector(`.tab-content:nth-of-type(${i+1})`).classList.add('active');
    });
});

//clipboard
document.querySelectorAll('.copy').forEach((button, i) => {
    const text = button.previousElementSibling.textContent;
    button.addEventListener('click', () => {
        navigator.clipboard.writeText(text).then(function() {
            button.classList.add('copied');
            button.addEventListener('animationend', () => {
                button.classList.remove('copied');
            }, {once: true});
        }, function(err) {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
        });
    });
});