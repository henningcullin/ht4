window.onload=(apply(document));

const parser = new DOMParser();

/**
 * Gets elements from url, places them in target element
 * @param {string} url 
 * @param {Element} target 
 */
async function load(url, target) {
    const response = await fetch(url);
    const result = await response.text();
    const doc = parser.parseFromString(result, 'text/html');
    for (const el of doc.querySelectorAll('div')) {
        target.appendChild(el);
        apply(el);
    };
}

/**
 * 
 * @param {string} url fetching url
 * @param {Element} form form element
 * @param {string} target target container selector
 * @param {string} swap how should it swap
 */
async function send(url, form, target, swap) {
    window.event.preventDefault();
    const data = {};

    for (const input of form.querySelectorAll('input')) {
        if(input['type'] == 'submit') continue;
        if(!input.hasAttribute('t4-input-optional') && input['value'] == '') return;
        data[input['name']] = input['value'];
    }

    const response = await fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});

    const result = await response.text();
    const doc = parser.parseFromString(result, 'text/html');
    const element = doc.body.children[0];
    const container = document.querySelector(target);

    if (swap == 'afterbegin') container.insertBefore(element, container.firstChild);
    else container.appendChild(element);
    if (form.hasAttribute('t4-form-reset')) form.reset();

    apply(element);
}

async function destroy(url, target) {
    const response = await fetch(url, {method: 'DELETE'});
    if (response.status != 200 && response.status != 201) return;
    document.querySelector(target).remove();
}

/**
 * This function applies operations based on the provided object.
 *
 * @param {Element} element - The object to apply from
 */
function apply(element) {

    const gets = element.querySelectorAll('[t4-get]');
    const posts = element.querySelectorAll('[t4-post]')
    const dels = element.querySelectorAll('[t4-delete]');

    if (!gets != gets) {
        for (const el of gets) {get(el)};
    }

    if (!posts != posts) {
        for (const el of posts) {post(el)};
    }

    if (!dels != dels) {
        for (const el of dels) {del(el)};
    }
}

function get(el) {
    if(el.getAttribute('t4-trigger') == 'load') {
        load(
            el.getAttribute('t4-get'), 
            el
        );
    };
}

function post(el) {
    if(el.getAttribute('t4-trigger') == 'submit') {
        el.addEventListener('submit', () => {
                send(
                    el.getAttribute('t4-post'),
                    el,
                    el.getAttribute('t4-target'),
                    el.getAttribute('t4-swap')
                );
            }
        );
    };
}

function del(el) {
    el.addEventListener('click', () => {
            destroy(
                el.getAttribute('t4-delete'),
                el.getAttribute('t4-target')
            );
        }
    );
}