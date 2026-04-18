<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>@yield('title', 'Бібліотека')</title>
</head>
<body>
    <nav style="padding:12px; background:#f5f5f5">
        <a href="{{ route('books.index') }}">📚 Книги</a> |
        <a href="{{ route('authors.index') }}">👤 Автори</a>
    </nav>

    
    @if(session('success'))
        <div style="background:#d4edda; padding:10px; margin:8px">
            {{ session('success') }}
        </div>
    @endif

    <div style="padding:20px">
        @yield('content')
    </div>
</body>
</html>