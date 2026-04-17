<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Library</title>
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif
</head>
<body class="bg-gray-50 min-h-screen antialiased" style="font-family:'Instrument Sans',ui-sans-serif,system-ui,sans-serif">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
            <div>
                <h1 id="library-name" class="text-lg font-semibold text-gray-900">Библиотека</h1>
                <p id="library-meta" class="text-sm text-gray-400"></p>
            </div>
            <div id="auth-section" class="shrink-0"></div>
        </div>
    </header>

    <!-- Tabs -->
    <div class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 sm:px-6">
            <nav class="flex gap-6" id="tabs">
                <button id="tab-books" class="py-3 text-sm font-medium border-b-2 border-gray-900 text-gray-900">Книги</button>
                <button id="tab-authors" class="py-3 text-sm font-medium border-b-2 border-transparent text-gray-400 hover:text-gray-700">Авторы</button>
            </nav>
        </div>
    </div>

    <!-- Main -->
    <main class="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <!-- Books section -->
        <div id="section-books">
            <div class="flex items-center justify-between mb-6 gap-3 flex-wrap">
                <div class="flex gap-2">
                    <button id="filter-all" class="px-3 py-1.5 text-sm rounded-md bg-gray-900 text-white">Все</button>
                    <button id="filter-available" class="px-3 py-1.5 text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50">Доступные</button>
                </div>
                <button id="btn-add-book" class="hidden px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors">+ Добавить книгу</button>
            </div>
            <div id="books-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>
            <div id="books-empty" class="hidden text-center py-20 text-gray-400 text-sm">Книги не найдены.</div>
            <div id="books-loading" class="text-center py-20 text-gray-400 text-sm">Загрузка...</div>
        </div>

        <!-- Authors section -->
        <div id="section-authors" class="hidden">
            <div id="authors-list" class="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
            <div id="authors-empty" class="hidden text-center py-20 text-gray-400 text-sm">Авторы не найдены.</div>
            <div id="authors-loading" class="hidden text-center py-20 text-gray-400 text-sm">Загрузка...</div>
        </div>

    </main>

    <!-- Modal backdrop -->
    <div id="modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div class="p-6">
                <div class="flex items-center justify-between mb-5">
                    <h2 id="modal-title" class="text-base font-semibold text-gray-900"></h2>
                    <button id="modal-close" class="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
                </div>
                <div id="modal-body"></div>
            </div>
        </div>
    </div>

    <!-- Toast -->
    <div id="toast" class="hidden fixed bottom-5 right-5 text-sm px-4 py-2.5 rounded-xl shadow-lg z-50 text-white transition-all"></div>

</body>
</html>
