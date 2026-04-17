import './bootstrap';

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
    token:       localStorage.getItem('token'),
    user:        JSON.parse(localStorage.getItem('user') || 'null'),
    books:       [],
    authors:     [],
    tab:         'books',
    filter:      'all',
    editingBook: null,
};

// ─── API helper ──────────────────────────────────────────────────────────────
async function api(method, path, data) {
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;

    const res = await fetch(`/api${path}`, {
        method,
        headers,
        body: data !== undefined ? JSON.stringify(data) : undefined,
    });

    if (res.status === 204) return null;
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || Object.values(json.errors || {}).flat().join(', ') || 'Ошибка запроса');
    return json;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function login(email, password) {
    const data = await api('POST', '/login', { email, password });
    saveAuth(data);
    closeModal();
    renderAuth();
    showToast('Добро пожаловать, ' + data.user.name + '!');
    document.getElementById('btn-add-book').classList.remove('hidden');
}

async function register(name, email, password, password_confirmation) {
    const data = await api('POST', '/register', { name, email, password, password_confirmation });
    saveAuth(data);
    closeModal();
    renderAuth();
    showToast('Аккаунт создан. Добро пожаловать, ' + data.user.name + '!');
    document.getElementById('btn-add-book').classList.remove('hidden');
}

async function logout() {
    try { await api('POST', '/logout'); } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    state.token = null;
    state.user  = null;
    renderAuth();
    renderBooks();
    document.getElementById('btn-add-book').classList.add('hidden');
    showToast('Вы вышли из системы.');
}

function saveAuth(data) {
    state.token = data.access_token;
    state.user  = data.user;
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
}

// ─── Data loading ─────────────────────────────────────────────────────────────
async function loadLibrary() {
    try {
        const data = await api('GET', '/library');
        document.getElementById('library-name').textContent = data.name || 'Библиотека';
        const parts = [];
        if (data.address)     parts.push(data.address);
        if (data.books_count) parts.push(data.books_count + ' книг');
        if (data.is_open !== undefined) parts.push(data.is_open ? 'Открыто' : 'Закрыто');
        document.getElementById('library-meta').textContent = parts.join(' · ');
    } catch {}
}

async function loadBooks() {
    document.getElementById('books-loading').classList.remove('hidden');
    document.getElementById('books-grid').innerHTML = '';
    document.getElementById('books-empty').classList.add('hidden');
    try {
        const qs = state.filter === 'available' ? '?available=true' : '';
        const data = await api('GET', `/books${qs}`);
        state.books = data.data || data;
        renderBooks();
    } catch {}
    document.getElementById('books-loading').classList.add('hidden');
}

async function loadAuthors() {
    document.getElementById('authors-loading').classList.remove('hidden');
    document.getElementById('authors-list').innerHTML = '';
    document.getElementById('authors-empty').classList.add('hidden');
    try {
        state.authors = await api('GET', '/authors');
        renderAuthors();
    } catch {}
    document.getElementById('authors-loading').classList.add('hidden');
}

// ─── Render ───────────────────────────────────────────────────────────────────
function renderAuth() {
    const el = document.getElementById('auth-section');
    if (state.user) {
        el.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-sm text-gray-600 hidden sm:inline">${esc(state.user.name)}</span>
                <button id="btn-logout" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Выйти</button>
            </div>`;
        document.getElementById('btn-logout').onclick = logout;
    } else {
        el.innerHTML = `
            <div class="flex gap-2">
                <button id="btn-login" class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Войти</button>
                <button id="btn-register" class="px-3 py-1.5 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">Регистрация</button>
            </div>`;
        document.getElementById('btn-login').onclick    = openLoginModal;
        document.getElementById('btn-register').onclick = openRegisterModal;
    }
}

function renderBooks() {
    const grid  = document.getElementById('books-grid');
    const empty = document.getElementById('books-empty');

    if (!state.books.length) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    grid.innerHTML = state.books.map(book => `
        <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between gap-2">
                <h3 class="font-semibold text-gray-900 leading-snug text-sm">${esc(book.title)}</h3>
                <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${book.is_available ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}">
                    ${book.is_available ? 'Доступна' : 'Выдана'}
                </span>
            </div>
            ${book.author ? `<p class="text-sm text-gray-500">${esc(book.author.name)}</p>` : ''}
            <div class="flex gap-3 text-xs text-gray-400">
                ${book.published_year ? `<span>${book.published_year}</span>` : ''}
                ${book.isbn ? `<span>ISBN: ${esc(book.isbn)}</span>` : ''}
            </div>
            ${book.description ? `<p class="text-sm text-gray-600 line-clamp-2">${esc(book.description)}</p>` : ''}
            ${state.user ? `
            <div class="flex gap-3 mt-auto pt-3 border-t border-gray-100">
                <button class="text-xs text-gray-500 hover:text-gray-800 transition-colors" data-edit="${book.id}">Редактировать</button>
                <button class="text-xs text-red-400 hover:text-red-600 transition-colors" data-delete="${book.id}">Удалить</button>
            </div>` : ''}
        </div>
    `).join('');

    grid.querySelectorAll('[data-edit]').forEach(btn => {
        btn.onclick = () => openEditBookModal(+btn.dataset.edit);
    });
    grid.querySelectorAll('[data-delete]').forEach(btn => {
        btn.onclick = () => deleteBook(+btn.dataset.delete);
    });
}

function renderAuthors() {
    const list  = document.getElementById('authors-list');
    const empty = document.getElementById('authors-empty');

    if (!state.authors.length) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    empty.classList.add('hidden');

    list.innerHTML = state.authors.map(a => `
        <div class="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
            <div>
                <h3 class="font-semibold text-gray-900">${esc(a.name)}</h3>
                ${a.born_year ? `<p class="text-xs text-gray-400">р. ${a.born_year}</p>` : ''}
            </div>
            ${a.bio ? `<p class="text-sm text-gray-600">${esc(a.bio)}</p>` : ''}
            ${a.books && a.books.length ? `
            <div class="mt-1 pt-3 border-t border-gray-100">
                <p class="text-xs text-gray-400 mb-1.5">Книги (${a.books.length})</p>
                <ul class="space-y-1">
                    ${a.books.map(b => `<li class="text-sm text-gray-700">${esc(b.title)}</li>`).join('')}
                </ul>
            </div>` : ''}
        </div>
    `).join('');
}

// ─── Tabs & filters ───────────────────────────────────────────────────────────
function setTab(tab) {
    state.tab = tab;
    document.getElementById('section-books').classList.toggle('hidden', tab !== 'books');
    document.getElementById('section-authors').classList.toggle('hidden', tab !== 'authors');

    const active   = 'py-3 text-sm font-medium border-b-2 border-gray-900 text-gray-900';
    const inactive = 'py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-700';
    document.getElementById('tab-books').className   = tab === 'books'   ? active : inactive;
    document.getElementById('tab-authors').className = tab === 'authors' ? active : inactive;

    if (tab === 'authors' && !state.authors.length) loadAuthors();
}

function setFilter(filter) {
    state.filter = filter;
    const on  = 'px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white';
    const off = 'px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50';
    document.getElementById('filter-all').className       = filter === 'all'       ? on : off;
    document.getElementById('filter-available').className = filter === 'available' ? on : off;
    loadBooks();
}

// ─── Modals ───────────────────────────────────────────────────────────────────
function openModal(title, bodyHtml) {
    document.getElementById('modal-title').textContent      = title;
    document.getElementById('modal-body').innerHTML         = bodyHtml;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function openLoginModal() {
    openModal('Войти', `
        <form id="form-login" class="flex flex-col gap-4">
            <div>
                <label class="block text-sm text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Пароль</label>
                <input type="password" name="password" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div id="form-error" class="hidden text-sm text-red-600"></div>
            <button type="submit" class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">Войти</button>
            <p class="text-center text-sm text-gray-500">Нет аккаунта?
                <button type="button" id="switch-to-register" class="text-gray-900 underline underline-offset-2">Зарегистрироваться</button>
            </p>
        </form>
    `);
    document.getElementById('form-login').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
            await login(fd.get('email'), fd.get('password'));
        } catch (err) {
            const el = document.getElementById('form-error');
            el.textContent = err.message;
            el.classList.remove('hidden');
        }
    };
    document.getElementById('switch-to-register').onclick = openRegisterModal;
}

function openRegisterModal() {
    openModal('Создать аккаунт', `
        <form id="form-register" class="flex flex-col gap-4">
            <div>
                <label class="block text-sm text-gray-700 mb-1">Имя</label>
                <input type="text" name="name" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Email</label>
                <input type="email" name="email" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Пароль</label>
                <input type="password" name="password" required minlength="8"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Подтвердите пароль</label>
                <input type="password" name="password_confirmation" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div id="form-error" class="hidden text-sm text-red-600"></div>
            <button type="submit" class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">Зарегистрироваться</button>
            <p class="text-center text-sm text-gray-500">Уже есть аккаунт?
                <button type="button" id="switch-to-login" class="text-gray-900 underline underline-offset-2">Войти</button>
            </p>
        </form>
    `);
    document.getElementById('form-register').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
            await register(fd.get('name'), fd.get('email'), fd.get('password'), fd.get('password_confirmation'));
        } catch (err) {
            const el = document.getElementById('form-error');
            el.textContent = err.message;
            el.classList.remove('hidden');
        }
    };
    document.getElementById('switch-to-login').onclick = openLoginModal;
}

function openBookModal(book) {
    state.editingBook = book || null;
    const opts = state.authors.map(a =>
        `<option value="${a.id}" ${book && book.author_id == a.id ? 'selected' : ''}>${esc(a.name)}</option>`
    ).join('');

    openModal(book ? 'Редактировать книгу' : 'Добавить книгу', `
        <form id="form-book" class="flex flex-col gap-4">
            <div>
                <label class="block text-sm text-gray-700 mb-1">Название *</label>
                <input type="text" name="title" required value="${book ? escAttr(book.title) : ''}"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Автор *</label>
                <select name="author_id" required
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900">
                    <option value="">Выберите автора</option>
                    ${opts}
                </select>
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-sm text-gray-700 mb-1">ISBN</label>
                    <input type="text" name="isbn" value="${book ? escAttr(book.isbn || '') : ''}"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
                <div>
                    <label class="block text-sm text-gray-700 mb-1">Год</label>
                    <input type="number" name="published_year" value="${book ? (book.published_year || '') : ''}" min="1000" max="2100"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
                </div>
            </div>
            <div>
                <label class="block text-sm text-gray-700 mb-1">Описание</label>
                <textarea name="description" rows="3"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none">${book ? esc(book.description || '') : ''}</textarea>
            </div>
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="is_available" ${!book || book.is_available ? 'checked' : ''}
                    class="rounded border-gray-300" />
                <span class="text-sm text-gray-700">Доступна для выдачи</span>
            </label>
            <div id="form-error" class="hidden text-sm text-red-600"></div>
            <button type="submit" class="w-full py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors">
                ${book ? 'Сохранить' : 'Добавить книгу'}
            </button>
        </form>
    `);

    document.getElementById('form-book').onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const payload = {
            title:          fd.get('title'),
            author_id:      parseInt(fd.get('author_id')),
            isbn:           fd.get('isbn') || null,
            published_year: fd.get('published_year') ? parseInt(fd.get('published_year')) : null,
            description:    fd.get('description') || null,
            is_available:   e.target.querySelector('[name=is_available]').checked,
        };
        try {
            if (state.editingBook) {
                await api('PUT', `/books/${state.editingBook.id}`, payload);
                showToast('Книга обновлена.');
            } else {
                await api('POST', '/books', payload);
                showToast('Книга добавлена.');
            }
            closeModal();
            await loadBooks();
        } catch (err) {
            const el = document.getElementById('form-error');
            el.textContent = err.message;
            el.classList.remove('hidden');
        }
    };
}

function openEditBookModal(id) {
    const book = state.books.find(b => b.id === id);
    if (book) openBookModal(book);
}

async function deleteBook(id) {
    if (!confirm('Удалить эту книгу?')) return;
    try {
        await api('DELETE', `/books/${id}`);
        showToast('Книга удалена.');
        await loadBooks();
    } catch (err) {
        showToast(err.message, true);
    }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(msg, isError = false) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.className = `fixed bottom-5 right-5 text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 text-white ${isError ? 'bg-red-600' : 'bg-gray-900'}`;
    el.classList.remove('hidden');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.add('hidden'), 3000);
}

// ─── Utils ────────────────────────────────────────────────────────────────────
function esc(s) {
    return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(s) {
    return String(s ?? '').replace(/"/g,'&quot;');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('modal').addEventListener('click', e => {
        if (e.target === document.getElementById('modal')) closeModal();
    });
    document.getElementById('modal-close').addEventListener('click', closeModal);

    document.getElementById('tab-books').addEventListener('click',   () => setTab('books'));
    document.getElementById('tab-authors').addEventListener('click', () => setTab('authors'));
    document.getElementById('filter-all').addEventListener('click',       () => setFilter('all'));
    document.getElementById('filter-available').addEventListener('click', () => setFilter('available'));
    document.getElementById('btn-add-book').addEventListener('click', () => openBookModal());

    renderAuth();
    if (state.user) document.getElementById('btn-add-book').classList.remove('hidden');

    loadLibrary();
    loadBooks();
    loadAuthors();
});
